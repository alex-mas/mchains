
/**
 * 
 * 
 * @param {Array|String} arg 
 * @returns {Any | String} the value inside the random position of the provided element
 */
const getRandomFrom = (arg) => {
    return arg[Math.random() * arg.length << 0];
}


const getRandomFromWeightedList = (list)=> {
    let weightSum = 0;
    const states = Object.keys(list)
    for (let i = 0; i < states.length; i++) {
        weightSum += list[states[i]].__count__;
    }

    let i,
        sum = 0,
        r = Math.round(Math.random() * weightSum);
    for (i in list) {
        sum += list[i].__count__;
        if (r <= sum) return i;
    }
}

const capitalize = (str)=>{
    return str.charAt(0).toUpperCase() + str.slice(1);
}
module.exports = {
    getRandomFrom,
    getRandomFromWeightedList,
    capitalize
}