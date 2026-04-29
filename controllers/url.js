const { nanoid } = require("nanoid");
const URL = require("../models/url");

// const validUrl = require('valid-url');
async function handleGenerateNewShortURL(req, res) {
  const body = req.body;
  if (!body.url) return res.status(400).json({ error: "url is required" });

  const shortID = nanoid(8);
  await URL.create({
    shortId: shortID,
    redirectURL: body.url,
    visitHistory: [],
    createdBy: req.user._id,
  });

  return res.render("home", {
    id: shortID,
  });
}
async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;

  const entry = await URL.findOne({ shortId });

  return res.json({
    totalClicks: entry.visitHistory.length,
    analytics: entry.visitHistory,
  });
}

//updated

async function handleRedirect(req, res) {
  const shortId = req.params.shortId;

  const entry = await URL.findOne({ shortId });

  if (!entry) {
    return res.status(404).send("URL not found");
  }

  entry.visitHistory.push({ timestamp: Date.now() });
  await entry.save();

  res.redirect(entry.redirectURL);
}

module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics,
  handleRedirect,
};
