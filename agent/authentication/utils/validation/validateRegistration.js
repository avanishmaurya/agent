const validateAgentId = require("./validateAgentId");

module.exports = async (registrationData) => {

    let { agentName, agentId, password, countryCode, address } = registrationData;

    let { city, district, state, pinCode, addressLine} = address;

    let agentData = {};
    let errors = {
        numError: 0,
        agentName: "",
        agentId: "",
        password: "",
        countryCode: "",
        address: "",
    };

    // validate userName
    if (!agentName) {
        errors.agentName = "Empty name not allowed";
        errors.numError += 1;
    } else if (agentName.length < 2) {
        errors.agentName = "Minimum 2 characters required";
        errors.numError += 1;
    }
    if (!countryCode) {
        errors.countryCode = "Country code required";
        errors.numError += 1;
    }
    // validate agentId
    if (!agentId) {
        errors.agentId = "Empty agentId";
        errors.numError += 1;
    } else {
        agentData.phone = "";
        agentData.agentId = "";

        let agentIdValidation = await validateAgentId(agentId);

        if (agentIdValidation.isValid) {
            agentData.phone = agentIdValidation.agentId;
            agentData.agentId = agentIdValidation.agentId;
        } else {
            errors.agentId = "AgentId must be a valid mobile number";
            errors.numError += 1;
        }
    }

    // validate password
    if (!password) {
        errors.password = "Password required";
        errors.numError += 1;
    } else if (password.length < 8) {
        errors.password = "Password : min characters 8";
        errors.numError += 1;
    }
    // validate address
    if (!state || !pinCode || !addressLine) {
        errors.address = "Address fields needs to be filled";
        errors.numError += 1;
    }

    agentData.errors = errors;

    return agentData;
};
