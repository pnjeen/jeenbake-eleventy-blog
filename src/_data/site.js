const env = process.env.ELEVENTY_ENV || "development";
console.log("🔎 ELEVENTY_ENV =", env);

const baseUrl = env === "staging" ? "/staging" : "";
console.log("🔎 baseUrl =", baseUrl);

module.exports = {
  currentYear: new Date().getFullYear(),
  blogLabel: "my notes",
  url: "https://jeenbake.com",
  baseUrl,  // this will now be assigned correctly
};
