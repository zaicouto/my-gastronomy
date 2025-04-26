export default function httpResponse(_, res, next) {
  res.ok = (data) => {
    return res.status(200).json({
      success: true,
      error: null,
      body: data,
    });
  };

  res.badRequest = (message) => {
    return res.status(400).json({
      success: false,
      error: message,
      body: null,
    });
  };

  res.serverError = () => {
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      body: null,
    });
  };

  next();
}
