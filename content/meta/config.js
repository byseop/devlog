const colors = require("../../src/styles/colors");

module.exports = {
  siteTitle: "PersonalBlog - a blog starter for GatsbyJS", // <title>
  shortSiteTitle: "PersonalBlog GatsbyJS Starter", // <title> ending for posts and pages
  siteDescription: "PersonalBlog is a GatsbyJS starter.",
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
  manifestName: "PersonalBlog - a blog starter for GatsbyJS",
  manifestShortName: "PersonalBlog", // max 12 characters
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
