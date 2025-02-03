
const pool = require('../pgProfileAgentConnect')

module.exports = async (agentDetails) => {

    const client = await pool.connect()
    if (!client) {
        return new Error("Database connection failed")
    }

    try {

        let { agentId,
            accountHolderName,
            accountNumber,
            ifscCode,
            branchName,
            bankName } = agentDetails


        await client.query('BEGIN');

        const query = `
              -- Mark previous records as inactive and insert new bank details
              with iu as (
                UPDATE agents_auth.agent_bank_tbl
                SET status = 'inactive'
                WHERE agent_id = $1
              )
              INSERT INTO agents_auth.agent_bank_tbl 
              (agent_id, bank_name, account_number, account_holder_name, ifsc_code, branch_name)
              VALUES ($1, $2, $3, $4, $5, $6)
              RETURNING agent_id, bank_name, account_number, account_holder_name, ifsc_code, branch_name;
            `;

        const values = [agentId, bankName, accountNumber, accountHolderName, ifscCode, branchName];
        const data = await client.query(query, values);

        await client.query('COMMIT');
        return {
            success: true,
            data: data.rows[0]
        }

    } catch (error) {
        console.log("error: ", error.message)
        await client.query('ROLLBACK'); // Rollback in case of error
        return {
            success: false,
            message: error.message
        };
    } finally {
        client.release();
    }
};

