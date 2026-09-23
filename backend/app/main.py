from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from sqlalchemy.orm import Session

from app.database.connection import init_db, get_db
from app.database.models import Poem, Stanza, Line

def parse_poem(raw_text: str) -> list:
    raw_text = raw_text.replace("\\n", "\n")

    raw_lines = raw_text.splitlines()
    cleaned_lines = [line.strip() for line in raw_lines]

    stanzas = []
    current_stanza_lines = []
    line_counter = 1
    stanza_counter = 1

    for line in cleaned_lines:
        if line == "":
            if current_stanza_lines:
                stanzas.append({
                    "stanza_id": stanza_counter,
                    "lines": current_stanza_lines
                })
                stanza_counter += 1
                current_stanza_lines = []
        else:
            current_stanza_lines.append({
                "line_id": line_counter,
                "text": line
            })
            line_counter += 1

    if current_stanza_lines:
        stanzas.append({
            "stanza_id": stanza_counter,
            "lines": current_stanza_lines
        })

    return stanzas


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
    """ Accepts text, parces it and saves its structure to database."""

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
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Poem not found in database")

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
