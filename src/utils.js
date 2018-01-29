
/**
 * 
 * 
 * @param {Array|String} arg 
 * @returns {Any | String} the value inside the random position of the provided element
 */
const getRandomFrom = (arg)=>{
    return arg[Math.random() * arg.length << 0];
}


module.exports = {
    getRandomFrom
}