const pool = require('../pgReferralConnect')

module.exports = async (agentUid) => {
    const client = await pool.connect()
    if (!client) {
        return new Error("Database connection failed")
    }

    try {

        const valueAr = [agentUid];

        const query = `SELECT 
            p.product_id, 
            p.product_name, 
            COUNT(CASE WHEN s.is_subscribed = TRUE THEN 1 END) AS subscribed_count, 
            COUNT(CASE WHEN s.is_subscribed = FALSE THEN 1 END) AS not_subscribed_count,
            COUNT(r.referral_id) AS total_count  -- Total number of users referred for this product
        FROM 
            agent_management.products_tbl p  -- Start with all products
        LEFT JOIN 
            agent_management.referrals_tbl r ON r.product_id = p.product_id  -- LEFT JOIN to include all products
        LEFT JOIN 
            public.dblink('dbname=cross_words', 
                'SELECT user_uid, is_subscribed FROM users_auth.users_tbl') 
            AS s(user_uid UUID, is_subscribed BOOLEAN) 
            ON r.user_uid = s.user_uid  -- Join with the subscription table from the referral database
        WHERE 
            r.agent_uid = $1 OR r.product_id IS NULL -- Ensure products without referrals are included
        GROUP BY 
            p.product_id, p.product_name;`

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
