function validInput(enteredEmail, enteredConfirmEmail, enteredPassword) {
  return (
    enteredEmail &&
    enteredConfirmEmail &&
    enteredPassword &&
    enteredPassword.trim().length > 6 &&
    enteredEmail === enteredConfirmEmail &&
    enteredEmail.includes("@")
  );
}

function getSessionErrorData(req, values) {
  let sessionInputData = req.session.inputData;

  if (!sessionInputData) {
    sessionInputData = {
      hasError: false,
      ...values,
    };
  }

  req.session.inputData = null;

  return sessionInputData;
}

function flashErrorMessage(req, data, action) {
  req.session.inputData = {
    hasError: true,
    //   message: "Invalid input - please check your data.",
    //   email: enteredEmail,
    //   confirmEmail: enteredConfirmEmail,
    //   password: enteredPassword,
    ...data,
  };

  req.session.save(action);
}

module.exports = {
  validInput: validInput,
  getSessionErrorData: getSessionErrorData,
  flashErrorMessage: flashErrorMessage,
};
