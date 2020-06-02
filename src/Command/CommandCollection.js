import CommandConnect from "./CommandConnect.js";
import ObjectHelpers from "../Helpers/ObjectHelpers.js";
import _ from "lodash-es";

export default class CommandCollection {
  constructor(dirtyCommandArray) {
    let complete = this.generateCommands(dirtyCommandArray);
    this.commands = complete.commands;
    this.opposite = complete.opposite;
    // this.opposite = this.makeOppositeOrientation(this.commands);
  }
  //removed commands must be contiguous
  spliceCommands(commandsToBeRemoved, commandsToInsert) {
    //get previous command
    let dirtyCommands = _.cloneDeep(this.commands);
    let removeAmount = commandsToBeRemoved.length;
    let removeIndex = this.commands.indexOf(commandsToBeRemoved[0]);
    dirtyCommands.splice(removeIndex, removeAmount, ...commandsToInsert);
    let complete = this.generateCommands(dirtyCommands);
    this.commands = complete.commands;
    this.opposite = complete.opposite;
  }

  generateCommands(dirtyCommandArray) {
    let contourArray = this.generateContours(dirtyCommandArray);
    var oppositeContourArray = [];
    for (var index = 0; index < contourArray.length; index++) {
      contourArray[index] = CommandConnect.makeCommandsCircular(
        contourArray[index]
      );
      oppositeContourArray[index] = this.makeOppositeOrientation(
        contourArray[index]
      );
    }

    let completeOpposite = oppositeContourArray.flat();
    let completeCommands = contourArray.flat();

    return { commands: completeCommands, opposite: completeOpposite };
  }

  //contours are individual parts of a path that may have 2 pieces
  generateContours(dirtyCommandArray) {
    let contourArray = [];
    let contourCommands = [];
    for (var command of dirtyCommandArray) {
      if (command.type === "M") {
        contourArray.push(contourCommands);
        contourCommands = [];
        // contourCommands.move = command;
      } else {
        contourCommands.push(command);
      }
    }
    //weird line glitches
    contourArray.push(contourCommands);
    contourArray = contourArray.filter(commandArray => {
      return commandArray.length > 1;
    });
    return contourArray;
  }

  makeOppositeOrientation(commands) {
    let oppositeCommands = [];
    var currentCommand = _.cloneDeep(commands[0].previousCommand);
    let lastCommand = currentCommand;
    do {
      let tmp = Object.assign({}, currentCommand.End);
      currentCommand.End = currentCommand.Start;
      currentCommand.Start = tmp;
      currentCommand.x = currentCommand.End.x;
      currentCommand.y = currentCommand.End.y;

      if (currentCommand.type.toLowerCase() === "c") {
        swapControlPoints(currentCommand);
      }
      if (currentCommand.adjusted) {
        currentCommand.adjusted.isLeftToRight = !currentCommand.adjusted
          .isLeftToRight;
      }

      oppositeCommands.push(currentCommand);
      currentCommand = Object.assign({}, currentCommand.previousCommand);
    } while (!ObjectHelpers.deepEquals(currentCommand, lastCommand));
    CommandConnect.setPreviousCommand(oppositeCommands);
    CommandConnect.setNextCommand(oppositeCommands);
    return oppositeCommands;

    function swapControlPoints(command) {
      let tmpCP = { x1: command.x1, y1: command.y1 };
      command.x1 = command.x2;
      command.y1 = command.y2;
      command.x2 = tmpCP.x1;
      command.y2 = tmpCP.y1;
    }
  }
}
