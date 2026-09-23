from parser import parse_poem

def test_parse_normal_poem():
    poem = "Line 1\nLine 2\n\nLine 3\nLine 4"
    result = parse_poem(poem)

    assert len(result) == 2
    assert result[0]["stanza_id"] == 1
    assert len(result[0]["lines"]) == 2
    assert result[0]["lines"][0]["text"] == "Line 1"
    assert result[0]["lines"][0]["line_id"] == 1

    assert result[1]["stanza_id"] == 2
    assert result[1]["lines"][1]["text"] == "Line 4"
    assert result[1]["lines"][1]["line_id"] == 4

def test_parse_dirty_poem():
    dirty_poem = "  Line 1  \n\n\n   Line 2   \n"
    result = parse_poem(dirty_poem)

    assert len(result) == 2
    assert result[0]["lines"][0]["text"] == "Line 1"
    assert result[1]["lines"][0]["text"] == "Line 2"

def test_parse_single_stanza_poem():
    single_stanza = "First line\nSecond line"

    result = parse_poem(single_stanza)

    assert len(result) == 1
    assert len(result[0]["lines"]) == 2
