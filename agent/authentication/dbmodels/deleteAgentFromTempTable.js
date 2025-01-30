const pool = require('../pgAuthAgentConnect')

module.exports = async (agentUid) => {

    const client = await pool.connect()
    if (!client) {
        return new Error("Database connection failed")
    }


    try {

        const valueAr = [agentUid]


        const query = `DELETE FROM 
                            agents_auth.temp_agent_data
                       WHERE 
                            id = $1
                       RETURNING *;`

        const data = await client.query(query, valueAr)

        return {
            success: true,
            data: data.rows[0]
        }

    } catch (error) {
        console.log("error: ", error.message)
        return {
            success: false,
            message: error.message
        };
    } finally {
        client.release();
    }
};

