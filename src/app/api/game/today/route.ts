import { pool } from "@/lib/db";
import { checkWord } from "@/lib/gameLogic";
import { checkSession, createSession } from "@/lib/sessions";
import { cookies } from "next/headers";
import { getDailyGameId } from "@/lib/dailyGame";
import { getGameHistory } from "@/lib/gameHistory";

export async function GET() {
    const today = new Date().toISOString().slice(0, 10);

    const cookieStore = await cookies();
    let sessionId = cookieStore.get("sessionId")?.value;

    const sessionExists = await checkSession(sessionId);

    if (!sessionExists){
        sessionId = await createSession();
        cookieStore.set("sessionId", sessionId);
    }

    const gameId = await getDailyGameId(today);

    const history = await getGameHistory(sessionId, gameId);

    const secretWordResult = await pool.query(
        `SELECT dg.word_id, w.word
        FROM daily_games AS dg
        JOIN words AS w
        ON w.id = dg.word_id
        WHERE dg.id = $1`, [gameId]
    )

    const secretWord = secretWordResult.rows[0].word;

    const historyWithColors = history.map((guess) => {
        const colors = checkWord(guess.word, secretWord);

        return {
            ...guess,
            colors: colors,
        };
    });

    console.log("History:", historyWithColors);

    return Response.json({
        date: today,
        gameId: gameId,
        history: historyWithColors,
    });
}