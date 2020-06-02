export default class PointCollection {
  constructor(pointArray) {
    this.pointArray = pointArray;
  }
  sortArrayOnAxis(coordinateAxis) {
    var pointArray = this.pointArray;
    var sortedPointArray = [];
    this.getArrayOnAxis(coordinateAxis, coordinateArray => {
      let sortedArray = coordinateArray.slice().sort((a, b) => a - b);
      sortedArray.forEach(ele => {
        let index = coordinateArray.indexOf(ele);
        sortedPointArray.push(pointArray[index]);
      });
    });
    return sortedPointArray;
  }

  getArrayOnAxis(coordinateAxis, callback) {
    var pointArray = this.pointArray;
    let coordinateArray = [];
    pointArray.forEach(point => {
      coordinateArray.push(point[coordinateAxis]);
    });
    callback(coordinateArray);
  }
}
