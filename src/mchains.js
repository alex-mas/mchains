"use strict";

const {
    getRandomFrom,
    getRandomFromWeightedList,
    capitalize
} = require('./utils');



/**
 * 
 * @description - Constructs a Chain object with the provided configuration, if training data is provided it will also train on that data
 * @param {Object} [config={}]
 * @param {Number} [config.order = 2] - The order of the chain, that will decide how many elements get grouped together to form each state
 * @param {String} [config.type = 'character'] - Conditional property: Only provide it if config.type is String, it can take two values: 'character' and 'word'. Depending on the value provided the strings will be parsed as words or as characters respectively
 * @param {Object | String[] | String | undefined} [training=undefined]
 *  
 */
const Chain = function (config = {}, training = undefined) {
    //default config
    this.order = config.order || 2;
    this.type = config.type || 'character';

    //property initializations
    this._states = {
    };

    this._outputConfig = {};

    //defaults for generate function
    this._defaultOutput = {
        minLength: this.order,
        maxLength: this.order * 2,
        amount: 1,
        capitalizeFirst: false,
        cropToLength: true

    };

    //optional training data parsing
    if (training) {
        this.train(training);
    }
}


/**
 * @description Trains the chain on the provided data, creating and altering states
 * @public
 * @param {Any} trainingData - Data structure to recursively iterate finding the root elements and adding them to training
 */
Chain.prototype.train = function (trainingData) {
    if (typeof trainingData === 'object') {
        if (Array.isArray(trainingData)) {
            trainingData.forEach((element) => {
                this.train(element);
            });
        } else {
            for (var key in trainingData) {
                if (trainingData.hasOwnProperty(key)) {
                    this.train(trainingData[key]);
                }
            }
        }

    } else {
        this._learnFrom(trainingData);
    }
}


/**
 * @description Wrapper function that calls the correct function to learn from provided data
 * @private
 * @param {Any} data - Data to add to the chain states
 * @returns {void}
 */
Chain.prototype._learnFrom = function (data) {
    if (this.type == 'word') {
        this._learnFromWords(data);
    } else {
        this._learnFromCharacters(data);
    }

}


/**
 * @description - Returns wether or not the provided param is a state inside the chain
 * @public
 * @param {String} state - Key to iterate states looking for a match
 * @returns {Boolean}
 */
Chain.prototype.doesStateExist = function (state) {
    if (this._states.hasOwnProperty(state)) {
        return true;
    }
    return false;
}



/**
 * @description adds all provided ngrams of characters to the chain states
 * @private
 * @param {String} data - string to be parsed as individual characters and added to the chain
 * @returns {void}
 */
Chain.prototype._learnFromCharacters = function (data) {
    for (let i = 0; i < data.length - this.order + 1; i++) {

        let ngram = data.substring(i, i + this.order);
        //set the string following the ngram
        let next = undefined;
        if (i + this.order * 2 <= data.length) {
            next = data.substring(i + this.order, i + this.order * 2);
        }

        //add the following strings to the ngrams array
        if (this.doesStateExist(ngram)) {
            this._states[ngram].__count__++;
        } else {
            this._states[ngram] = {
                neighbors: []
            };
            this._states[ngram].__count__ = 1;
        }
        if (next) {
            this._states[ngram].neighbors.push(next);
        }
    }
}

/**
 * @description adds all provided ngrams of words to the chain states
 * @private
 * @param {String} data - string to be parsed as words and added to the chain
 * @returns {void}
 */
Chain.prototype._learnFromWords = function (data) {
    //tokenize string into words
    data = data.replace(new RegExp('\r?\n', 'g'), ' ');
    let words = data.split(' ');

    //iterate words array updating the ngrams
    for (let i = 0; i < words.length - this.order + 1; i++) {
        //get ngram
        let ngram = words[i];
        for (let j = 1; j < this.order; j++) {
            ngram = ngram.concat(' ' + words[i + j]);
        }
        //add state to chain
        if (this.doesStateExist(ngram)) {
            this._states[ngram].__count__++;
        } else {
            this._states[ngram] = {
                neighbors: []
            };
            this._states[ngram].__count__ = 1;
        }
        //if there's a next element add it to the chain neighbors
        if (words[i + this.order * 2]) {
            let neighbor = words[i + this.order];
            for (let j = 1; j < this.order; j++) {
                neighbor = neighbor.concat(' ' + words[i + this.order + j]);
            }
            this._states[ngram].neighbors.push(neighbor);
        }
    }
}


/**
 * @description - Sets the output config user defaults to be used when generating output from the chain
 * @public
 * @param {Object} config 
 * @returns {void}
 */
Chain.prototype.configOutput = function (config) {
    this._outputConfig = config;
}


