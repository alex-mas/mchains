mchains.js
==========================


# install 
```
npm i mchains --save
```

# usage

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

# documentation

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


new Chain(
    //first argument: optional configuration object
    {
    order: // defaults to 2
    type: //defaults to String constructor, right now its the only type supported
    stringType: //defaults to 'character', valid values are: 'character' and 'word'
    }, 
    //second argument: optional training data
    training //defaults to undefined, can be a string, an array or an object
);


//methods
let chain = new Chain();


// takes a string, an array of strings or an object who's keys are strings
//recursively iterates the provided training data looking for strings
chain.train(training) 
//Valid training data looks like:

//option 1:
const training = ' just a simple string';

//option 2:
const training = ['first string', 'second string', ['string inside an array', 'etc...']];

//option 3: 
const training = {
    firstSampleData: ['first string', 'second string', ['string inside an array', 'etc...']],
    secondSampleData: {
        whateverKey: ['first string', 'second string', ['string inside an array', 'etc...']],
        anotherKey: 'just a simple string'
    },
    thirdSampleData: 'just a simple string'
}




//looks for the provided string in the states internal object and returns a boolean
chain.doesStateExist(state)



//takes a configuration object to setup how do you want the output to be
chain.configOutput(
    {
        minLength: //defaults to chain order
        maxLength: //defaults to chain order*2
        amount: //defaults to 1
        capitalizeFirst: //defaults to false
        cropToLength: //defaults to false
    }
)


//returns an array of strings, representing the unique ngrams found in the provided training data
chain.getNgrams();


//returns an array of strings generate randomly from the internal states of the chain
chain.generate(
    //optional configuration object
    {
        minLength: //defaults to chain order
        maxLength: //defaults to chain order*2
        amount: //defaults to 1
        capitalizeFirst: //defaults to false
        cropToLength: //defaults to false
    }
)

```

## live examples
The following page uses this algorithm in order to generate some of the names
[demo page](http://www.randomfantasynames.com/)

Usage