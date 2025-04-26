export default function errorHandlerMiddleware(err, _, res, __) {
  console.error(err);
  const message = err.message || "An error occurred";

  if (err.status === 500) {
    return res.serverError();
  } else {
    return res.badRequest(message);
  }
}
