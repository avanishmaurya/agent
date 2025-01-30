const pool = require('../pgQueriesConnect.js')

module.exports = async (queryId, replyText) => {

    const client = await pool.connect()
    if (!client) {
        return new Error("Database connection failed")
    }

    try {

        const valueAr = [queryId, replyText]
        const query = `UPDATE agent_management.agent_queries_tbl
                            set query_reply = $2,
                            replied_at = now()
                       WHERE 
                            query_id = $1
                        RETURNING *;
                        `

        const data = await client.query(query, valueAr);
        return {
            success: true,
            data: data.rows[0]
        }

    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: error.message
        };
    } finally {
        client.release();
    }
};
