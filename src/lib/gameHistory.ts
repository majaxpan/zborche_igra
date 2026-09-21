import { pool } from "@/lib/db";

export async function getGameHistory(sessionId, gameId) {
    const historyResult = await pool.query(
        `select w.word, attempt, status
            from game_guesses as gg
            join words as w
            on gg.word_id=w.id
            where gg.session_id=$1 
            and gg.game_id=$2
            order by gg.attempt asc`, [sessionId, gameId]
    )
    return historyResult.rows;
}