const City = require('./City');
const {findCityByCoordinates, checkNormalRange} = require('./Check');

const minCoordinate = 0;
const maxCoordinate = 9;
const matrixDimension = 10;


class Map {
    constructor() {
        this.cities = [];
        this.countries = [];
        this.neighbours = {};
        this.result = {};
        this.grid = this.makeGrid()
    }

    makeGrid () {
        const grid = new Array(matrixDimension);
        for (let i = 0; i < matrixDimension; i++) {
            grid[i] = new Array(matrixDimension);
        }
        return grid;
    }


    init () {
        this.addNeighbours();
        this.setInitialBalances();
    }

    addNeighbours () {
        this.cities.map(city => {
            const {x, y} = city;
            if( checkNormalRange(x, y) ) {
                city.addNeighbour(findCityByCoordinates(this.cities, x-1, y));
            }
            if( checkNormalRange(x, y) ) {
                city.addNeighbour(findCityByCoordinates(this.cities, x+1, y));
            }
            if( checkNormalRange(x, y) ) {
                city.addNeighbour(findCityByCoordinates(this.cities, x, y+1));
            }
            if( checkNormalRange(x, y) ) {
                city.addNeighbour(findCityByCoordinates(this.cities, x, y-1));
            }
        })
    }


    setInitialBalances () {
        this.cities.map(city => city.setBalances(this.countries));
    }

    isExchangeDay ( day ) {
        this.countries.map(country => {
            if (country.exchangeDay < 0)
                country.exchangeDay = day;
        });
        return ( this.cities.reduce((acc, city) => {
            if( !city.isReady(this.countries) ) {
                city.country.exchangeDay = -1;
                return false;
            } else {
                return acc;
            }
        }, true));
    }

    diffusion () {
        if ( this.countries.length === 1 ) {
            return {
                [this.countries[0].name]: 0
            }
        }
        this.init();
        let day = 0;
        do {
            this.cities.map(city => city.countOutcome());
            this.transactions();
            this.cities.map(city => {
                city.addMoneyToCurrent();
                city.flushMoney();
            });
            day++;
        } while(!this.isExchangeDay(day));
        return this.getDiffusionResult()
    }

    addCountry ( country ) {
        const countryId = this.countries.length + 1;
        this.countries.push(country);
        for ( let y=country.yl; y <= country.yh; y++ ) {
            for ( let x=country.xl; x <= country.xh; x++ ) {
                const newCity = new City( x, y );
                newCity.country = country;
                this.cities.push(newCity);
                this.grid[x][y]=countryId;
            }
        }
    }

    transactions() {
        this.cities.map(city => {
            city.neighbours.map(neighbour => {
                    this.countries.map(country => {
                            city.receiveMoney(country.name, neighbour.pay(country.name));
                        }
                    )
            })
        });
    }

    getDiffusionResult() {
        return this.countries.reduce((acc, country) => Object.assign(acc, {[country.name]: country.exchangeDay}), {});
    }
}

module.exports = Map;