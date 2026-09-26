# Stanza

A minimalist, distraction-free web application designed for progressive text memorization and active recall.

---

## Overview

Stanza helps you commit any text to memory — whether it is poetry, a keynote speech, a theatrical monologue, legal definitions, or prose excerpts. 

You provide the text, and the application breaks it down into manageable segments, stores them in a local relational database, and walks you through an interactive recall loop. Stanza prompts you using the preceding line as a context anchor, validating your input in real time.

## Key Features

- **Progressive Active Recall:** Guides you through text step by step, using the previous sentence or line as a memory trigger for the next one.
- **Universal Text Support:** Works equally well with multi-stanza poems, paragraph-based prose, speeches, scripts, and study materials.
- **Smart Punctuation Normalization:** Automatically handles Unicode punctuation (em-dashes, en-dashes, smart quotes, ellipses, hyphens) and letter casing. Focus on recalling the words, not fighting punctuation quirks.
- **Structured Relational Storage:** Parses and preserves text hierarchy in SQLite via FastAPI, allowing you to reload saved texts anytime by ID.
- **Zero-Bloat Vanilla Frontend:** Written in strict, statically typed TypeScript communicating directly with the DOM — no heavy client frameworks, virtual DOM overhead, or bundler bloat.
- **Terminal-Inspired Aesthetics:** Clean dark theme with monospace typography tailored for readability and focused typing sessions.

---

## Tech Stack

- **Backend:** Python 3.13, FastAPI, SQLite, SQLAlchemy, `uv`
- **Frontend:** TypeScript, Native DOM API, CSS3
- **Tooling & Environment:** Nix Flakes, GNU Make, `uvx livereload`

---

## Quickstart

### Prerequisites

Ensure you have [Nix](https://nixos.org/) with Flakes enabled (or Python 3.13+, Node.js, and `uv` installed manually).

### Running Locally

1. Enter the isolated development environment:
   ```bash
   nix develop
   ```

2. Start the full development stack (Backend + TypeScript Compiler + Live Server):
   ```bash
   make dev
   ```

3. Open your browser:

- **Frontend App:** http://localhost:8080
- **Interactive API Docs (Swagger):** http://localhost:8000/docs
