"use strict";



const getRandomFrom = (arg) => {
    return arg[Math.floor(Math.random() * arg.length)];
}




// chooses a random element from a object with weighted keys
const getRandomFromWeightedList = (list)=> {

    let weightSum = 0;
    let i;
    let sum = 0;

    const states = Object.keys(list)

    for (let i = 0; i < states.length; i++) {
        weightSum += list[states[i]].__count__;
    }

    const r = Math.round(Math.random() * weightSum);

    for (i in list) {
        sum += list[i].__count__;
        if (r <= sum) return i;
    }
}



//returns the provided string with the first character capitalized, this only affects capitalizable characters, most symbols will remain unalteared
const capitalize = (str)=>{
    return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = {
    getRandomFrom,
    getRandomFromWeightedList,
    capitalize
}