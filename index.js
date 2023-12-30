const express = require("express");
const multer = require("multer");
const cors = require("cors");
const Razorpay = require("Razorpay");
const path = require("path");
const userRoutes = require("./routes/user");
const Connection = require("./database/connection-db");
const Items = require("./models/Items");
const isAuthenticated = require("./middleware/auth-middleware");

const app = express();
app.use(cors());
app.use(express.static("public"));
app.use(express.json());
Connection();

var rezorpay = new Razorpay({
  key_id: "rzp_test_ddXpXIjpWfDt1s",
  key_secret: "8TsZO3kIctq4G0DRGzORx3hL",
});

const storage = multer.diskStorage({
  destination: (req, image, cb) => {
    cb(null, "public/Images");
  },
  filename: (req, image, cb) => {
    cb(
      null,
      image.fieldname + "_" + Date.now() + path.extname(image.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
});

app.post(
  "/create",
  isAuthenticated,
  upload.single("image"),
  async (req, res) => {
    const { name, category, image, description, old_price, new_price } =
      req.body;

    console.log("get request on base route", req.file.filename);
    let singlePost = new Items({
      image: `http://localhost:4000/Images/${req.file.filename}`,
      name: name,
      description,
      old_price,
      new_price,
      category,
    });
    singlePost = await singlePost.save();

    res.json(singlePost);
  }
);

app.get("/getItems", isAuthenticated, async (req, res) => {
  const { sort, _id } = req.query;
  console.log("sort by:", sort);
  let singlePost;
  if (sort) singlePost = await Items.find({ category: sort });
  else if (_id) singlePost = await Items.findById(_id);
  else singlePost = await Items.find();

  res.json({ data: singlePost });
});
app.post("/rezorpay", isAuthenticated, async (req, res) => {
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
    console.log({ response });
    res.json({
      data: { data: { ...response, key: "rzp_test_ddXpXIjpWfDt1s" } },
    });
  } catch (err) {
    console.log(err);
  }
});

app.use("/user", userRoutes);

app.listen(4000, () => {
  console.log("Serever is Listening on Post 4000");
});
