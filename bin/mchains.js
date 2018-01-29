(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["mchains"] = factory();
	else
		root["mchains"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const {getRandomFrom} = __webpack_require__(1);


const Chain = function (config = {}, training = undefined) {
    //default config
    this.order = config.order || 2;
    this.type = config.type || String;

    //property initializations
    this._states = {};
    this._outputConfig = {};

    //defaults for generate function
    this._defaultOutput = {
        minLength: this.order,
        maxLength: this.order*2,
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
            this._learnFromString(data);
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

Chain.prototype._learnFromString = function (data) {
    for (let i = 0; i < data.length - this.order+1; i++) {
        let ngram = data.substring(i, i + this.order);
        let next = undefined;
        if (i + this.order * 2 <= data.length) {
            next = data.substring(i + this.order, i + this.order * 2);
        }
        if (this.doesStateExist(ngram)) {
            this._states[ngram].__count__++;
            if (next) {
                if (!this._states[ngram][next]) {
                    this._states[ngram][next] = 1;
                } else {
                    this._states[ngram][next]++;
                }
            }
        } else {
            this._states[ngram] = {};
            if (next) {
                this._states[ngram][next] = 1;
            }
            this._states[ngram].__count__ = 1;

        }
    }


}


Chain.prototype.configOutput = function(config){
    this._outputConfig = config;
}

Chain.prototype._learnFromNumber = function (data) {

}


Chain.prototype._getChainStates = function(){
    return Object.keys(this._states);
}
Chain.prototype._getRandomState = function () {
    const states = Object.keys(this._states);
    return states[Math.random() * states.length << 0];
}


Chain.prototype._getNextState = function(state){
    const stateObj = this._states[state];
    if(stateObj){
        const states = Object.keys(stateObj).filter((state)=>{
            if(state !== '__count__'){
                return state;
            }
        });
        
        if( states.length > 0){
            return getRandomFrom(states);
        }else{
            return undefined;
        }
    }else{
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

    while(output.length < config.amount){

        let actualState = this._getRandomState();

        let string = actualState;

        const actualLength = config.minLength + Math.round((config.maxLength-config.minLength)*Math.random());

        /*
        
        Block that executes the string generation logic, 
        breaking from it without pushing the string element equals to 
        jump to next iteration of the loop without adding the string

        */
        stringGeneration:{
            while(string.length < actualLength){
                actualState = this._getNextState(actualState);
                if(actualState){
                    string += actualState;
                }else{
                    break stringGeneration;
                }
            }
            if(string.length > config.maxLength){
                if(config.cropToLength){
                    output.push(string.substring(0,config.maxLength));
                }else{
                    break stringGeneration;
                }
                
            }else{
                output.push(string);
            }
            
        }

    }
    
    
    return output;
}

module.exports = Chain;

/***/ }),
/* 1 */
/***/ (function(module, exports) {


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

/***/ })
/******/ ]);
});