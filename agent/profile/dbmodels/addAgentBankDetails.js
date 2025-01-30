const pool = require('../pgProfileAgentConnect')

module.exports = async (bankDetails) => {

    const client = await pool.connect()
    if (!client) {
        return new Error("Database connection failed")
    }

    try {
        let { agentId,accountHolderName,accountNumber,ifscCode,branchName,bankName } = bankDetails

        const valueAr = [agentId, bankName,accountNumber,accountHolderName,ifscCode,branchName]


        const query = `
                    INSERT INTO  agents_auth.agent_bank_tbl 
                        (agent_id,bank_name,account_number,account_holder_name,ifsc_code,branch_name
                        )   
                    VALUES (
                        $1,$2,$3,$4,$5,$6
                            )
                    RETURNING
                        *;
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

