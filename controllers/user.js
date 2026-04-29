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
    console.error("Signup Error Details:", error);
    let errorMessage = "Error creating account. Please try again.";

    if (error.code === 11000) {
      errorMessage = "Email already in use. Please use a different email.";
    } else if (error.name === "ValidationError") {
      errorMessage = Object.values(error.errors).map(err => err.message).join(", ");
    } else {
      errorMessage = error.message; // Show the actual error message for debugging
    }

    return res.render("signup", {
      error: errorMessage,
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
