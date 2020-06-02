export default class AttachmentMarker {
  constructor(mainAxisCoordinate, mainAxis) {
    this.mainAxisCoordinate = mainAxisCoordinate;
    this.mainAxis = mainAxis;
    this.crossAxis = this.getCrossAxis(this.mainAxis);
  }

  getCrossAxis(axis) {
    let axisMap = {
      x: "y",
      y: "x"
    };
    return axisMap[axis];
  }
}
