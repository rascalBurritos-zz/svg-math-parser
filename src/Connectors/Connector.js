import BridgePairCollection from "./BridgePairCollection.js";
import ObjectHelpers from "../Helpers/ObjectHelpers.js";
import _ from "lodash-es";
import Path from "./Path.js";
import CommandCollection from "../Command/CommandCollection.js";

export default class Connector {
  constructor(leftPath, rightPath) {
    let bridgePairCollection = new BridgePairCollection(leftPath, rightPath);
    let pathArray = this.generatePathArrayFromBridgePairCollection(
      leftPath,
      rightPath,
      bridgePairCollection
    );
    this.svgGlyphArray = this.generateSVGGlyphArray(leftPath, rightPath);
    let commandArray = this.flattenPathArrayWithMove(pathArray);
    this.commandCollection = new CommandCollection(commandArray);
    this.move = this.generateMove(leftPath, this.commandCollection.commands);
    // this.leftAttachment should never be needed
    this.rightAttachmentMarker = rightPath.rightAttachmentMarker;
  }

  generateSVGGlyphArray(leftPath, rightPath) {
    let svgGlyphArray = [];
    if (leftPath instanceof Connector) {
      svgGlyphArray.push(...leftPath.svgGlyphArray);
    } else {
      svgGlyphArray.push(leftPath.svgGlyph);
    }
    svgGlyphArray.push(rightPath.svgGlyph);
    return svgGlyphArray;
  }

  generateMove(path, commandArray) {
    var move = [];
    let mainAxis = path.rightAttachmentMarker.mainAxis;
    let crossAxis = path.rightAttachmentMarker.crossAxis;
    if (path instanceof Path) {
      let pathMove = Object.assign({}, commandArray[0].Start);
      pathMove.type = "m";
      move.push(pathMove);
    }

    if (path instanceof Connector) {
      move.push(...path.futureMoveArray);
      let currentStartMove = Object.assign({}, commandArray[0].Start);
      currentStartMove.type = "m";
      move.push(currentStartMove);
    }

    this.futureMoveArray = this.generateFutureMove(path, mainAxis, crossAxis);
    return move;
  }

  generateFutureMove(path, mainAxis, crossAxis) {
    let futureMoveArray = [];
    if (path.futureMoveArray) {
      futureMoveArray.push(...path.futureMoveArray);
    }
    let bbox = this.svgGlyphArray[this.svgGlyphArray.length - 2].bbox;
    let leftPathMainAxisLength = bbox[mainAxis + "2"] - bbox[mainAxis + "1"];
    let additionalMove = { type: "m" };
    additionalMove[mainAxis] = leftPathMainAxisLength;
    additionalMove[crossAxis] = 0;
    futureMoveArray.push(additionalMove);
    let adjustmentMove = {
      type: "m",
      mainAxis,
      adjusted: true
    };
    adjustmentMove[crossAxis] = 0;
    adjustmentMove[mainAxis] = { isPositive: true };
    futureMoveArray.push(adjustmentMove);
    return futureMoveArray;
  }

  flattenPathArrayWithMove(pathArray) {
    var commandArray = [];
    commandArray.push(pathArray[0]);
    var currentMove = pathArray[0][0].Start;
    currentMove.type = "M";
    for (var index = 1; index < pathArray.length; index++) {
      commandArray.push(currentMove);
      commandArray.push(pathArray[index]);
      currentMove = pathArray[index][0].Start;
      currentMove.type = "M";
    }
    return commandArray.flat();
  }

  generatePathArrayFromBridgePairCollection(
    leftPath,
    rightPath,
    bridgePairCollection
  ) {
    var pathArray = [],
      remainingBridgePairCollection = _.cloneDeep(bridgePairCollection);
    while (remainingBridgePairCollection.getBridgePairs().length > 0) {
      let bridge = {
        pair: remainingBridgePairCollection.getBridgePairs()[0],
        leftPath,
        rightPath,
        remainingBridgePairCollection,
        bridgePairCollection
      };
      let currentPath = this.generatePathFromBridge(bridge, "left");
      remainingBridgePairCollection.reverseBridgePairs();
      pathArray.push(currentPath);
    }
    return pathArray;
  }

