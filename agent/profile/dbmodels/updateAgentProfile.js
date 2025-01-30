
const pool = require('../pgProfileAgentConnect')

module.exports = async (agentDetails) => {

    const client = await pool.connect()
    if (!client) {
        return new Error("Database connection failed")
    }

    try {

        let { agentUid, agentName, address } = agentDetails

        const updateFields = [];
        const values = [];
        let index = 1;

        if (agentName) {
            updateFields.push(`agentname = $${index++}`);
            values.push(agentName);
        }
        if (address) {
            updateFields.push(`address = $${index++}`);
            values.push(address);
        }

        if (updateFields.length === 0) {
            return res.status(400).json({ error: "No fields to update" });
        }

        values.push(agentUid);
        const query = `UPDATE agents_auth.agents_tbl 
                       SET ${updateFields.join(", ")} 
                       WHERE agent_uid = $${index} 
                       RETURNING agent_uid,agentname,address; `;


        const data = await client.query(query, values)

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

