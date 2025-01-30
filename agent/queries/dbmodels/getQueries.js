const pool = require('../pgQueriesConnect')

module.exports = async (agentUid) => {

    const client = await pool.connect()
    if (!client) {
        return new Error("Database connection failed")
    }

    try {
       
        const valueAr = [agentUid]
        const query = `SELECT *
                       FROM agent_management.agent_queries_tbl
                       WHERE
                           agent_uid=$1;
                        `

        const data = await client.query(query, valueAr);

        return {
            success: true,
            data: data.rows
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
