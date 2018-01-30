const {
    getRandomFrom,
    getRandomFromWeightedList,
    capitalize
} = require('./utils');



/**
 * 
 * 
 * @param {Object} [config={}] 
 * @param {Object | String[] | String | undefined} [training=undefined]
 *  
 */
const Chain = function (config = {}, training = undefined) {
    //default config
    this.order = config.order || 2;
    this.type = config.type || String;
    if(this.type === String){
        this.stringType = config.stringType || 'character';
    }

    //property initializations
    this._states = {};
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

    } else if (typeof trainingData === 'string') {
        this._learnFrom(trainingData);
    } else {
        throw new Error(`unable to train from provided data, expected an array, an object or a ${this.type} and got a ${typeof trainingData}`);
    }
}


Chain.prototype._learnFrom = function (data) {
    switch (this.type) {
        case String:
            if(this.stringType === 'word'){
                this._learnFromWords(data);
            }else{
                this._learnFromCharacters(data);
            }
            
            break;
        case Number:
            this._learnFromNumber(data);
            break;
        default:
            this._learnFromString(data);
            break;
    }
}


Chain.prototype.doesStateExist = function (state) {
    for (var key in this._states) {
        if (this._states.hasOwnProperty(key)) {
            if (key === state) {
                return true;
            }
        }
    }
    return false;
}

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

Chain.prototype._learnFromWords = function(data){

    /*
    1- tokenize string into words
    2 - create the ngrams
    */
}


Chain.prototype.configOutput = function (config) {
    this._outputConfig = config;
}


Chain.prototype._learnFromNumber = function (data) {

}


Chain.prototype.getNgrams = function () {
    return this._getChainStates();
}

Chain.prototype._getChainStates = function () {
    return Object.keys(this._states);
}
Chain.prototype._getRandomState = function () {
    //const states = Object.keys(this._states);
    //return states[Math.random() * states.length << 0];
    return getRandomFromWeightedList(this._states);
}


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

Chain.prototype.generate = function (config = this._outputConfig) {

    for (var key in this._defaultOutput) {
        if (this._defaultOutput.hasOwnProperty(key)) {
            config[key] = config[key] || this._defaultOutput[key];
        }
    }

    let output = [];

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

            //checks to tweak the string in function of the configuration

            //length check and cropping
            if (string.length > config.maxLength) {
                if (config.cropToLength) {
                    string = string.substring(0, config.maxLength);
                } else {
                    break stringGeneration;
                }
            }

            //capitalize
            if (config.capitalizeFirst) {
                output.push(capitalize(string));
            } else {
                output.push(string);
            }

        }

    }


    return output;
}

module.exports = Chain;