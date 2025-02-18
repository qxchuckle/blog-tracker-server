const express = require("express");
const VisitorStats = require("../../models/VisitorStats.js");
const router = express.Router();

// 统计数据的 API 路由
router.get("/stats", async (req, res) => {
  try {
    const today = new Date().setHours(0, 0, 0, 0);
    const yesterday = new Date(today - 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(
      Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1)
    );

    const todayStats = await VisitorStats.find({ date: today });
    const yesterdayStats = await VisitorStats.find({ date: yesterday });
    const monthStats = await VisitorStats.find({
      date: { $gte: startOfMonth },
    });
    const totalStats = await VisitorStats.find({}); // 获取所有时间段的统计数据

    const todayData = calculateStats(todayStats);
    const yesterdayData = calculateStats(yesterdayStats);
    const monthData = calculateStats(monthStats);
    const totalData = calculateStats(totalStats); // 计算总统计数据

    res.json({
      today: todayData,
      yesterday: yesterdayData,
      month: monthData,
      total: totalData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

const calculateStats = (stats) => {
  // 访问人数
  const visitors = new Set(stats.map((stat) => stat.uuid)).size;
  // 访问量
  const visitCount = stats.reduce((sum, stat) => sum + stat.visitCount, 0);
  // 总访问时长
  const totalDuration = stats.reduce(
    (sum, stat) => sum + stat.totalDuration,
    0
  );
  // 平均访问时长
  const averageDuration = visitCount > 0 ? totalDuration / visitors : 0;
  return { visitors, visitCount, totalDuration, averageDuration };
};

module.exports = router;
