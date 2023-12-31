const Razorpay = require("Razorpay");
const crypto = require("crypto");

var rezorpay = new Razorpay({
  key_id: "rzp_test_ddXpXIjpWfDt1s",
  key_secret: "8TsZO3kIctq4G0DRGzORx3hL",
});

exports.rezorpayCheckout = async function (req, res, next) {
  try {
    const { new_price, quantity, name } = req.body;
    const response = await rezorpay.orders.create({
      amount: ((quantity ? quantity * new_price : new_price) * 100).toString(),
      currency: "INR",
      receipt: `${
        quantity ? quantity * new_price : new_price
      } paid for ${name}`,
      // payment_capture,
    });
    // console.log({ response });
    res.json({
      data: { data: { ...response, key: "rzp_test_ddXpXIjpWfDt1s" } },
    });
  } catch (err) {
    console.log(err);
  }
};

function generateHmacSha256(data, secret) {
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(data);
  return hmac.digest("hex");
}

exports.rzPaymentVarification = async function (req, res, next) {
  try {
    const { order_id } = req.query;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    console.log("body:", razorpay_payment_id, req.body);
    let generated_signature = generateHmacSha256(
      order_id + "|" + razorpay_payment_id,
      "8TsZO3kIctq4G0DRGzORx3hL" || process.env.APIKEYSECRETE_REZORPAY
    );

    if (generated_signature == razorpay_signature) {
      console.log("payment is successful");
      res.json({
        data: {
          data: {
            msg: "payment is successful",
            secret: process.env.APIKEYSECRETE_REZORPAY,
          },
        },
      });
    }
  } catch (err) {
    console.log(err);
  }
};
exports.rezorpayPaymentVarification = async function (req, res, next) {
  try {
    const { user_id } = req.query;
    const {
      order_id,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;
    console.log("body:", req.body);
    let generated_signature = generateHmacSha256(
      order_id + "|" + razorpay_payment_id,
      "8TsZO3kIctq4G0DRGzORx3hL" || process.env.APIKEYSECRETE_REZORPAY
    );

    if (generated_signature == razorpay_signature) {
      console.log("payment is successful");
      res.json({
        data: {
          data: {
            msg: "payment is successful",
            secret: process.env.APIKEYSECRETE_REZORPAY,
            order_id: razorpay_order_id,
            payment_id: razorpay_payment_id,
          },
        },
      });
    }
  } catch (err) {
    console.log(err);
  }
};
