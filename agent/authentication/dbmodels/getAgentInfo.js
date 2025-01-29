const pool = require('../pgAuthAgentConnect')

module.exports = async (agentId) => {

    const client = await pool.connect()
    if (!client) {
        return new Error("Database connection failed")
    }

    try {

        const valueAr = [agentId]

        const query = `SELECT 
                        agent_uid, agents_auth.agents_tbl.agent_id, hpassword
                    FROM 
                        agents_auth.agents_tbl, agents_auth.login_tbl
                    WHERE 
                        (agent_uid=$1) AND (login_tbl.agent_id = agents_tbl.agent_id);`

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
