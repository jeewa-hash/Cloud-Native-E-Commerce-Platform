const IS_LOCAL = false;

const API_GATEWAY = "https://0eqk5p25gi.execute-api.us-east-1.amazonaws.com";
const AUTH_ALB = "http://auth-alb-1878950287.us-east-1.elb.amazonaws.com"; // ✅ your own auth service
const SHOP_ALB = "http://shop-alb-1290651910.us-east-1.elb.amazonaws.com"; // ✅ your own shop service

const LOCAL = {
  BASE_URL: "http://localhost:5002",
  AUTH_API: "http://localhost:5002/api/auth",
  SHOP_API: "http://localhost:4040/api",
  ORDER_API: "http://localhost:4000/api",
  NOTIFICATION_SERVICE_URL: "http://localhost:5000",
  PRODUCTS_API: "http://localhost:4040/api"
};

const PROD = {
  BASE_URL: AUTH_ALB,
  AUTH_API: `${AUTH_ALB}/api/auth`,
  SHOP_API: `${SHOP_ALB}/api/shop`,
  ORDER_API: `${API_GATEWAY}/api/order`,
  NOTIFICATION_SERVICE_URL: `${API_GATEWAY}/notification`,
  PRODUCTS_API: `${SHOP_ALB}/api/products`
};

const config = IS_LOCAL ? LOCAL : PROD;

export const { BASE_URL, AUTH_API, SHOP_API, ORDER_API, NOTIFICATION_SERVICE_URL, PRODUCTS_API } = config;