"use strict";

/**
 * 
 * 
 * @param {Array|String} arg 
 * @returns {Any | String} the value inside the random position of the provided element
 */
const getRandomFrom = (arg) => {
    return arg[Math.floor(Math.random() * arg.length)];
}



/**
 * 
 * @description chooses a random element from a object with weighted keys
 * @param {Object} list 
 * @returns {String} Selected key of the object
 */
const getRandomFromWeightedList = (list)=> {

    let weightSum = 0;

    const states = Object.keys(list)

    for (let i = 0; i < states.length; i++) {
        weightSum += list[states[i]].__count__;
    }

    let i;
    let sum = 0;
    const r = Math.round(Math.random() * weightSum);

    for (i in list) {
        sum += list[i].__count__;
        if (r <= sum) return i;
    }
}


/**
 * 
 * @description returns the provided string with the first character capitalized, this only affects capitalizable characters, most symbols will remain unalteared
 * @param {String} str 
 * @returns {String}
 */
const capitalize = (str)=>{
    return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = {
    getRandomFrom,
    getRandomFromWeightedList,
    capitalize
}