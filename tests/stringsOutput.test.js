const Chain = require('../src/mchains');
const valyrianNames = require('./fixtures/valyrian');
const testSamples = require('./fixtures/stateTests');
const log = true;

describe('Output tests', function () {
    let myChain = new Chain(
        {
            order: 2
        },
        valyrianNames
    );

    let trumpChain = new Chain(
        {
            order: 2,
            type: 'word'
        },
        testSamples.second.string
    );
    
    const sampleSentences = trumpChain.generate({
        minLength: 5,
        maxLength: 13,
        amount: 1
    });


    const sampleStrings = myChain.generate({
        minLength: 3,
        maxLength: 7,
        amount: 15,
        capitalizeFirst: true,
        cropToLength: true
    });


    test('Should output words properly', () => {

        const strings = myChain.generate({
            minLength: 6,
            maxLength: 8,
            amount: 15,
            capitalizeFirst: false,
            cropToLength: false
        });
        const strings2 = myChain.generate({
            minLength: 6,
            maxLength: 9,
            amount: 25,
            capitalizeFirst: true,
            cropToLength: true
        });
        expect(strings).toBeInstanceOf(Array);
        expect(strings.length).toBe(15);
        expect(strings2.length).toBe(25);

        //first batch tests
        for(let i = 0; i<strings.length; i++){
            expect(strings[0][0]).not.toEqual(strings[0][0].toUpperCase());
            expect(strings[0].length).toBeGreaterThanOrEqual(6);
        }

        //second batch tests
        for(let i = 0; i<strings2.length; i++){
            expect(strings2[0][0]).toEqual(strings2[0][0].toUpperCase());
            expect(strings[0].length).toBeGreaterThanOrEqual(6);
            expect(strings[0].length).toBeLessThanOrEqual(9);
        }

        if(log){
            console.log(sampleStrings);
            console.log(sampleSentences);
        }

    });



});

