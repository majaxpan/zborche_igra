import { pool } from "@/lib/db";
import { checkWord } from "@/lib/gameLogic";


export async function POST(request) {
    const body = await request.json();
    const wordGuess = body.guess;
    const attempt = body.attempt;

    const today = new Date().toISOString().slice(0, 10);

    // Does the word exist in the guess list?
    const result = await pool.query(
        `SELECT id
        FROM words
        WHERE word = $1`,
        [wordGuess]
    );

    if (result.rows.length === 0) {
        return Response.json({
            result: "INVALID_WORD",
        });
    }

    const secretResult = await pool.query(
        `SELECT dg.word_id, w.word
        FROM daily_games AS dg
        JOIN words AS w
        ON w.id = dg.word_id
        WHERE dg.date = $1`,
        [today]
    );

    const secretWord = secretResult.rows[0].word;
    const secredWordId = secretResult.rows[0].word_id;
    const wordGuessId = result.rows[0].id;

    if (secredWordId === wordGuessId) {
        return Response.json({
            result: "CORRECT",
            colors: ["GREEN", "GREEN", "GREEN", "GREEN", "GREEN"],
        });
    }
    else {
        const colors = checkWord(wordGuess, secretWord);
        if (attempt === 5) {
            return Response.json({
                result: "LOST",
                colors: colors,
                secretWord: secretWord,
            });
        }

        return Response.json({
            result: "INCORRECT",
            colors: colors,
        });
    }
}