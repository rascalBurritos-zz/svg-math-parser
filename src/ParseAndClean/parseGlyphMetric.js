export default function parseGlyphMetric(glyphMetricTable) {
  let cleanTable = {};
  for (const unicode in glyphMetricTable) {
    cleanTable[unicode] = {};
    const glyphMetric = glyphMetricTable[unicode];
    for (const entry in glyphMetric) {
      if (entry === "bbox") {
        cleanTable[unicode][entry] = {};
        for (const coord in glyphMetric[entry]) {
          cleanTable[unicode][entry][coord] = parseInt(
            glyphMetric[entry][coord],
            10
          );
        }
      } else {
        cleanTable[unicode][entry] = glyphMetric[entry];
      }
    }
  }
  return cleanTable;
}
