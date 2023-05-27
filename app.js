require("dotenv").config();
const express = require("express");
const app = express();
const routes = require("./routes");
const port = process.env.PORT;
app.use(express.json());
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use("/api/v1", routes);
app.get('/',(req,res)=>{
  return res.status(200).json("Hello World");
})
require("./connection/db");
app.listen(port || 4000, () => {
  console.log(`Server is running on port ${port}`);
});
