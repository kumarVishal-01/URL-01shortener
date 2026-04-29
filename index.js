const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");

const { connectMongoDb } = require("./connection");
const { checkForAuthentication, restrictTo } = require("./middlewares/auth");

const URL = require("./models/url");

const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");

const app = express();
const PORT = 8001;

connectMongoDb("mongodb://127.0.0.1:27017/short-url");

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// MISSING PART
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthentication);

app.use("/url", restrictTo(["NORMAL", "ADMIN"]), urlRoute);
app.use("/user", userRoute);
app.use("/", staticRoute);

app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  console.log(req.headers["user-agent"]);
  const entry = await URL.findOneAndUpdate(
    { shortId },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
          ip: req.ip,
          userAgent: req.headers["user-agent"],
        },
      },
    },
  );
  if (!entry) {
    return res.status(404).send("Short URL not found");
  }
  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server Started at PORT :${PORT}`));
