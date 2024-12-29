const express = require("express");
const app = express();
const PORT = 8000;
const connectDB = require("./config/db");
const authRouter = require("./routes/auth");
const itemRouter = require("./routes/item");
const orderRouter = require("./routes/order");
const addressRouter = require("./routes/address");

app.use(express.json());

connectDB();

app.use("/auth", authRouter);
app.use("/api", itemRouter, orderRouter, addressRouter);
app.get("/", (req, res) => {
  res.send("Hello from api ");
});
app.listen(PORT, () => {
  console.log(`Server listing to ${PORT}`);
});
