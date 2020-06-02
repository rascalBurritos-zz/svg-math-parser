export class StringifyCommands {
  static commandArrayToString(relativePath) {
    var pathStringArray = [];
    var currentSequence = [];
    for (var command of relativePath) {
      if (!command.adjusted) {
        let commandString = StringifyCommands.commandToString(command);
        currentSequence.push(commandString);
      } else {
        let sequence = currentSequence.join("");
        pathStringArray.push(sequence);
        pathStringArray.push(command);
        currentSequence = [];
      }
    }
    let sequence = currentSequence.join("");
    pathStringArray.push(sequence);
    return pathStringArray;
  }

  static commandToString(command) {
    var options = Object.assign({}, command);
    let type = command.type.toLowerCase();
    var commandToStringMap = {
      m: lineOrMoveCommandToString,
      l: lineOrMoveCommandToString,
      c: cubicBezierCommandToString,
      a: arcCommandToString
    };
    return commandToStringMap[type](options);

    function lineOrMoveCommandToString(options) {
      let { type, x, y } = options;
      return type + " " + x + " " + y + " ";
    }

    function cubicBezierCommandToString(options) {
      let { type, x1, y1, x2, y2, x, y } = options;
      return (
        type +
        " " +
        x1 +
        " " +
        y1 +
        " " +
        x2 +
        " " +
        y2 +
        " " +
        x +
        " " +
        y +
        " "
      );
    }

    function arcCommandToString(options) {
      let {
        type,
        rx,
        ry,
        xAxisRotation,
        largeArcFlag,
        sweepFlag,
        x,
        y
      } = options;
      return (
        type +
        " " +
        rx +
        " " +
        ry +
        " " +
        xAxisRotation +
        " " +
        largeArcFlag +
        " " +
        sweepFlag +
        " " +
        x +
        " " +
        y +
        " "
      );
    }
  }
}
// static contourToPathString(commandArray, relativized) {
//   let pathStringArray = [];
//   commandArray.forEach(command => {
//     if (isLowercase(command.type)) {
//       pathStringArray.push(this.commandToString(command, false));
//     } else {
//       pathStringArray.push(this.commandToString(command, relativized));
//     }
//   });
//   return pathStringArray.join("");
// }
//   isLowercase(string) {
//   let tmp = string.slice();
//   return tmp.toLowerCase() === string;
// }
