//? JOBB generátor?
function genereateCode() {
    let code = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 6; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code.toUpperCase();
}

module.exports = {
    genereateCode
};