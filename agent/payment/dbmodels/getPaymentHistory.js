const pool = require('../pgPaymentConnect')

module.exports = async (agentUid) => {
    const client = await pool.connect()
    if (!client) {
        return new Error("Database connection failed")
    }

    try {

        const valueAr = [agentUid];
       
        // Construct the SQL query with the escaped agent_uid
        const query = `SELECT * FROM use`;

        const data = await client.query(query, valueAr);
        return {
            success: true,
            data: data.rows
        }

    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message
        };
    } finally {
        client.release()
    }
};