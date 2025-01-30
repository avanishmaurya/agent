const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
dotenv.config()

module.exports = async (req, res, next) => {

    //// get authorization token from headers and put it in request body /////////

    let a_token = "";
    let agentUid = "";
    let agentId = "";

    if (req.headers && req.headers.authorization) {
        let auth = req.headers.authorization;

        if (auth && auth !== "undefined") {
            let token = auth.split(' ')[1];
            if (token && token !== "undefined") {
                a_token = token;
            }
        }
    }

    if (a_token && a_token !== "") {
        try {
            let token_result = jwt.verify(a_token, process.env.ACCESS_TOKEN_SECRET);

            // Extract values from the token if verification is successful
            agentUid = token_result.id;
            agentId = token_result.agentId;
        } catch (err) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
    }

    req.auth = {
        a_token,
        agentUid,
        agentId
    };

    next();
};
