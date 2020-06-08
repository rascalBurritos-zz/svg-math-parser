import AsanaFontData from "../data/AsanaFontData.js";
import FontFactory from "./Font/FontFactory.js";
import SVGConstructionCollection from "./SVGConstructionCollection.js";
import parseGlyphMetric from "./ParseAndClean/parseGlyphMetric.js";
import parseMathConstants from "./ParseAndClean/parseMathConstants.js";
import cleanUnwanted from "./ParseAndClean/cleanUnwanted.js";
import fs from "fs";

let fontData = FontFactory(AsanaFontData);
let completeConstruction = new SVGConstructionCollection(fontData);
let cleanConstruction = completeConstruction.getClean();
fontData.extendable = cleanConstruction;
fontData.glyphMetrics = parseGlyphMetric(fontData.glyphMetrics);
fontData.MATH.MathConstants = parseMathConstants(fontData.MATH.MathConstants);
fontData = cleanUnwanted(fontData);
let constructionString = JSON.stringify(fontData);
fs.writeFile("AsanaFontData.json", constructionString, (err) => {
  if (err) {
    console.log(err);
  }
});
// console.log(s);
