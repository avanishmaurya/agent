module.exports = async () => {

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const digits = "0123456789";

    let result = ["A"];
    let randChars = []
    let randNums = []
    for (let i = 0; i < 4; i++) {
        randChars.push(letters.charAt(Math.floor(Math.random() * letters.length)));
    }
    await fisherYatesShuffle(randChars)
    
    for (let i = 0; i < 4; i++) {
        randNums.push(digits.charAt(Math.floor(Math.random() * digits.length)));
    }
    await fisherYatesShuffle(randNums)
   
    const randCharNum = randChars.concat(randNums)
    let result2 = result.concat(randCharNum)

    return result2.join('');

}

async function fisherYatesShuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        // Pick a random index from 0 to i
        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}





