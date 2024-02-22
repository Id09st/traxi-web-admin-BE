const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const managerRoutes = require("./routes/manager.routes");
const cors = require("cors");
// Sử dụng cors với cấu hình chi tiết
app.use(
  cors({
    origin: "https://traxi-web-admin-fe.vercel.app", // Chỉ cho phép request từ origin này
  })
);

app.use(express.json())
app.use(bodyParser.json());


//Router
app.use('/api/v1', managerRoutes);
app.get('/posts', (req, res) => {
  res.json(posts)
})



app.listen(5000, () => {
  console.log("I am ready to listen you");
});