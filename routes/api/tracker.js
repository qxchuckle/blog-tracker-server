const express = require("express");
const bodyParser = require("body-parser");
const VisitorStats = require("../../models/VisitorStats.js");
const router = express.Router();

router.post("/tracker", bodyParser.text(), async (req, res) => {
  try {
    const body = JSON.parse(req.body);
    const { uuid, time, event, targetKey, duration } = body;
    const date = new Date(
      Date.UTC(
        new Date(time).getUTCFullYear(),
        new Date(time).getUTCMonth(),
        new Date(time).getUTCDate()
      )
    ); // 将时间戳转换为当天的 UTC 日期

    if (event === "beforeunload" && targetKey === "close") {
      // 查找或创建当天的访客统计记录
      const stats = await VisitorStats.findOneAndUpdate(
        { uuid, date },
        { $inc: { visitCount: 1, totalDuration: duration } },
        { upsert: true, new: true }
      );
    }
    res.send("ok");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
