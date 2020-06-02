import FontParser from "./Helpers/FontParser.js";

export default class PathOperations {
  constructor(glyphAssembly) {
    this.verifyGlyphAssembly(glyphAssembly);
    this.usedSVGGlyphs = [];
    this.operations = this.generateOperations(glyphAssembly);
  }

  generateOperations(glyphAssembly) {
    var operationArray = [];
    let partRecords = glyphAssembly.assembly.PartRecords;
    let initialOperation = {
      type: "Initial",
      target: glyphAssembly.svgGlyphArray[0]
    };
    this.usedSVGGlyphs.push(glyphAssembly.svgGlyphArray[0]);
    operationArray.push(initialOperation);
    for (var index = 0; index < partRecords.length; index++) {
      let operationType = this.determineOperation(index, partRecords);
      if (operationType === "Combine") {
        operationArray.push({
          type: operationType,
          target: glyphAssembly.svgGlyphArray[index + 2]
        });
        this.usedSVGGlyphs.push(glyphAssembly.svgGlyphArray[index + 2]);
      } else if (operationType === "Lone") {
        operationArray.push({
          type: operationType,
          target: glyphAssembly.svgGlyphArray[index + 1]
        });
        this.usedSVGGlyphs.push(glyphAssembly.svgGlyphArray[index + 1]);
      } else if (operationType === "PreExtend") {
        operationArray.push({
          type: "Combine",
          target: glyphAssembly.svgGlyphArray[index + 1]
        });
        this.usedSVGGlyphs.push(glyphAssembly.svgGlyphArray[index + 1]);
      }
    }
    return operationArray;
  }

  determineOperation(index, partRecords) {
    let doesPreviousExist = partRecords[index - 1] !== undefined;
    let isCurrentExtender =
      FontParser.parseValue(partRecords[index].PartFlags) === 1;
    let isBeginningExtender = !doesPreviousExist && isCurrentExtender;
    let doesNextExist = partRecords[index + 1] !== undefined;
    let doesNextNextExist = partRecords[index + 2] !== undefined;
    let isNextExtender = doesNextExist
      ? FontParser.parseValue(partRecords[index + 1].PartFlags) === 1
      : undefined;

    if (doesNextNextExist && isNextExtender) {
      return "Combine";
    } else if (!doesNextNextExist && isNextExtender) {
      return "Lone";
    } else if (isBeginningExtender) {
      return "PreExtend";
    } else {
      return "No Operation";
    }
  }

  verifyGlyphAssembly(glyphAssembly) {
    if (glyphAssembly.svgGlyphArray[0] === undefined) {
      throw new Error("Bad Glyph Assembly");
    }
  }
}
