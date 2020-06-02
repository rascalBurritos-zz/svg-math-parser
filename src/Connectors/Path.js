import parse from "../../library/parseSVG.js";
import CommandCollection from "../Command/CommandCollection.js";

//parse wrapper around command collection
export default class Path {
  constructor(svgGlyph) {
    this.svgGlyph = svgGlyph;
    var dirtyPath = parse(svgGlyph.pathString);
    this.leftAttachmentMarker = svgGlyph.leftAttachmentMarker;
    this.rightAttachmentMarker = svgGlyph.rightAttachmentMarker;
    this.move = this.generateMove(dirtyPath);
    this.commandCollection = this.generateCommandCollection(dirtyPath);
  }

  generateCommandCollection(dirtyPath) {
    let dirtyCommands = dirtyPath.slice(1);
    return new CommandCollection(dirtyCommands);
  }

  generateMove(dirtyPath) {
    let move = dirtyPath[0];
    move.type = "m";
    return [move];
  }
}
