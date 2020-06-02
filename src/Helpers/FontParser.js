export default class FontParser {
  static parseValue(fontObject) {
    var parsedFontObject = parseInt(fontObject, 10);
    if (!isNaN(parsedFontObject)) {
      return parsedFontObject;
    }
    if (fontObject.Value) {
      if (fontObject.Value.value) {
        return parseInt(fontObject.Value.value, 10);
      }
    } else if (fontObject.value) {
      return parseInt(fontObject.value, 10);
    }
    console.log("FONT PARSE ERROR", fontObject);
  }
}
