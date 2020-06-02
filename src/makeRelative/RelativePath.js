import ObjectHelpers from "../Helpers/ObjectHelpers.js";

export default class RelativePath {
  constructor(commandArray, moveArray) {
    this.commandArray = this.generate(commandArray, moveArray);
  }
  generate(commandArray, moveArray) {
    var relativeCommandArray = [],
      relativeCommand;
    relativeCommandArray.push(...moveArray);
    for (var [index, command] of commandArray.entries()) {
      if (movedPath(index, commandArray)) {
        let move = this.generateMoveForHole(
          command.Start,
          commandArray[index - 1].End,
          moveArray
        );
        relativeCommandArray.push(move);
      }
      if (command.adjusted) {
        relativeCommand = this.generateAdjusted(command);
      } else {
        relativeCommand = this.generateRelativeDraw(command);
      }
      relativeCommandArray.push(relativeCommand);
    }
    return relativeCommandArray;

    function movedPath(index, commandArray) {
      if (index < 1) {
        return false;
      }
      let previousEnd = commandArray[index - 1].End;
      let currentStart = commandArray[index].Start;
      if (!ObjectHelpers.areEqualShallow(previousEnd, currentStart)) {
        return true;
      }
      return false;
    }
  }

  generateAdjusted(command) {
    var relativeCommand = { type: "l" };
    var isPositive = command.adjusted.isLeftToRight;
    let mainAxis = command.adjusted.mainAxis;
    let crossAxis = command.adjusted.crossAxis;
    relativeCommand[crossAxis] =
      command.End[crossAxis] - command.Start[crossAxis];
    relativeCommand[mainAxis] = { isPositive };
    relativeCommand.mainAxis = mainAxis;
    relativeCommand.adjusted = true;
    return relativeCommand;
  }

  generateRelativeDraw(command) {
    var relativeCommand = Object.assign({}, command);
    relativeCommand.type = command.type.toLowerCase();
    this.makeEndpointsRelative(relativeCommand);
    if (command.type === "C") {
      this.makeControlPointsRelative(relativeCommand);
    }
    return relativeCommand;
  }

  generateMoveForHole(holeStartPoint, previousEnd, moveArray) {
    let additionalMove = moveArray[0];
    let x = holeStartPoint.x - previousEnd.x + additionalMove.x;
    let y = holeStartPoint.y - previousEnd.y + additionalMove.y;
    let holeMove = { type: "M", x, y };
    return holeMove;
  }

  makeControlPointsRelative(command) {
    let start = command.Start;
    command.x1 = command.x1 - start.x;
    command.y1 = command.y1 - start.y;
    command.x2 = command.x2 - start.x;
    command.y2 = command.y2 - start.y;
  }

  makeEndpointsRelative(command) {
    let start = command.Start;
    let end = command.End;
    command.x = end.x - start.x;
    command.y = end.y - start.y;
  }
}
