import FontParser from "../Helpers/FontParser.js";
import AttachmentMarker from "../Connectors/AttachmentMarker.js";
import Path from "../Connectors/Path.js";
import Connector from "../Connectors/Connector.js";
import RelativePath from "../makeRelative/RelativePath.js";
import { StringifyCommands } from "../makeRelative/StringifyCommands.js";
// import Adjuster from "../Adjuster/Adjuster.js";
import GlyphAssembly from "../GlyphAssembly/GlyphAssembly.js";
import ExtendableGlyph from "../ExtendableGlyph.js";

export default class ExtendableRadical {
  constructor(fontData) {
    this.ruleThickness = FontParser.parseValue(
      fontData.MATH.MathConstants.RadicalRuleThickness
    );
    let leftRadicalPath = this.generateLeftRadical(fontData);
    let rulePath = this.generateRulePath(leftRadicalPath);
    //combine paths
    this.path = new Connector(leftRadicalPath, rulePath);

    //make relative path
    this.relative = new RelativePath(
      this.path.commandCollection.commands,
      this.path.move
    );

    this.stringArray = StringifyCommands.commandArrayToString(
      this.relative.commandArray
    );

    this.viewBox = this.generateViewbox(
      this.path.svgGlyphArray,
      this.ruleThickness
    );

    // let adjustment = { horizontalAdjustment: 4000, verticalAdjustment: 200 };
    // let adjustedPath = new Adjuster(
    //   this.stringArray,
    //   this.baseViewBox,
    //   undefined,
    //   adjustment
    // );
  }

  generateRulePath(radicalPath) {
    let ruleThickness = this.ruleThickness;
    let leftRadicalConnectionBBox = radicalPath.svgGlyphArray.slice(-1)[0].bbox;
    let rightBottom = leftRadicalConnectionBBox.y2 - ruleThickness;
    let prePathString = `M 0 ${rightBottom} L 1 ${rightBottom}  L 1 ${rightBottom +
      ruleThickness} L 0 ${rightBottom + ruleThickness} Z`;
    let preLeftAttachment = new AttachmentMarker(0, "x");
    let psuedoSVGGlyph = {
      pathString: prePathString,
      leftAttachmentMarker: preLeftAttachment
    };
    let rulePath = new Path(psuedoSVGGlyph);
    return rulePath;
  }

  generateLeftRadical(fontData) {
    //create left radical
    let glyphSpec = { baseUnicode: "8730", mode: "vertical", fontData };
    let glyphAssembly = new GlyphAssembly(glyphSpec);
    let radicalPath = new ExtendableGlyph(glyphAssembly).extendablePath.path;
    let leftRadicalConnectionBBox = radicalPath.svgGlyphArray.slice(-1)[0].bbox;
    let radicalConnectionLine = leftRadicalConnectionBBox.x2;
    let radicalPathRightAttachment = new AttachmentMarker(
      radicalConnectionLine,
      "x"
    );
    radicalPath.rightAttachmentMarker = radicalPathRightAttachment;
    return radicalPath;
  }

  generateViewbox(svgGlyphArray, ruleThickness) {
    let radicalBottomBBox = svgGlyphArray[0].bbox;
    let radicalTopBBox = svgGlyphArray.slice(-2, -1)[0].bbox;
    let xMin = radicalBottomBBox.x1; // first svg glyph array bbox x1
    let yMin = radicalBottomBBox.y1; //"" y1
    let radicalBottomTotalWidth = radicalBottomBBox.x2 - radicalBottomBBox.x1;
    let radicalTopTotalWidth = radicalTopBBox.x2 - radicalTopBBox.x1;
    let xTotal = radicalBottomTotalWidth + radicalTopTotalWidth - ruleThickness;
    let radicalBottomTotalHeight = radicalBottomBBox.y2 - radicalBottomBBox.y1;
    let radicalTopTotalHeight = radicalTopBBox.y2 - radicalTopBBox.y1;
    let yTotal = radicalBottomTotalHeight + radicalTopTotalHeight;
    return { xMin, yMin, xTotal, yTotal };
  }
}
