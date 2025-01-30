const pool = require('../pgAuthAgentConnect')

module.exports = async (agent) => {

    const client = await pool.connect()
    if (!client) {
        return new Error("Database connection failed")
    }

    const { agentName, agentId, password, phone, countryCode,address } = agent

    try {

        const valueAr = [agentName, agentId, password, phone, countryCode,address]


        const query = `INSERT INTO agents_auth.temp_agent_data(
                            agentname,agent_id,hpassword,
                            phone_number,country_code,address)
                       VALUES
                             ($1,$2,$3,$4,$5,$6)
                       RETURNING 
                             id AS agent_uid,agent_id;`

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

