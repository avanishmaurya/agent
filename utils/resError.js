resError400 = {
    success: false,
    message: "Error: Bad Request"
}

resError401 = {
    success: false,
    message: "Error: Authentication"
}

resError403 = {
    success: false,
    message: "Error: Authorization"
}

resError404 = {
    success: false,
    message: "Error: Not Found"
}
resError406 = {
    success: false,
    message: "Error: Not Acceptable"
}

resError500 = {
    success: false,
    message: "Error: Internal"
}

resError502 = {
    success: false,
    message: "Error: Bad Gateway"
}

resError599 = {
    success: false,
    message: "Error: Network Connect"
}

module.exports = {resError400, resError401, resError403, resError404, resError500,resError502,
                  resError599 }

