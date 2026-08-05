import { pool } from "@/lib/db";
import { cookies } from "next/headers";

import { checkWord } from "@/lib/gameLogic";


export async function POST(request) {
    const body = await request.json();
    const wordGuess = body.guess;
    const gameId = body.gameId;

    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sessionId")?.value;

    let calculatedStatus;

    const sessionExists = await pool.query(`
        select id 
        from sessions
        where id=$1
        `, [sessionId])

    if (!sessionId || sessionExists.rows.length === 0) {
        return Response.json({
            result: "INVALID_SESSION",
        });
    }

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

    const lastGuessStatusResult = await pool.query(`
        select status
        from game_guesses
        where session_id=$1
        and game_id=$2
        order by attempt desc
        limit 1
        `, [sessionId, gameId])

    if (lastGuessStatusResult.rows.length > 0 &&
        (lastGuessStatusResult.rows[0].status === "WON" || lastGuessStatusResult.rows[0].status === "LOST")) {
        return Response.json({
            result: "GAME_FINISHED",
        });
    }

    const numOfAttemptsResult = await pool.query(`
        select count(*) as num
        from game_guesses
        where session_id=$1
        and game_id=$2
        `, [sessionId, gameId])

    const numOfAttempts = Number(numOfAttemptsResult.rows[0].num);
    const attemptNumber = numOfAttempts + 1;

    const secretResult = await pool.query(
        `SELECT dg.word_id, w.word
        FROM daily_games AS dg
        JOIN words AS w
        ON w.id = dg.word_id
        WHERE dg.id = $1`,
        [gameId]
    );

    const secretWord = secretResult.rows[0].word;
    const secredWordId = secretResult.rows[0].word_id;
    const wordGuessId = result.rows[0].id;

    if(secredWordId === wordGuessId){
        calculatedStatus="WON";
    }
    else if (attemptNumber === 6){
        calculatedStatus="LOST";
    } else calculatedStatus="PLAYING";

    await pool.query(`
        insert into game_guesses(session_id, game_id, attempt, word_id, status)
        values($1,$2,$3,$4,$5)
        `, [sessionId, gameId, attemptNumber, wordGuessId, calculatedStatus])

    if (secredWordId === wordGuessId) {
        return Response.json({
            result: "CORRECT",
            colors: ["GREEN", "GREEN", "GREEN", "GREEN", "GREEN"],
        });
    }
    else {
        const colors = checkWord(wordGuess, secretWord);
        if (attemptNumber === 6) {
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