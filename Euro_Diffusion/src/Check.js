const minCoordinate = 0;
const maxCoordinate = 9;

function isInTheNormalRange ( coordinate ) {
    return coordinate >= minCoordinate && coordinate <= maxCoordinate;
}

function checkNormalRange( x, y ) {
    return isInTheNormalRange(x) && isInTheNormalRange(y);
}

function findCityByCoordinates ( cities, x, y ) {
    return cities.find(({ x: toFindX, y: toFindY }) => toFindX === x && toFindY === y );
}

module.exports = {isInTheNormalRange, checkNormalRange, findCityByCoordinates};