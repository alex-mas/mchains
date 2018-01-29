const Chain = require('../src/mchains');
const testSamples = require('./tests_db/stateTests');
var nGram = require('n-gram');
const log = false;

describe('Chain states tests', function () {

    let unigramChain = new Chain(
        {
            order: 1,
            type: String,
        },
        testSamples.first.string
    );
    let bigramChain = new Chain(
        {
            order: 2,
            type: String,
        },
        testSamples.first.string
    );
    let trigramChain = new Chain(
        {
            order: 3,
            type: String,
        },
        testSamples.first.string
    );
    let fourthgramChain = new Chain(
        {
            order: 4,
            type: String,
        },
        testSamples.first.string
    );

    test('Unigrams should be generated properly', () => {
        expect(unigramChain._getChainStates().sort()).toEqual(testSamples.first.unigram.sort());
    });

    test('Bigrams should be generated properly', () => {
        expect(bigramChain._getChainStates().sort()).toEqual(testSamples.first.bigram.sort());
    });

    test('Trigrams should be generated properly',()=>{
        let trigrams = nGram(3)(testSamples.first.string).sort()
        trigrams = [... new Set(trigrams)];
        expect(trigramChain._getChainStates().sort()).toEqual(trigrams);
    });

    test('Fourthgrams should be generated properly',()=>{
        let ngrams = nGram(4)(testSamples.first.string).sort()
        ngrams = [... new Set(ngrams)];
        expect(fourthgramChain._getChainStates().sort()).toEqual(ngrams);
    });
    test('ngrams should be generated properly up to string length -1',()=>{
        let order = 5;
        while(order < testSamples.first.string.length-1){
            let ngramChain = new Chain(
                {
                    order: order,
                    type: String,
                },
                testSamples.first.string
            );
            let ngrams = nGram(order)(testSamples.first.string).sort()
            ngrams = [... new Set(ngrams)];
            expect(ngramChain._getChainStates().sort()).toEqual(ngrams);
            order++;
        }

    });
});

