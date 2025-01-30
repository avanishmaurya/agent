const nodemailer = require('nodemailer')
const dotenv = require("dotenv")
dotenv.config()

module.exports = async (email, otp) => {

    let transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_AUTH_USER,
            pass: process.env.EMAIL_AUTH_PASS
        }
    })

    message = {
        from: process.env.EMAIL_SENDER,
        to: [email],
        subject: "Lulugram",
        text: `Your OTP for Lulugram is: ${otp}`,
    }

    try {
        info = await transport.sendMail(message)
        //console.log("send otp to email ", info)
        return { success: true, info };

    } catch (err) {
        console.log(err.message)
        return { success: false, error: err.message }
    }
}
