import PathOperations from "./PathOperations.js";
import ExtendablePath from "./Connectors/ExtendablePath.js";
import RelativePath from "./makeRelative/RelativePath.js";
import { StringifyCommands } from "./makeRelative/StringifyCommands.js";
// import Adjuster from "./Adjuster/Adjuster.js";

export default class ExtendableGlyph {
  constructor(glyphAssembly) {
    //getBaseViewBox()//returns [0,0,baseX,baseY]
    let pathOperations = new PathOperations(glyphAssembly);
    this.viewBox = this.getBaseViewBox(pathOperations.usedSVGGlyphs);
    this.extendablePath = new ExtendablePath(pathOperations);
    let relativePath = new RelativePath(
      this.extendablePath.path.commandCollection.commands,
      this.extendablePath.path.move
    );
    this.stringArray = StringifyCommands.commandArrayToString(
      relativePath.commandArray
    );
    // this.completePath = new Adjuster(this.stringArray, this.viewBox, 2000);
  }

  getBaseViewBox(svgGlyphArray) {
    let mainAxis = svgGlyphArray[0].rightAttachmentMarker.mainAxis;
    let crossAxis = svgGlyphArray[0].rightAttachmentMarker.crossAxis;

    let viewBox = {};
    viewBox.numberOfExtensions = svgGlyphArray.length - 1;
    viewBox.mainAxis = mainAxis;
    viewBox[mainAxis + "Min"] = this.getMainAxisMin(svgGlyphArray, mainAxis);
    viewBox[crossAxis + "Min"] = this.getCrossAxisMin(svgGlyphArray, crossAxis);
    viewBox[mainAxis + "Total"] = this.getMainAxisTotal(
      svgGlyphArray,
      mainAxis
    );
    viewBox[crossAxis + "Total"] = this.getCrossAxisTotal(
      svgGlyphArray,
      crossAxis,
      viewBox[crossAxis + "Min"]
    );
    return viewBox;
  }

  getMainAxisMin(svgGlyphArray, mainAxis) {
    return svgGlyphArray[0].bbox[mainAxis + "1"];
  }
  getMainAxisTotal(svgGlyphArray, mainAxis) {
    var sum = svgGlyphArray.reduce((acc, svgGlyph) => {
      let start = svgGlyph.bbox[mainAxis + "1"];
      let end = svgGlyph.bbox[mainAxis + "2"];
      let length = end - start;
      return acc + length;
    }, 0);
    return sum;
  }
  getCrossAxisTotal(svgGlyphArray, crossAxis, crossAxisMin) {
    var crossAxisMaxArray = [];
    for (var svgGlyph of svgGlyphArray) {
      crossAxisMaxArray.push(svgGlyph.bbox[crossAxis + "2"]);
    }
    let crossAxisMax = Math.max(...crossAxisMaxArray);
    return crossAxisMax - crossAxisMin;
  }

  getCrossAxisMin(svgGlyphArray, crossAxis) {
    var crossAxisMinArray = [];
    for (var svgGlyph of svgGlyphArray) {
      crossAxisMinArray.push(svgGlyph.bbox[crossAxis + "1"]);
    }
    return Math.min(...crossAxisMinArray);
  }
}
