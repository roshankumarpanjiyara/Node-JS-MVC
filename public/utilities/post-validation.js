//check validation
function validateInput(enteredTitle, enteredContent) {
  if (
    enteredTitle &&
    enteredContent &&
    enteredTitle.trim() !== "" &&
    enteredContent.trim() !== ""
  ) {
    return true;
  }
  return false;
}
//post session validation
function getSessionErrorData(req, values) {
  let sessionInputData = req.session.inputData;

  if (!sessionInputData) {
    sessionInputData = {
      hasError: false,
      ...values
    };
  }

  req.session.inputData = null;

  return sessionInputData;
}

function flashErrorMessage(req, data, action) {
  req.session.inputData = {
    hasError: true,
    //   message: "Invalid input - please check your data.",
    //   title: enteredTitle,
    //   content: enteredContent,
    ...data,
  };

  req.session.save(action);
}

module.exports = {
  validateInput: validateInput,
  getSessionErrorData: getSessionErrorData,
  flashErrorMessage: flashErrorMessage,
};
