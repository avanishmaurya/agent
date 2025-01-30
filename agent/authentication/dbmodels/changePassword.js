const pool = require('../pgAuthAgentConnect')

module.exports = async (agentId,hashedPassword) => {

    const client = await pool.connect()
    if (!client) {
        return new Error("Database connection failed")
    }

    try {

        const valueAr = [agentId,hashedPassword]

        const query = `UPDATE agents_auth.login_tbl 
                     SET 
                       hpassword = $2, updated_on = to_timestamp(${Date.now()/1000})
                     WHERE
                       agent_id = $1
                    RETURNING 
                       agent_id, agentname;`

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
