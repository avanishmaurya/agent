const pool = require('../pgQueriesConnect')

module.exports = async (queryId) => {

    const client = await pool.connect()
    if (!client) {
        return new Error("Database connection failed")
    }

    try {
       
        const valueAr = [queryId]
        const query = `DELETE
                       FROM agent_management.agent_queries_tbl
                       WHERE
                           query_id=$1;
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
