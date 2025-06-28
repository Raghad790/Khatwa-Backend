// Basic admin usage report controller
export async function getUsageReport(req, res) {
  try {
    // Example: return dummy usage data. Replace with real stats as needed.
    const usage = {
      users: 123,
      courses: 45,
      loginsToday: 12,
      timestamp: new Date().toISOString(),
    };
    res.json({ success: true, usage });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch usage report",
        error: err.message,
      });
  }
}
