import FontParser from "../Helpers/FontParser.js";

export default function (mathConstants) {
  let newConstants = {};
  for (const constant in mathConstants) {
    newConstants[constant] = FontParser.parseValue(mathConstants[constant]);
  }
  return newConstants;
}
