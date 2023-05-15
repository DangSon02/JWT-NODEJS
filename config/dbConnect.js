const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.DATABASE, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("Connected to mongoDB Successfully!");
//   } catch (error) {
//     console.log(error);
//     process.exit(1);
//   }
// };
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
const connectDB = () => {
  mongoose
    .connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((con) => {
      //console.log(con.connections);
      console.log("DB connection successful!");
    });
};

module.exports = connectDB;
