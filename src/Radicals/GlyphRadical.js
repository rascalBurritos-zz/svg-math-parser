import SVGGlyph from "../GlyphAssembly/SVGGlyph.js";
import FontParser from "../Helpers/FontParser.js";
import Path from "../Connectors/Path.js";
import AttachmentMarker from "../Connectors/AttachmentMarker.js";
import Connector from "../Connectors/Connector.js";
import RelativePath from "../makeRelative/RelativePath.js";
import { StringifyCommands } from "../makeRelative/StringifyCommands.js";
// import Adjuster from "../Adjuster/Adjuster";

export default class GlyphRadical {
  constructor(unicode, fontData) {
    this.ruleThickness = FontParser.parseValue(
      fontData.MATH.MathConstants.RadicalRuleThickness
    );
    this.svgGlyph = new SVGGlyph(unicode, fontData, "x");
    let leftRadicalPath = new Path(this.svgGlyph);
    let spliceOptions = this.generateNewCommands(
      leftRadicalPath.commandCollection.commands,
      this.svgGlyph,
      fontData
    );
    leftRadicalPath.commandCollection.spliceCommands(
      spliceOptions.remove,
      spliceOptions.add
    );

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
    this.viewBox = this.generateBaseViewBox(this.svgGlyph.bbox);
    // this.adjusted = new Adjuster(this.stringArray, this.viewBox, 1000);
  }

  generateBaseViewBox(bbox) {
    let numberOfExtensions = 1;
    let mainAxis = "x";
    let xMin = bbox.x1;
    let yMin = bbox.y1;
    let yTotal = bbox.y2 - bbox.y1;
    let xTotal = bbox.x2 - bbox.x1 + 1; //+1 for rule width
    return { xMin, yMin, yTotal, xTotal, mainAxis, numberOfExtensions };
  }

  generateRulePath(radicalPath) {
    let ruleThickness = this.ruleThickness;
    let leftRadicalConnectionBBox = radicalPath.svgGlyph.bbox;
    let rightBottom = leftRadicalConnectionBBox.y2 - this.ruleThickness;
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

  generateNewCommands(commandArray, svgGlyph, fontData) {
    let ruleThickness = FontParser.parseValue(
      fontData.MATH.MathConstants.RadicalRuleThickness
    );
    let rightEdge = this.findRightEdgeCommand(commandArray, svgGlyph.bbox.x2);
    let Mbc =
      (rightEdge.End.y - rightEdge.Start.y) /
      (rightEdge.End.x - rightEdge.Start.x);
    let xb = rightEdge.End.x;
    let yb = rightEdge.End.y;
    let yr = yb - ruleThickness;
    let xr = (yr - yb) / Mbc + xb;
    let xs = xb;
    let ys = yr;
    let CR = {
      type: "L",
      x: xr,
      y: yr,
      Start: rightEdge.Start,
      End: { x: xr, y: yr }
    };
    let RS = {
      type: "L",
      x: xs,
      y: ys,
      Start: { x: xr, y: yr },
      End: { x: xs, y: ys }
    };
    let SB = {
      type: "L",
      x: xb,
      y: yb,
      Start: { x: xs, y: ys },
      End: { x: xb, y: yb }
    };
    return { remove: rightEdge, add: [CR, RS, SB] };
  }

  findRightEdgeCommand(commandArray, x2) {
    for (var command of commandArray) {
      if (command.x === x2) {
        return command;
      }
    }
    //right edge should be in command array
    throw new Error("right edge not in command array");
  }
}
