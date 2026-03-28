// Shared/middleware/interceptor.js
export const publishInterceptor = (handler) => (req, res, next) => {
  const originalJson = res.json;

  res.json = function (data) {
    if (res.statusCode === 201 && data.success) {
      handler(data, req); // pass data and req to your handler
    }
    return originalJson.call(this, data);
  };

  next();
};