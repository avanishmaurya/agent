const pool = require('../pgProfileAgentConnect')

module.exports = async (agentId) => {

    const client = await pool.connect()
    if (!client) {
        return new Error("Database connection failed")
    }

    try {

        const valueAr = [agentId]


        const query = `
                      SELECT *,convert_from(account_number, 'UTF-8') AS account_number
                      FROM
                          agents_auth.agent_bank_tbl
                      WHERE
                          agent_id = $1;
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

