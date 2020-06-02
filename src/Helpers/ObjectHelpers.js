export default class ObjectHelpers {
  static areEqualShallow(a, b) {
    for (var key in a) {
      if (!(key in b) || a[key] !== b[key]) {
        return false;
      }
    }
    for (var bkey in b) {
      if (!(bkey in a) || a[bkey] !== b[bkey]) {
        return false;
      }
    }
    return true;
  }

  static deepEquals(x, y) {
    if (x === y) {
      return true;
    } else if (
      typeof x === "object" &&
      x != null &&
      (typeof y === "object" && y !== null)
    ) {
      if (Object.keys(x).length !== Object.keys(y).length) return false;

      for (var prop in x) {
        if (y.hasOwnProperty(prop)) {
          if (!ObjectHelpers.deepEquals(x[prop], y[prop])) return false;
        } else return false;
      }

      return true;
    } else return false;
  }
}
