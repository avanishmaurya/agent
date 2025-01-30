const pool = require('../pgProfileAgentConnect')

module.exports = async (agentUid,email) => {

    const client = await pool.connect()
    if (!client) {
        return new Error("Database connection failed")
    }

    try {

        const valueAr = [agentUid,email]


        const query = `UPDATE   
                            agents_auth.agents_tbl 
                         SET  email = $2,
                              email_verified = 't'
                         WHERE  
                            agent_uid = $1 
                        RETURNING agent_uid,email,email_verified;
                        `

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

