var express = require("express");
var router = express.Router();
const isAuthenticated = require("../middleware/auth-middleware");
const userController = require("../controllers/user");

//signup
router.post("/create-user", userController.createUser);
//login
router.post("/login-user", userController.loginUser);

router.get("/cart-items", isAuthenticated, userController.getUserCartItems);
router.post("/cart-items", isAuthenticated, userController.userAddCartItems);
router.delete(
  "/cart-items",
  isAuthenticated,
  userController.userRemoveCartItems
);
router.put("/cart-items", isAuthenticated, userController.userUpdateCartItems);

module.exports = router;
