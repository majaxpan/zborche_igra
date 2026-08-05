import { pool } from "@/lib/db";

export async function GET() {
    const today = new Date().toISOString().slice(0, 10);

    const result = await pool.query(
        `SELECT id
        FROM daily_games
        WHERE date = $1`, [today]
    )

    if (result.rows.length === 0) {
        let wordId;

        const wordResult = await pool.query(
            `select w.id
            from words as w
            left join daily_games as dg
            on w.id = dg.word_id
            where dg.id is null 
            and w.daily_eligible=true
            order by random()
            limit 1`,
        )

        if (wordResult.rows.length === 0) {
            const fallbackWordResult = await pool.query(
                `select w.id
                from words as w
                join daily_games as dg
                on w.id = dg.word_id
                where w.daily_eligible=true
                order by random()
                limit 1
                `
            )

            wordId = fallbackWordResult.rows[0].id

        } else {
            wordId = wordResult.rows[0].id
        }

        const gameresult = await pool.query(
            `
            insert into daily_games (date, word_id)
            values($1,$2)
            `, [today, wordId]
        );

        console.log(gameresult);
    }

    const gameResult = await pool.query(
        `SELECT id
     FROM daily_games
     WHERE date = $1`,
        [today]
    );

    return Response.json({
        date: today,
        gameId: gameResult.rows[0].id,
    });
}