const { parsePhoneNumberFromString } = require("libphonenumber-js");

module.exports = async (agentId, countryCode) => {

    const id = String(agentId);
    const country = "IN"
    countryCode = String(countryCode)
    

    //Check if it is a valid mobile number
    const phoneNumber = parsePhoneNumberFromString(id, country);
    if (phoneNumber && phoneNumber.isValid()) {
        return { isValid: true, number: phoneNumber.number };
    }else{
        return { type: "OTHER", isValid: false, userId: id };
    }

}
