const mongoose = require("mongoose");

const Connection = async () => {
  await mongoose
    .connect(
      process.env.DBUrl ||
        `mongodb+srv://Soheb:soheb1999@cluster0.cbtaqjr.mongodb.net/blog?retryWrites=true&w=majority`,
      {
        // useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err);
    });
};

module.exports = Connection;
