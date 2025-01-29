const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.hashPassword= async (password) =>  {
    let hashedPassword = await bcrypt.hash(password, saltRounds)
    return hashedPassword
   
 }
 
 exports.comparePassword = async (plainPassword, hashedPassword) => {
    let match = await bcrypt.compare(plainPassword, hashedPassword)
    return match
 };
 