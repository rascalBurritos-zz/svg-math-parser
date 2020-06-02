export default class Adjuster {
  constructor(
    unAdjustedStringPathArray,
    viewBox,
    adjustmentAmount,
    radicalOptions = undefined
  ) {
    if (radicalOptions) {
      this.string = this.generateRadicalString(
        unAdjustedStringPathArray,
        radicalOptions
      );
      this.viewBox = this.getRadicalViewBoxString(viewBox, radicalOptions);
    } else {
      this.string = this.generateString(
        unAdjustedStringPathArray,
        adjustmentAmount
      );
      this.viewBox = this.getViewBoxString(viewBox, adjustmentAmount);
    }
  }
  getRadicalViewBoxString(viewBox, radicalOptions) {
    viewBox.xTotal += radicalOptions.horizontalAdjustment;
    viewBox.yTotal += radicalOptions.verticalAdjustment;
    return (
      viewBox.xMin +
      ", " +
      viewBox.yMin +
      ", " +
      viewBox.xTotal +
      ", " +
      viewBox.yTotal
    );
  }
  generateRadicalString(unAdjustedStringPathArray, radicalOptions) {
    let adjustmentMap = {
      x: radicalOptions.horizontalAdjustment,
      y: radicalOptions.verticalAdjustment
    };
    var completePath = [];
    for (var path of unAdjustedStringPathArray) {
      if (typeof path === "string") {
        completePath.push(path);
      } else if (path.adjusted) {
        path[path.mainAxis] = path[path.mainAxis].isPositive
          ? adjustmentMap[path.mainAxis]
          : -adjustmentMap[path.mainAxis];

        var adjustedPath = path.type + " " + path.x + " " + path.y + " ";
        completePath.push(adjustedPath);
      } else {
        console.log(typeof path);
        throw new Error("Wrong Path String Type");
      }
    }
    return completePath.join("");
  }
  generateString(unAdjustedStringPathArray, adjustmentAmount) {
    var completePath = [];
    for (var path of unAdjustedStringPathArray) {
      if (typeof path === "string") {
        completePath.push(path);
      } else if (path.adjusted) {
        path[path.mainAxis] = path[path.mainAxis].isPositive
          ? adjustmentAmount
          : -adjustmentAmount;

        var adjustedPath = path.type + " " + path.x + " " + path.y + " ";
        completePath.push(adjustedPath);
      } else {
        console.log(typeof path);
        throw new Error("Wrong Path String Type");
      }
    }
    return completePath.join("");
  }
  getViewBoxString(viewBox, adjustmentAmount) {
    viewBox[viewBox.mainAxis + "Total"] +=
      adjustmentAmount * viewBox.numberOfExtensions;
    return (
      viewBox.xMin +
      ", " +
      viewBox.yMin +
      ", " +
      viewBox.xTotal +
      ", " +
      viewBox.yTotal
    );
  }
}
