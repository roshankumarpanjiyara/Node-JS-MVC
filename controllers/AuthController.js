const bcrypt = require("bcryptjs");
const mongodb = require("mongodb");

const Auth = require("../models/Auth");
const authValidation = require("../public/utilities/auth-validation");

function get401Page(req, res){
  res.status(401).render("401");
}

function getSignUpPage(req, res) {
  const sessionInputData = authValidation.getSessionErrorData(req, {
    email: "",
    confirmEmail: "",
    password: "",
  });

  res.render("signup", {
    inputData: sessionInputData,
  });
}

function getLoginPage(req, res) {
  const sessionInputData = authValidation.getSessionErrorData(req, {
    email: "",
    password: "",
  });

  res.render("login", {
    inputData: sessionInputData,
  });
}

async function signup(req, res) {
  const userData = req.body;
  const enteredEmail = userData.email; // userData['email']
  const enteredConfirmEmail = userData["confirm-email"];
  const enteredPassword = userData.password;

  if (
    !authValidation.validInput(
      enteredEmail,
      enteredConfirmEmail,
      enteredPassword
    )
  ) {
    authValidation.flashErrorMessage(
      req,
      {
        message: "Invalid input - please check your data.",
        email: enteredEmail,
        confirmEmail: enteredConfirmEmail,
        password: enteredPassword,
      },
      function () {
        res.redirect("/signup");
      }
    );

    return;
  }

  const auth = new Auth(enteredEmail, null, null);
  //   const existingUser = await db
  //     .getDb()
  //     .collection("users")
  //     .findOne({ email: enteredEmail });
  const existingUser = await auth.fetchUserByEmail();
  // console.log(existingUser);
  if (existingUser) {
    authValidation.flashErrorMessage(
      req,
      {
        message: "User exists already!",
        email: enteredEmail,
        confirmEmail: enteredConfirmEmail,
        password: enteredPassword,
      },
      function () {
        res.redirect("/signup");
      }
    );
    return;
  }

  //   const hashedPassword = await bcrypt.hash(enteredPassword, 12);

  //   const user = {
  //     email: enteredEmail,
  //     password: hashedPassword,
  //   };

  //   await db.getDb().collection("users").insertOne(user);
  const newUser = new Auth(enteredEmail, enteredPassword, null);
  await newUser.save();

  res.redirect("/login");
}

async function login(req, res) {
  const userData = req.body;
  const enteredEmail = userData.email;
  const enteredPassword = userData.password;

  const auth = new Auth(enteredEmail, null, null);
  //   const existingUser = await db
  //     .getDb()
  //     .collection("users")
  //     .findOne({ email: enteredEmail });
  const existingUser = await auth.fetchUserByEmail();

  if (!existingUser) {
    authValidation.flashErrorMessage(
      req,
      {
        message: "Could not log you in - please check your credentials!",
        email: enteredEmail,
        password: enteredPassword,
      },
      function () {
        res.redirect("/login");
      }
    );
    // req.session.inputData = {
    //   hasError: true,
    //   message: "Could not log you in - please check your credentials!",
    //   email: enteredEmail,
    //   password: enteredPassword,
    // };
    // req.session.save(function () {
    //   res.redirect("/login");
    // });
    return;
  }

  const passwordsAreEqual = await bcrypt.compare(
    enteredPassword,
    existingUser.password
  );

  if (!passwordsAreEqual) {
    authValidation.flashErrorMessage(
      req,
      {
        message: "Could not log you in - please check your credentials!",
        email: enteredEmail,
        password: enteredPassword,
      },
      function () {
        res.redirect("/login");
      }
    );
    // req.session.inputData = {
    //   hasError: true,
    //   message: "Could not log you in - please check your credentials!",
    //   email: enteredEmail,
    //   password: enteredPassword,
    // };
    // req.session.save(function () {
    //   res.redirect("/login");
    // });
    return;
  }

  req.session.user = { id: existingUser._id, email: existingUser.email };
  req.session.isAuthenticated = true;
  req.session.save(function () {
    res.redirect("/admin");
  });
}

function logout(req, res) {
  req.session.user = null;
  req.session.isAuthenticated = false;
  res.redirect("/");
}

module.exports = {
  get401Page: get401Page,
  getSignUpPage: getSignUpPage,
  getLoginPage: getLoginPage,
  signup: signup,
  login: login,
  logout: logout,
};
