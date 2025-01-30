
module.exports =  async (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}