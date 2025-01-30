const pool = require('../pgQueriesConnect.js')

module.exports = async (agentUid, queryTitle, queryDescription) => {

    const client = await pool.connect()
    if (!client) {
        return new Error("Database connection failed")
    }

    try {

        const valueAr = [agentUid, queryTitle, queryDescription]
        const query = `INSERT INTO agent_management.agent_queries_tbl(
                                  agent_uid, query_title, query_description
                            )
                        VALUES($1, $2, $3)
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
