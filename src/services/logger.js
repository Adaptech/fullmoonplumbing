export default class Logger {
  static error() {
    var isoDate = new Date().toISOString();
    console.log.apply(console, [isoDate, 'ERROR'].concat(Array.prototype.splice.call(arguments, 0)));
  }
  static info() {
    var isoDate = new Date().toISOString();
    console.log.apply(console, [isoDate, 'INFO'].concat(Array.prototype.splice.call(arguments, 0)));
  }
  static debug() {
    var isoDate = new Date().toISOString();
    console.log.apply(console, [isoDate, 'DEBUG'].concat(Array.prototype.splice.call(arguments, 0)));
  }
  static access() {
    var isoDate = new Date().toISOString();
    console.log.apply(console, [isoDate, 'ACCESS'].concat(Array.prototype.splice.call(arguments, 0)));
  }
}
