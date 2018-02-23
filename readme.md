mchains.js
===
Simple string markov chains

# install 
```
npm i mchains --save
```


# usage
### supports UMD
Right now only string chains are supported



```javascript 

/*IMPORTING THE SCRIPT*/


//common.js
const Chain = require('mchains');

//Import globally
<script src="node_modules/mchains/mchains.js"></script>
//NOTE: If you imported it via html script tag you must access it via window.mchains as follows:
const Chain = window.mchains



//chain with configuration and training data
let chain = new Chain({
            order: 2,
            type: 'character',
        }, 'this is a string, you can insert an array with strings too');

let untrainedChain =  new Chain();

untrainedChain.train(['first string', 'second string' ...yourData]);

let arrayOfStrings = chain.generate();// possible output ['stri', 'you ', 'inse']

```


# documentation

Markov chains are discrete sequences of states, commonly used in generation of strings, numbers and other data.


### constructor

```javascript

new Chain(parameters);

```
Parameters:
- Configuration object(optional)
- Training data(optional)

#### Configuration object(optional):

##### order: 
Defines how many items are grouped together to form a state, in the case of strings that is either words or characters
If you want to use this for word generation a lower order will produce more random-like patterns than higher order values


##### type:
Determines how the strings are parsed and generated:
- "character" will make the strings be parsed as sequences of characters
- "word" will make the strings be parsed as sequences of words (strings delimited by " ", "\n" and "\r" )


#### Training data: 
Optional training data for the chain to process, more information about training data below.


### methods
```javascript



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

### Properties
Note: public properties that are ment to be readonly, they are initialized with the cosntructor:

#### Chain.order
returns the order of the chain, that is, how many items are grouped together to form each state
```javascript
let chain = new Chain();
chain.order 
```

#### Chain.type
returns the method used to parse strings, if Chain.type is not String this property will not be used by the algorithm
```javascript
let chain = new Chain();
chain.type 
```


## live examples
The following page uses this algorithm in order to generate some of the names
[demo page](http://www.randomfantasynames.com/)
