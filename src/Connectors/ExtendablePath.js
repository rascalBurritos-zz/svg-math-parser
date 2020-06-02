import Path from "./Path.js";

import Connector from "./Connector.js";

export default class ExtendablePath {
  constructor(pathOperations) {
    this.path = this.generateCompletePath(pathOperations);
  }

  generateCompletePath(pathOperations) {
    let operationMap = {
      Initial: this.intializePath,
      Combine: this.combinePaths,
      Lone: this.combinePaths
    };
    var completePath;

    for (var operation of pathOperations.operations) {
      completePath = operationMap[operation.type](
        operation.target,
        completePath
      );
    }
    return completePath;
  }

  combinePaths(svgGlyph, completePath) {
    let additionalPath = new Path(svgGlyph);
    return new Connector(completePath, additionalPath);
  }

  intializePath(svgGlyph) {
    return new Path(svgGlyph);
  }
}
