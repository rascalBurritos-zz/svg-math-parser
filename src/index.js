import AsanaFontData from "../data/AsanaFontData.js";
import FontFactory from "./Font/FontFactory.js";
import SVGConstructionCollection from "./SVGConstructionCollection.js";

let fontData = FontFactory(AsanaFontData);
let s = new SVGConstructionCollection(fontData);
console.log(s);
