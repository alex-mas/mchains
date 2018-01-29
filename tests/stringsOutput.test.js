const Chain = require('../src/mchains');
const valyrianNames = require('./tests_db/valyrian');

const log = false;

describe('Output tests', function () {
    let myChain = new Chain(
        {
            order: 2,
            type: String,
        },
        valyrianNames
    );

    test('Should output words properly', () => {

        const strings = myChain.generate({
            minLength: 6,
            maxLength: 8,
            amount: 15,
            capitalizeFirst: true,
            cropToLength: false
        });
        expect(strings).toBeInstanceOf(Array);
        expect(strings.length).toBe(15);
        if(log){
            console.log(strings);
        }

    });



});

