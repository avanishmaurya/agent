const { resError599 } = require("../../../utils/resError");

module.exports = async (req, res) => {
    try {
        if (req.cookies) {
            res.cookie("r_t", "", { expire: new Date() - 1000, httpOnly: true });
            return res.status(200).json({
                success: true,
                message: "User logged out",
            });
        } else {
            return res.status(200).json({
                success: true,
                message: "User already logged out ",
            });
        }
    } catch (error) {
        console.log("error : ", error);
        return res.status(599).json(resError599);
    }
};
