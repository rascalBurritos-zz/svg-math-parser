import AsanaFontData from "../data/AsanaFontData.js";
import FontFactory from "./Font/FontFactory.js";
import SVGConstructionCollection from "./SVGConstructionCollection.js";
import fs from 'fs';

let fontData = FontFactory(AsanaFontData);
let completeConstruction = new SVGConstructionCollection(fontData);
let cleanConstruction = completeConstruction.getClean();
fontData.extendable = cleanConstruction;
let constructionString = JSON.stringify(fontData);
fs.writeFile('AsanaFontData.json',constructionString, (err)=>{
    if(err){
        console.log(err);
    }
});
// console.log(s);
