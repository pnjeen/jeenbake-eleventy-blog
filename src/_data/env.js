module.exports = function() {
  return process.env.ELEVENTY_ENV || "development";
};