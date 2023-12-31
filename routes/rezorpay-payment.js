const express = require("express");
const isAuthenticated = require("../middleware/auth-middleware");
const {
  rezorpayCheckout,
  rzPaymentVarification,
  rezorpayPaymentVarification,
} = require("../controllers/rezorpay-payment");

const router = express.Router();

router.post("/order-checkout", isAuthenticated, rezorpayCheckout);

router.post("/rz-varification", rzPaymentVarification);

router.post("/varification", isAuthenticated, rezorpayPaymentVarification);

module.exports = router;
