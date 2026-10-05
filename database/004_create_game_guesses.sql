CREATE TABLE game_guesses (
    session_id UUID NOT NULL REFERENCES sessions(id),
    game_id INTEGER NOT NULL REFERENCES daily_games(id),
    attempt INTEGER NOT NULL,
    word_id INTEGER NOT NULL REFERENCES words(id),
    status VARCHAR(10) NOT NULL,
    PRIMARY KEY (session_id, game_id, attempt)
);