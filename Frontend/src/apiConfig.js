const IS_LOCAL = false;

const API_GATEWAY = "https://0eqk5p25gi.execute-api.us-east-1.amazonaws.com";

const AUTH_ALB = "http://auth-alb-1878950287.us-east-1.elb.amazonaws.com";
const SHOP_ALB = "http://shop-alb-1290651910.us-east-1.elb.amazonaws.com";
const DELIVERY_ALB = "http://delivery-service-alb-1864288318.eu-north-1.elb.amazonaws.com";
const USER_ALB = "http://auth-alb-1878950287.us-east-1.elb.amazonaws.com";
const ORDER_ALB = "http://orderservice-alb-1335748857.eu-north-1.elb.amazonaws.com";

const PROD = {
  BASE_URL: AUTH_ALB,
  AUTH_API: `${AUTH_ALB}/api/auth`,
  USER_API: `${USER_ALB}/api/users`,

  SHOP_API: `${SHOP_ALB}/api`,
  PRODUCTS_API: `${SHOP_ALB}/api/products`,

  ORDER_API: `${ORDER_ALB}/api/order`,

  DELIVERY_API: `${DELIVERY_ALB}/delivery`,

  NOTIFICATION_SERVICE_URL: `${API_GATEWAY}/notification`,
};

const LOCAL = {
  BASE_URL: "http://localhost:5002",
  AUTH_API: "http://localhost:5002/api/auth",
  USER_API: "http://localhost:5002/api/users",

  SHOP_API: "http://localhost:4040/api",
  PRODUCTS_API: "http://localhost:4040/api/products",

  ORDER_API: "http://localhost:5001/api",

  DELIVERY_API: "http://localhost:5003/delivery",

  NOTIFICATION_SERVICE_URL: "http://localhost:5000",
};

const config = IS_LOCAL ? LOCAL : PROD;

export const {
  BASE_URL,
  AUTH_API,
  SHOP_API,
  ORDER_API,
  NOTIFICATION_SERVICE_URL,
  PRODUCTS_API,
  DELIVERY_API,
  USER_API,
} = config;
