import PointCollection from "../Command/PointCollection.js";
import ObjectHelpers from "../Helpers/ObjectHelpers.js";

export default class BridgePairCollection {
  constructor(leftPath, rightPath) {
    this.attachmentPoints = this.findAttachmentPoints(leftPath, rightPath);
    let crossAxis = leftPath.rightAttachmentMarker.crossAxis;
    this.bridgePairs = this.generateBridgePairs(
      this.attachmentPoints,
      crossAxis
    );
    this.sortBridgePairs(leftPath.rightAttachmentMarker.crossAxis);
  }
  reverseBridgePairs() {
    this.bridgePairs.reverse();
  }

  sortBridgePairs(crossAxis) {
    this.bridgePairs.sort((a, b) => {
      return a.left[crossAxis] - b.left[crossAxis];
    });
  }

  getPairWithPoint(point, mode) {
    for (var pair of this.bridgePairs) {
      if (ObjectHelpers.areEqualShallow(pair[mode], point)) {
        return pair;
      }
    }
    return undefined;
  }

  removePair(pairToRemove) {
    var newBridePairs = [];
    for (var pair of this.bridgePairs) {
      if (!ObjectHelpers.deepEquals(pair, pairToRemove)) {
        newBridePairs.push(pair);
      }
    }
    this.bridgePairs = newBridePairs;
  }

  getBridgePairs() {
    return this.bridgePairs;
  }

  generateBridgePairs(attachmentPoints, crossAxis) {
    let bridgePairArray = [];
    var pointsLeft = attachmentPoints.left.sortArrayOnAxis(crossAxis);
    var pointsRight = attachmentPoints.right.sortArrayOnAxis(crossAxis);
    for (var index = 0; index < pointsLeft.length; index++) {
      bridgePairArray.push({
        left: pointsLeft[index],
        right: pointsRight[index]
      });
    }
    return bridgePairArray;
  }

  findAttachmentPoints(leftPath, rightPath) {
    let attachmentPoints = {};
    var leftPoints = this.getModeAttachmentPoints(leftPath, "right");
    var rightPoints = this.getModeAttachmentPoints(rightPath, "left");

    attachmentPoints["left"] = new PointCollection(leftPoints);
    attachmentPoints["right"] = new PointCollection(rightPoints);
    return attachmentPoints;
  }

  getModeAttachmentPoints(path, mode) {
    var pointArray = [];
    path.commandCollection.commands.forEach(command => {
      if (
        this.isLineOnAttachmentAxis(command, path[mode + "AttachmentMarker"])
      ) {
        pointArray.push(command.Start);
        pointArray.push(command.End);
      }
    });
    return pointArray;
  }

  isLineOnAttachmentAxis(command, attachmentMarker) {
    if (command.type !== "L") {
      return false;
    }

    let isStartOnAxis =
      command.Start[attachmentMarker.mainAxis] ===
      attachmentMarker.mainAxisCoordinate;
    let isEndOnAxis =
      command.End[attachmentMarker.mainAxis] ===
      attachmentMarker.mainAxisCoordinate;
    if (isStartOnAxis && isEndOnAxis) {
      return true;
    } else {
      return false;
    }
  }
}
