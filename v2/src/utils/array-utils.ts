if (!Array.prototype.groupBy) {
  Array.prototype.groupBy = function(key) {
    return groupBy(key, this);
  }
}

export const groupBy = (key, array) =>
  array.reduce((objectsByKeyValue, obj) => {
    const value = obj[key];
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {});
