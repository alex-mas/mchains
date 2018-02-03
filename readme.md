mchains.js
==========================


#install 
```
npm i mchains --save
```

#usage

Right now only string chains are supported
```javascript 

//yourFile.js
const Chain = require('mchains');


//chain with configuration and training data
let chain = new Chain({
            order: 2,
            type: String,
        }, 'this is a string, you can insert an array with strings too');

let untrainedChain =  new Chain();

untrainedChain.train(['first string', 'second string' ...yourData]);

let arrayOfStrings = chain.generate();// possible output ['stri', 'you ', 'inse']

```

#documentation

Properties
Note: there are some public properties that are ment to be readonly:
```javascript

let chain = new Chain();

chain.order //returns the order of the chain
chain.type //returns the constructor the identifies the chain type --> String;
chiain.stringType // returns the method used to parse strings  -> 'character' or 'word'

```

methods
```javascript



/**
 * 
 * Constructs a Chain object with the provided configuration, if training data is provided it will also train on that data
 * @param {Object} [config={}]
 * @param {Number} [config.order = 2] - The order of the chain, that will decide how many elements get grouped together to form each state
 * @param {Function} [config.type = String] - the constructor of the element that we will construct the chain from. Defaults to String
 * @param {String} [config.stringType = 'character'] - Conditional property: Only provide it if config.type is String, it can take two values: 'character' and 'word'. Depending on the value provided the strings will be parsed as words or as characters respectively
 * @param {Object | String[] | String | undefined} [training=undefined]
 *  
 */
Chain();


//methods
let chain = new Chain();

// takes a string, an array of strings or an object who's keys are strings
//recursively iterates the provided training data looking for strings
chain.train() 

//looks for the provided string in the states internal object and returns a boolean
chain.doesStateExist()




/**
 * 
 * Provides an object with the user defined parameters to be used as defaults for generate method
 * 
 * @param {Object} [config=this._outputConfig] 
 * @param {Number} [config.minLength=chain order] - minimum length of the generated data, that is, length in characters/words/digits depending on what the chain type is
 * @param {Number} [config.maxLength=chain order*2] - minimum length of the generated data, that is, length in characters/words/digits depending on what the chain type is
 * @param {Number} [config.amount=1] - Amount of output units to generate, where an output unit is a sentence/word/number depending on the chain type
 * @param {Boolean} [config.capitalizeFirst=false] - Wether to capitalize first character of words, do not provide this if chain is not based on strings parsed as characters
 * @param {Boolean} [config.cropToLength=true] - Wether to crop the output to the maximum length provided, if set to false the generator will discard output that surpases 
 *                                        the maximum length, efectively taking longer, setting it to true will crop the output creating subsections of the chains  
 *                                        which might not be desired
**/
chain.configOutput()


//returns an array of strings, representing the unique ngrams found in the provided training data
chain.getNgrams();



/**
 * Takes an optional configuration objet that alters how the generator works, if no configuration the default values on each parameter will be used, 
 * then it calls the apropiate generator function.
 * 
 * @param {Object} [config=this._outputConfig] 
 * @param {Number} [config.minLength=chain order] - minimum length of the generated data, that is, length in characters/words/digits depending on what the chain type is
 * @param {Number} [config.maxLength=chain order*2] - minimum length of the generated data, that is, length in characters/words/digits depending on what the chain type is
 * @param {Number} [config.amount=1] - Amount of output units to generate, where an output unit is a sentence/word/number depending on the chain type
 * @param {Boolean} [config.capitalizeFirst=false] - Wether to capitalize first character of words, do not provide this if chain is not based on strings parsed as characters
 * @param {Boolean} [config.cropToLength=true] - Wether to crop the output to the maximum length provided, if set to false the generator will discard output that surpases 
 *                                        the maximum length, efectively taking longer, setting it to true will crop the output creating subsections of the chains  
 *                                        which might not be desired
 * @returns {String[]}  randomly generated strings based on the corpus data the chain has trained on
 */
chain.generate()

```

##live examples
The following page uses this algorithm in order to generate some of the names
[demo page](http://www.randomfantasynames.com/)

Usage