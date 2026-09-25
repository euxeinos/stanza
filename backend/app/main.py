from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database.connection import init_db, get_db
from app.database.models import Poem, Stanza, Line
from app.parser import parse_poem

app = FastAPI(title="STANZA API")

init_db()

origins = [
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "http://localhost:8080",
    "http://127.0.0.1:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

class PoemInput(BaseModel):
    text: str
    title: str = "No title"
    author: str = "Unknown author"

@app.post("/api/v1/poems")
def create_poem_endpoint(payload: PoemInput, db: Session = Depends(get_db)):
    """ Takes text, parces it and saves its structure to database """

    parsed_structure = parse_poem(payload.text)
    db_poem = Poem(title=payload.title, author=payload.author)
    db.add(db_poem)
    db.flush()

    for stanza_data in parsed_structure:
        db_stanza = Stanza(
            order_number=stanza_data["stanza_id"],
            poem_id=db_poem.id
        )
        db.add(db_stanza)
        db.flush()

        for line_data in stanza_data["lines"]:
            db_line = Line(
                order_number=line_data["line_id"],
                text=line_data["text"],
                stanza_id=db_stanza.id
            )
            db.add(db_line)

    db.commit()
    db.refresh(db_poem)

    return {"status": "success", "poem_id": db_poem.id, "title": db_poem.title}

@app.get("/api/v1/poems/{poem_id}")
def get_poem_endpoint(poem_id: int, db: Session = Depends(get_db)):
    """ Get saved text from database """

    poem = db.query(Poem).filter(Poem.id == poem_id).first()

    if not poem:
        raise HTTPException(status_code=404, detail="Poem not found")

    result = []
    for stanza in poem.stanzas:
        stanza_data = {
            "stanza_id": stanza.order_number,
            "lines": [
                {"line_id": line.order_number, "text": line.text}
                for line in stanza.lines
            ]
        }
        result.append(stanza_data)

    return {
        "id": poem.id,
        "title": poem.title,
        "author": poem.author,
        "stanzas": result
    }
