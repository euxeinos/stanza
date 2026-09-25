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
