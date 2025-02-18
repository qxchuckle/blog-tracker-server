const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

// 导入路由
const trackerRouter = require("./routes/api/tracker.js");
const visitorStatsRouter = require("./routes/api/stats.js");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// 解决API跨域问题
// 请求来源白名单
const allowedOrigins = ["127.0.0.1:4000", "qcqx.cn", undefined];
app.use((req, res, next) => {
  const origin = req.headers.origin;
  // 判断请求来源是否在白名单内
  if (
    (origin && allowedOrigins.some((item) => origin.includes(item))) ||
    allowedOrigins.includes(origin)
  ) {
    // 设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin", origin);
    // 允许的header类型，如下设置允许自定义header、允许Content-Type为非默认值等，按需删改
    res.header(
      "Access-Control-Allow-Headers",
      "*, Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    // 跨域允许的请求方式
    res.header(
      "Access-Control-Allow-Methods",
      "PUT, POST, GET, DELETE, PATCH ,OPTIONS"
    );
    // 跨域的时候是否携带cookie
    // 需要与 XMLHttpRequest.withCredentials 或 Fetch API 的 Request() 构造函数中的 credentials 选项结合使用
    res.header("Access-Control-Allow-Credentials", true);
    if (req.method.toLowerCase() == "options") {
      res.send(200); // 让options请求快速结束
    } else {
      next();
    }
  } else {
    res.status(403).send("Forbidden");
  }
});

// 使用接口路由，路径添加api前缀
app.use("/api", trackerRouter);
app.use("/api", visitorStatsRouter);

// 最后兜底的路由
app.all("*", (req, res) => {
  res.json({
    code: 9001,
    msg: "无效的api",
    data: null,
  });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  console.log(err);

  // render the error page
  res.status(err.status || 500);
  res.json({
    code: "9002",
    msg: "服务器内部错误",
    data: null,
  });
});

module.exports = app;
