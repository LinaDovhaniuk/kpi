const fs = require('fs');
const Country = require('./Country');
const City = require('./City');
const Map = require('./Map');

const minCoordinate = 0;
const maxCoordinate = 9;

function compareInputToString ( input, string ) {
    return Buffer.compare(input, Buffer.from(string)) === 0;
}

function getCountryParams ( stream ) {
    const params = [];
    while ( null !== (input = stream.read(1)) ) {
        if ( compareInputToString(input, ' ') ) {
            continue;
        }
        if (compareInputToString(input, '\r')) {
            continue;
        }
        if (compareInputToString(input, '\n')) {
            break;
        }
        if( Number.isInteger( +input) ) {
            params.push( +input );
        }
    }
    return params;
}

function getCountryName ( stream ) {
    let name = '';
    while ( null !== (input = stream.read(1)) ) {
        if (compareInputToString(input, '\r'))
            continue;
        if (compareInputToString(input, '\n'))
            continue;
        if (compareInputToString(input, ' '))
            break;
        name = name.concat(input.toString());
    }
    return name;
}

function isInTheNormalRange ( coordinate ) {
    return coordinate >= minCoordinate && coordinate <= maxCoordinate;
}

function areParamsValid ( params ) {
    if (!(Array.isArray(params) && params.length === 4)) {
        return false;
    }
    if (!params.reduce((acc, param) => acc && isInTheNormalRange(param), true)) {
        return false;
    }
    if (!(params[0] <= params[2])) {
        return false;
    }
    if (!(params[1] <= params[3])) {
        return false;
    }
    return true;
}

function processSingleCase( stream, countriesNumber ) {
    const map = new Map();
    if( countriesNumber === 0 ) {
        return {};
    }
    for( let i=0; i<countriesNumber; i++ ) {
        const name = getCountryName(stream);
        const params = getCountryParams(stream);
        if( !areParamsValid(params) ) {
            return new Error(`Wrong params for ${ name }: ${ params }`);
        }
        map.addCountry(
            new Country(name,
            new City (params[0], params[1]),
            new City (params[2], params[3]))
        );
    }
    return map.diffusion();
}

function processStream ( stream ) {
    return new Promise(resolve => {
        const results = [];
        stream.on('readable', () => {
            let input;
            while ( null !== (input = stream.read(1)) ) {
                let res = processSingleCase( stream, Number(input) );
                if ( !(Object.keys(res).length === 0 && res.constructor === Object) ) {
                    results.push(res);
                }
                else break;
            }
            resolve(results)
        })
    })
}

async function getOutput () {
    const readStream = fs.createReadStream('./data/dataset1');
    return await processStream(readStream);
}

module.exports = getOutput;