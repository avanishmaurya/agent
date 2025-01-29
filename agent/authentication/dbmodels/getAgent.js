const pool = require('../pgAuthAgentConnect')

module.exports = async (agentId) => {

    const client = await pool.connect()
    if (!client) {
        return new Error("Database connection failed")
    }

    try {

        const valueAr = [agentId]

        const query = `SELECT 
                            * 
                       FROM 
                            agents_auth.login_tbl 
                       WHERE 
                            agent_id = $1;`

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
