const { nanoid } = require("nanoid");
const URL = require("../models/url");

// const validUrl = require('valid-url');
async function handleGenerateNewShortURL(req, res) {
  const body = req.body;
  if (!body.url) return res.status(400).json({ error: "url is required" });

  try {
    const shortID = nanoid(8);
    await URL.create({
      shortId: shortID,
      redirectURL: body.url,
      visitHistory: [],
      createdBy: req.user._id,
    });

    const allurls = await URL.find({ createdBy: req.user._id });
    return res.render("home", {
      id: shortID,
      urls: allurls,
    });
  } catch (error) {
    console.error("URL Creation Error:", error);
    return res.status(500).render("home", {
      error: "Failed to create short URL. Please try again.",
    });
  }
}
async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;

  try {
    const entry = await URL.findOne({ shortId });
    if (!entry) return res.status(404).json({ error: "Short ID not found" });

    return res.json({
      totalClicks: entry.visitHistory.length,
      analytics: entry.visitHistory,
    });
  } catch (error) {
    console.error("Analytics Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
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
