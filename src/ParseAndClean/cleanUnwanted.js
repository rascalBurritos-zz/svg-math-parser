export default function cleanUnwanted(fontData) {
  let newFontData = {};
  const toExclude = ["variants"];
  for (const entry in fontData) {
    if (!toExclude.includes(entry)) {
      newFontData[entry] = fontData[entry];
    }
  }
  return newFontData;
}