/**
 * @public
 * @description - Returns the array containing the keys that make the chain states object
 * @returns {String[]} the array of the states of the chain
 */
Chain.prototype.getNgrams = function () {
    return this._getChainStates();
}



/**
 * @private
 * @description - returns an arary with the state idenfitifers of the chain
 * @returns {String[]} the array of the states of the chain
 */
Chain.prototype._getChainStates = function () {
    return Object.keys(this._states);
}


/**
 * @private
 * @description - returns a random state from the wheighted list of states
 * @returns {String[]} the array of the states of the chain
 */
Chain.prototype._getRandomState = function () {
    return getRandomFromWeightedList(this._states);
}



/**
 * @private
 * @description - Takes a state identifier and returns a random state that conects with it, that is, from all the states that can be reached from this state
 * @param {String | Symbol | Number | } state - identifier of the state that will be used to search for its subordinate states
 * @returns {String | Symbol | Number | undefined} They key that identifies the selected state
 */
Chain.prototype._getNextState = function (state) {
    const stateObj = this._states[state];
    if (stateObj) {
        const states = stateObj.neighbors;
        if (states.length > 0) {
            return getRandomFrom(states);
        } else {
            return undefined;
        }
    } else {
        return undefined;
    }

}


/**
 * @private
 * @description - Takes a configuration object previously parsed by the generate function wrapper and generates sentences following the parameters specified by the configuration
 * @param {Object} config - object with configuration variables to tweak how the sentences are generated
 * @returns {String[]} - String array containing all generated sentences
 */
Chain.prototype._generateSentences = function (config) {
    //note: the config comes parsed from the generate function
    let output = [];
    while (output.length < config.amount) {
        let actualState = this._getRandomState();
        let sentence = actualState;
        let words = 0;

        //number of words in the sentence
        const actualLength = config.minLength + Math.round((config.maxLength - config.minLength) * Math.random());

        sentenceGeneration: {
            while (words < actualLength) {
                actualState = this._getNextState(actualState);
                if (actualState) {
                    sentence += ' ' + actualState;
                    words += this.order;
                } else {
                    break sentenceGeneration;
                }
            }
            output.push(sentence);
        }
    }
    return output;

}


Chain.prototype._generateWords = function (config) {

    let output = [];
    //on each loop iteration if conditions are met a word will be pushed
    while (output.length < config.amount) {

        let actualState = this._getRandomState();

        let string = actualState;

        const actualLength = config.minLength + Math.round((config.maxLength - config.minLength) * Math.random());

        /*
        
        Block that executes the string generation logic, 
        breaking from it without pushing the string element equals to 
        jump to next iteration of the loop without adding the string
 
        */
        stringGeneration: {
            //loop to generate the string
            while (string.length < actualLength) {
                actualState = this._getNextState(actualState);
                if (actualState) {
                    string += actualState;
                } else {
                    break stringGeneration;
                }
            }

            //length check and cropping
            if (string.length > config.maxLength) {
                if (config.cropToLength) {
                    string = string.substring(0, config.maxLength);
                } else {
                    break stringGeneration;
                }
            }

            //capitalize the word if the configuration says so
            if (config.capitalizeFirst) {
                output.push(capitalize(string));
            } else {
                output.push(string);
            }

        }

    }
    return output;
}


/**
 * @description - Takes an optional configuration objet that alters how the generator works, if no configuration the default values on each parameter will be used, then it calls the apropiate generator function.
 * @public
 * @param {Object} [config=this._outputConfig] 
 * @param {Number} [config.minLength=chain order] - minimum length of the generated data, that is, length in characters/words/digits depending on what the chain type is
 * @param {Number} [config.maxLength=chain order*2] - minimum length of the generated data, that is, length in characters/words/digits depending on what the chain type is
 * @param {Number} [amount=1] - Amount of output units to generate, where an output unit is a sentence/word/number depending on the chain type
 * @param {Boolean} [capitalizeFirst=false] - Wether to capitalize first character of words, do not provide this if chain is not based on strings parsed as characters
 * @param {Boolean} [cropToLength=true] - Wether to crop the output to the maximum length provided, if set to false the generator will discard output that surpases the maximum length, efectively taking longer, setting it to true will crop the output creating subsections of the chains which might not be desired
 * @returns {String[]}
 */
Chain.prototype.generate = function (config = this._outputConfig) {

    //bootstrap properties into configuration local object
    for (var key in this._defaultOutput) {
        if (this._defaultOutput.hasOwnProperty(key)) {
            config[key] = config[key] || this._defaultOutput[key];
        }
    }

    if (this.type === 'word') {
        return this._generateSentences(config);
    } else {
        return this._generateWords(config);
    }

}

module.exports = Chain;