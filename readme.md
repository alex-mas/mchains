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


#### train()
Takes data to train from it generating new states for the chain.

Valid data:
- A string
- An array of strings
- An object with string values in its properties

Examples:
```javascript

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


```

#### doesStateExist(String)
returns true if the string matches one of the chain states, false otherwise

#### configOutput(config)
Takes a configuration object to configure the output of the generate method

Configuration object properties:
- minLength            -> defaults to chain order
- maxLength            -> defaults to chain's order * 2
- amount               -> defaults to 1
- capitalizeFirst      -> defaults to false
- cropToLength         -> defaults to false

#### getNgrams()
returns an array of strings, representing the unique ngrams found in the provided training data



#### generate(config)
returns an array of strings generated randomly from the internal states of the chain
- The config param matches the structure of the parameter of configOutput method



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
