import { pool } from "@/lib/db";

export async function getDailyGameId(today) {

    const gameExists = await pool.query(
            `SELECT id
            FROM daily_games
            WHERE date = $1`, [today]
    )

    if (gameExists.rows.length === 1){
        return gameExists.rows[0].id;
    }
    else{
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
                returning id
                `, [today, wordId]
        );

        return gameresult.rows[0].id;
    }
}