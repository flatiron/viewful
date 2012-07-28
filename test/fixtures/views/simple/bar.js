module.exports = function (options, callback) {
  var $ = this.$;
  $('h1').html('hello');
  return $.html();
}