class Utility{
  static getTypeOf = value => Object.prototype.toString.call(value).slice(8, -1);
  static dateFromJsToMySQL(date) {
    if(Utility.getTypeOf(date) == "Date") return date.toISOString().slice(0, 19).replace('T', ' ');
    return null;
  }
}

module.exports = Utility;