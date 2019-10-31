const initialAmount = 1000000;
const share = 1/1000;
const {findCityByCoordinates} = require('./Check');

class City {
    constructor ( x, y ) {
        this.x = x;
        this.y = y;
        this.currentBalance = {};
        this.inBalance = {};
        this.outBalance = {};
        this.neighbours = [];
    }

    receiveMoney ( countryName, amount ) {
        this.inBalance[ countryName ] += amount;
    }

    addMoneyToCurrent () {
        Object.keys( this.inBalance ).map(key => {
            this.currentBalance[ key ]+= this.inBalance[ key ];
        }
        )}

    flushMoney () {
        Object.keys( this.inBalance ).map(key => {
                this.inBalance[ key ] = 0;
        })
    }

    setBalances ( countries ) {
        countries.map( ({ name }) => {
            if (this.country.name === name) {
                this.currentBalance[ name ] = initialAmount;
            }
            else {
                this.currentBalance[ name ] = 0;
            }
            this.inBalance[ name ] = 0;
            this.outBalance[ name ] = 0;
        })
    }

    countOutcome () {
        Object.keys( this.currentBalance ).map(key => {
                this.outBalance[ key ] = Number.parseInt(this.currentBalance[ key ]*share);
            })
    }

    pay ( countryName ) {
        this.currentBalance[ countryName ] -= this.outBalance[ countryName ];
        return this.outBalance[countryName];
    }

    checkNeighboursExist(city) {
        return city.neighbours.length === 0;
    }


    addNeighbour ( city ) {

        if (typeof(city) !== 'undefined') {
            if (city.x !== 0){
                if(!(findCityByCoordinates(this.neighbours, city.x, city.y - 1) && this.checkNeighboursExist(findCityByCoordinates(this.neighbours, city.x, city.y - 1)))){
                    this.neighbours.push(city);
                }
            }

            if (city.y !== 9){
                if(!(findCityByCoordinates(this.neighbours, city.x, city.y + 1) && this.checkNeighboursExist(findCityByCoordinates(this.neighbours, city.x, city.y + 1)))){
                    this.neighbours.push(city);
                }
            }

            if (city.x !== 0){
                if(!(findCityByCoordinates(this.neighbours, city.x - 1, city.y) && this.checkNeighboursExist(findCityByCoordinates(this.neighbours, city.x - 1, city.y)))){
                    this.neighbours.push(city);
                }
            }

            if (city.y !== 9){
                if(!(findCityByCoordinates(this.neighbours, city.x + 1, city.y) && this.checkNeighboursExist(findCityByCoordinates(this.neighbours,city.x + 1, city.y)))){
                    this.neighbours.push(city);
                }
            }
        }
        else console.log('Ooops, no neighbours');


        //
        // if ( city !== undefined ) {
        //     if( findCityByCoordinates( this.neighbours, city.x, city.y ) === undefined ) {
        //         this.neighbours.push(city);
        //     }
        // }
    }

    isReady ( countries ) {
        return countries.reduce( (acc, { name }) => acc && (this.currentBalance[ name ] !== 0), true)
    }

}


module.exports = City;