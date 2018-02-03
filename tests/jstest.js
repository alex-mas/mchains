const Chain = require('../src/mchains');
const testSamples = require('./tests_db/stateTests');

let trumpChain = new Chain(
    {
        order: 2,
        type: String,
        stringType: 'word'
    },
    testSamples.second.string
);


const sampleSentences = trumpChain.generate({
    minLength: 5,
    maxLength: 10,
    amount: 12
});
console.log(sampleSentences);