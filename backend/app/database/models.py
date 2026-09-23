from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class Poem(Base):
    __tablename__ = "poems"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=True, default="Без названия")
    author = Column(String, nullable=True, default="Неизвестный автор")
    stanzas = relationship("Stanza", back_populates="poem", cascade="all, delete-orphan")


class Stanza(Base):
    __tablename__ = "stanzas"
    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(Integer, nullable=False)
    poem_id = Column(Integer, ForeignKey("poems.id", ondelete="CASCADE"), nullable=False)
    poem = relationship("Poem", back_populates="stanzas")
    lines = relationship("Line", back_populates="stanza", cascade="all, delete-orphan")


class Line(Base):
    __tablename__ = "lines"
    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(Integer, nullable=False)
    text = Column(String, nullable=False)
    stanza_id = Column(Integer, ForeignKey("stanzas.id", ondelete="CASCADE"), nullable=False)
    stanza = relationship("Stanza", back_populates="lines")
