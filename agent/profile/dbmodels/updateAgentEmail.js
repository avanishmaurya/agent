const pool = require('../pgProfileAgentConnect')

module.exports = async (agentUid, email) => {

    const client = await pool.connect()
    if (!client) {
        return new Error("Database connection failed")
    }

    try {

        const valueAr = [agentUid, email]


        const query = `WITH old_email AS (
                            SELECT email, prev_emails
                            FROM agents_auth.agents_tbl
                            WHERE agent_uid = $1
                        )
                        UPDATE agents_auth.agents_tbl
                        SET  
                            email = $2,
                            prev_emails = COALESCE(prev_emails, '[]'::JSONB) || 
                                          jsonb_build_array(
                                            jsonb_build_object('prev_email', (SELECT email FROM old_email), 'changed_at', NOW())
                                          ),
                            email_verified = 't'
                        WHERE  
                             agent_uid = $1
                        RETURNING agent_uid, email, prev_emails, email_verified;

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

