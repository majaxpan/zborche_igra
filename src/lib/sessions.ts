import { pool } from "@/lib/db";
import { randomUUID } from "crypto";

export async function checkSession(sessionId) {
    const sessionExists = await pool.query(`
            select id 
            from sessions
            where id=$1
            `, [sessionId])

    if (sessionId && sessionExists.rows.length > 0) {
        await pool.query(`
                update sessions
                set last_seen_at= now()
                where id=$1
                `, [sessionId])
        return true;
    }
    return false;
}

export async function createSession() {
    const newSessionId = randomUUID();

    await pool.query(`
                insert into sessions(id)
                values($1)
                `, [newSessionId])

    return newSessionId;
}
