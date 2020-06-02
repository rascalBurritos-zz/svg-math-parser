import FontParser from "../Helpers/FontParser.js";
import AttachmentMarker from "../Connectors/AttachmentMarker.js";
export default class SVGGlyph {
  constructor(unicode, fontData, mainAxis) {
    this.bbox = this.getBBox(unicode, fontData);
    this.pathString = this.getPath(unicode, fontData);

    this.rightAttachmentMarker = new AttachmentMarker(
      this.bbox[mainAxis + "2"],
      mainAxis
    );
    this.leftAttachmentMarker = new AttachmentMarker(
      this.bbox[mainAxis + "1"],
      mainAxis
    );
  }
  getBBox(unicode, fontData) {
    let unparsedBBox = fontData.glyphMetrics[unicode].bbox;
    return this.parseBBox(unparsedBBox);
  }

  parseBBox(bbox) {
    var parsedBBox = {};
    for (var entry in bbox) {
      parsedBBox[entry] = FontParser.parseValue(bbox[entry]);
    }
    return parsedBBox;
  }

  getPath(unicode, fontData) {
    return fontData.svgPaths[unicode].commands;
  }
}
