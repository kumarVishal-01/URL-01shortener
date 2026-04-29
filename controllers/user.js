const { v4: uuidv4 } = require("uuid");
const User = require("../models/user");
const { setUser } = require("../service/auth");

async function handleUserSignup(req, res) {
  const { name, email, password } = req.body;
  try {
    const user = await User.create({
      name,
      email,
      password,
    });
    const token = setUser(user);
    res.cookie("token", token);
    return res.redirect("/");
  } catch (error) {
    console.error("Signup Error:", error);
    return res.render("signup", {
      error: "Error creating account. Email might already be in use.",
    });
  }
}

async function handleUserLogin(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });

    if (!user)
      return res.render("login", {
        error: "Invalid Username or Password",
      });

    const token = setUser(user);
    res.cookie("token", token);
    return res.redirect("/");
  } catch (error) {
    console.error("Login Error:", error);
    return res.render("login", {
      error: "An internal error occurred. Please try again later.",
    });
  }
}

module.exports = {
  handleUserSignup,
  handleUserLogin,
};
