const pool = require('../pgFeedbackConnect')

module.exports = async (agentUid,feedbackText, feedbackType) => {

    const client = await pool.connect()
    if (!client) {
        return new Error("Database connection failed")
    }
    
    try {

        const valueAr = [agentUid, feedbackText, feedbackType]
        const query = `INSERT INTO agent_management.agent_feedback_tbl(
                                  agent_uid, feedback_text, feedback_type
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
