const colors = require("../../src/styles/colors");

module.exports = {
  siteTitle: "BYSEOP's devlog", // <title>
  shortSiteTitle: "BYSEOP's devlog", // <title> ending for posts and pages
  siteDescription: "BYSEOP's devlog",
  siteUrl: "https://byseop.netlify.com/",
  pathPrefix: "",
  siteImage: "preview.jpg",
  siteLanguage: "kr",
  // author
  authorName: "byseop",
  authorTwitterAccount: "",
  // info
  infoTitle: "byseop",
  infoTitleNote: "personal & develop blog",
  // manifest.json
  manifestName: "BYSEOP's devlog",
  manifestShortName: "BYSEOP", // max 12 characters
  manifestStartUrl: "/",
  manifestBackgroundColor: colors.background,
  manifestThemeColor: colors.background,
  manifestDisplay: "standalone",
  // contact
  contactEmail: "byseop@gmail.com",
  // social
  authorSocialLinks: [
    { name: "github", url: "https://github.com/byseop" },
    // { name: "twitter", url: "https://twitter.com/greglobinski" },
    { name: "facebook", url: "http://facebook.com/profile.php?id=100003672276708" }
  ]
};
