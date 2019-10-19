const City = require('./City');
const minCoordinate = 0;
const maxCoordinate = 9;


class Map {
    constructor() {
        this.cities = [];
        this.countries = [];
        this.neighbours = {};
        this.result = {};
        this.grid = this.makeGrid()
    }

    makeGrid () {
        const grid = new Array(10);
        for (let i = 0; i < grid.length; i++) {
            grid[i] = new Array(10);
        }
        return grid;
    }

    init () {
        this.addNeighbours();
        this.setInitialBalances();
    }

    findCityByCoordinates ( cities, x, y ) {
        return cities.find(({ x: toFindX, y: toFindY }) => toFindX === x && toFindY === y );
    }

    addNeighbours () {
        this.cities.map(city => {
            const {x, y} = city;
            if( this.checkNormalRange(x, y) ) {
                city.addNeighbour(this.findCityByCoordinates(this.cities, x-1, y));
            }
            if( this.checkNormalRange(x, y) ) {
                city.addNeighbour(this.findCityByCoordinates(this.cities, x+1, y));
            }
            if( this.checkNormalRange(x, y) ) {
                city.addNeighbour(this.findCityByCoordinates(this.cities, x, y+1));
            }
            if( this.checkNormalRange(x, y) ) {
                city.addNeighbour(this.findCityByCoordinates(this.cities, x, y-1));
            }
        })
    }

    isInTheNormalRange ( coordinate ) {
        return coordinate >= minCoordinate && coordinate <= maxCoordinate;
    }

    checkNormalRange( x, y ) {
        return this.isInTheNormalRange(x) && this.isInTheNormalRange(y);
    }

    setInitialBalances () {
        this.cities.map(city => city.setBalances(this.countries));
    }

    transaction ( from, to, countryName ) {
        to.receiveMoney( countryName, from.pay(countryName) )
    }

    isExchangeDay ( day ) {
        this.countries.map(country => {
            if (country.exchangeDay < 0)
                country.exchangeDay = day;
        });
        return ( this.cities.reduce((acc, city) => {
            if( !city.isReady(this.countries) ) {
                city.country.exchangeDay = -1;
                return acc && false;
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
        } while(!this.isExchangeDay(day))
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