  generatePathFromBridge(bridge, startMode) {
    var path = [],
      notReturnedToOrigin = true;

    var origin = bridge.pair;
    var startPoint = Object.assign({}, origin[startMode]);
    var mode = startMode;

    while (notReturnedToOrigin) {
      let localAttachmentPoints = this.generateLocalAttachmentPoints(
        bridge.bridgePairCollection.bridgePairs,
        mode
      );

      let startCommand = this.getCommandFromStartPoint(
        bridge[mode + "Path"],
        startPoint,
        localAttachmentPoints
      );

      let { currentPath, endPoint } = this.getPathUntilAttachmentPoint(
        startCommand,
        localAttachmentPoints
      );

      path.push(...currentPath);

      let currentPair = bridge.remainingBridgePairCollection.getPairWithPoint(
        endPoint,
        mode
      );

      let mark = bridge.leftPath.rightAttachmentMarker;
      let extension = this.generateExtension(
        mark.mainAxis,
        mark.crossAxis,
        mode,
        currentPair[getOppositeMode(mode)]
      );

      path.push(extension);

      notReturnedToOrigin = !ObjectHelpers.deepEquals(origin, currentPair);
      mode = getOppositeMode(mode);
      startPoint = Object.assign({}, currentPair[mode]);
      bridge.remainingBridgePairCollection.removePair(currentPair);
    }

    return path;

    function getOppositeMode(mode) {
      var modeMap = {
        left: "right",
        right: "left"
      };
      return modeMap[mode];
    }
  }

  generateExtension(mainAxis, crossAxis, mode, pointToTravel) {
    // let extension = { type: "l" };
    let isLeftToRight = mode === "left";
    let adjusted = { isLeftToRight, mainAxis, crossAxis };
    // extension[mainAxis] = isLeftToRight ? "+adjust" : "-adjust";
    // extension[crossAxis] = 0;
    let extension = {
      type: "L",
      x: pointToTravel.x,
      y: pointToTravel.y,
      adjusted: adjusted
    };
    return extension;
  }

  generateLocalAttachmentPoints(bridgePairArray, mode) {
    let localAttachmentPoints = [];
    for (var bridgePair of bridgePairArray) {
      localAttachmentPoints.push(bridgePair[mode]);
    }
    return localAttachmentPoints;
  }

  getCommandFromStartPoint(path, startPoint, localAttachmentPoints) {
    let initialCommand = findCommandFromStartPointNoOrientation(
      path.commandCollection.commands,
      startPoint
    );
    var endPoint = initialCommand.End;

    var isWrongOrientation = localAttachmentPoints.some(point => {
      return endPoint.x === point.x && endPoint.y === point.y;
    });
    if (isWrongOrientation) {
      let x = findCommandFromStartPointNoOrientation(
        path.commandCollection.opposite,
        startPoint
      );
      return x;
    } else {
      return initialCommand;
    }
    function findCommandFromStartPointNoOrientation(commandArray, startPoint) {
      for (var command of commandArray) {
        if (ObjectHelpers.areEqualShallow(command.Start, startPoint)) {
          return command;
        }
      }
    }
  }

  getPathUntilAttachmentPoint(command, localAttachmentPoints) {
    let commandArray = [];
    var currentCommand = command;
    var reachedEndpoint = false;
    var endPoint;

    while (!reachedEndpoint) {
      commandArray.push(currentCommand);
      endPoint = currentCommand.End;
      reachedEndpoint = isEndpointReached(endPoint);
      currentCommand = currentCommand.nextCommand;
    }
    return { currentPath: commandArray, endPoint };

    function isEndpointReached(endPoint) {
      return localAttachmentPoints.some(point => {
        return ObjectHelpers.areEqualShallow(endPoint, point);
      });
    }
  }
}
