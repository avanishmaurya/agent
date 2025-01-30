module.exports = async () => {

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const digits = "0123456789";

    let result = [];
    for (let i = 0; i < 3; i++) {
        result.push(letters.charAt(Math.floor(Math.random() * letters.length)));
    }

    for (let i = 0; i < 5; i++) {
        result.push(digits.charAt(Math.floor(Math.random() * digits.length)));
    }

    result = await fisherYatesShuffle(result)

    result.unshift('A') //// Adding 'U' in the begining because User number starts with "U" for users
    return result.join('');

}

async function fisherYatesShuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        // Pick a random index from 0 to i
        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}





