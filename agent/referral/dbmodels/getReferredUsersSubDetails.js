const pool = require('../pgReferralConnect')

module.exports = async (agentUid) => {
    const client = await pool.connect()
    if (!client) {
        return new Error("Database connection failed")
    }

    try {

        const valueAr = [];
        const escapedAgentUid = `'${agentUid}'`;
        const escapedAgentUid1 = `''${agentUid}''`;

        // Construct the SQL query with the escaped agent_uid
        const query = `
              SELECT * 
              FROM public.dblink('dbname=cross_words',
                  'SELECT DISTINCT ON (s.payment_id) 
                          s.payment_id,
                          u.user_uid, u.username, u.is_subscribed, 
                          s.subscription_status, s.start_date, s.end_date,
                           p.created_at, p.platform, p.payment_gateway,
                          COALESCE(
                              (jsonb_extract_path_text(po.order_details, ''amount''))::int, 
                              0
                          ) AS amount,
                          COALESCE(
                              (jsonb_extract_path_text(po.order_details, ''currency'')), ''INR''
                          ) AS currency
                  FROM users_auth.users_tbl u
                  LEFT JOIN payments_subscriptions.payments_tbl p 
                      ON u.user_uid = p.user_uid
                  LEFT JOIN payments_subscriptions.subscription_tbl s 
                      ON u.user_uid = s.user_uid AND p.id = s.payment_id 
                  LEFT JOIN payments_subscriptions.payments_orders_tbl po 
                      ON p.txn_order_id = po.txn_order_id 
                  WHERE u.user_uid IN (' || (
                      SELECT string_agg(quote_literal(user_uid), ',') 
                      FROM agent_management.referrals_tbl 
                      WHERE agent_uid = ${escapedAgentUid}
                  ) || ') ORDER BY s.payment_id, s.created_at DESC'
              ) AS remote_data(
                  payment_id uuid, user_uid UUID, username VARCHAR, is_subscribed BOOLEAN, 
                  subscription_status VARCHAR, start_date DATE, end_date DATE, 
                  created_at TIMESTAMP, platform VARCHAR, payment_gateway VARCHAR,
                  amount int, currency VARCHAR
              )
              JOIN public.dblink(
                  'dbname=agent_portal',
                  'SELECT user_uid, product_id ,referral_date
                   FROM agent_management.referrals_tbl 
                   WHERE agent_uid = ${escapedAgentUid1}
                   AND is_commission_paid = FALSE'
              ) AS ref_data(user_uid UUID, product_id INT,referral_date DATE) 
              ON remote_data.user_uid = ref_data.user_uid
              WHERE remote_data.is_subscribed ='t';
          `;

        // console.log(query); // Debugging output to verify query

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