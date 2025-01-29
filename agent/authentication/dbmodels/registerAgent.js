const pool = require("../pgAuthAgentConnect");
const generateAgentNumber = require("../utils/generateAgentNumber");

module.exports = async (agent) => {
    const client = await pool.connect();
    if (!client) {
        return new Error("Database connection failed");
    }

    const {uid,agentName,agentId,hpassword,phoneNumber,countryCode,address} = agent;

    try {
        const valueAr = [];
        const agentNumber = await uniqueAgentNumber(client);

        const query = `BEGIN;
                        INSERT INTO agents_auth.agents_tbl(agent_uid,
                        agent_id,agentname,phone_number,country_code,agent_referal_code,address
                        )   
                    VALUES (
                       '${uid}','${agentId}', '${agentName}','${phoneNumber}', '${countryCode}', '${agentNumber}','${JSON.stringify(address)}')
                    RETURNING
                        *;
                    INSERT INTO 
                        agents_auth.login_tbl (agent_id,hpassword,agentname,login_time)
                    VALUES 
                        ('${agentId}', '${hpassword}', '${agentName}', now())
                    RETURNING 
                        *;
                    COMMIT;`;

        const data = await client.query(query, valueAr);
        const data1 = data[1].rows; // data[1] is correct

        return {
            success: true,
            data: data1[0],
        };
    } catch (error) {
        console.log("error: ", error);
        return {
            success: false,
            message: error.message,
        };
    } finally {
        client.release();
    }
};

async function uniqueAgentNumber(client) {
    const agentNumber = await generateAgentNumber();
    const query1 = `SELECT COUNT(*) AS row_count
                        FROM agents_auth.agents_tbl
                       WHERE agent_referal_code = $1;`;
    const valueAr1 = [agentNumber];
    try {
        const data = await client.query(query1, valueAr1);
        if (data.row_count > 0) {
            await uniqueAgentNumber();
        } else {
            return agentNumber;
        }
    } catch (error) {
        console.log(error);
        return "";
    }
}
