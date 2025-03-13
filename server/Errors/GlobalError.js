const GlobalError = (error, req, res, next) => {
  if (error.statusCode >= 400 && error.statusCode <= 499) {
    error.status = "Fail";
  }
  if (error.statusCode >= 500 && error.statusCode <= 599) {
    error.status = "Error";
  }
  return res.status(Error.statusCode || 500).json({
    status: error.status || "Error",
    statusCode: error.statusCode || 500,
    message: error.message,
  });
};
export default GlobalError;
