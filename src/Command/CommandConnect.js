import ObjectHelpers from "../Helpers/ObjectHelpers.js";

export default class CommandConnect {
  static makeCommandsCircular(commands) {
    CommandConnect.setEndPoints(commands);
    CommandConnect.setStartPoints(commands);
    // console.log(commands)
    if (CommandConnect.commandsRedudant(commands)) {
      commands = CommandConnect.cleanCommands(commands);
    }
    CommandConnect.setNextCommand(commands);
    CommandConnect.setPreviousCommand(commands);
    return commands;
  }

  static cleanCommands(commandArray) {
    commandArray = commandArray.filter(command => {
      return !ObjectHelpers.areEqualShallow(command.Start, command.End);
    });
    return commandArray;
  }

  static commandsRedudant(commandArray) {
    for (var command of commandArray) {
      if (ObjectHelpers.areEqualShallow(command.Start, command.End)) {
        return true;
      }
    }
    return false;
  }

  static setNextCommand(commandArray) {
    CommandConnect.circularForEach(
      commandArray,
      (currentCommand, p, nextCommand) => {
        currentCommand.nextCommand = nextCommand;
      }
    );
  }

  static setPreviousCommand(commandArray) {
    CommandConnect.circularForEach(
      commandArray,
      (currentCommand, previousCommand) => {
        currentCommand.previousCommand = previousCommand;
      }
    );
  }

  static circularForEach(array, callback) {
    callback(array[0], array[array.length - 1], array[1], 0, array);
    for (var index = 1; index < array.length - 1; index++) {
      callback(array[index], array[index - 1], array[index + 1], index, array);
    }
    callback(
      array[array.length - 1],
      array[array.length - 2],
      array[0],
      array.length - 1,
      array
    );
  }

  static setEndPoints(commandArray) {
    commandArray.forEach(ele => {
      ele.End = { x: ele.x, y: ele.y };
    });
  }

  static setStartPoints(commandArray) {
    CommandConnect.circularForEach(commandArray, (curr, prev) => {
      curr.Start = { x: prev.x, y: prev.y };
    });
  }
}
