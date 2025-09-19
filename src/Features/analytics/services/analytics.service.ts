import Log from "../schema/log.schema";

export class AnalyticsService {
  // Helper function to detect device type from user agent
  private static getDeviceType(userAgent: string): string {
    if (!userAgent) return "UNKNOWN";

    const ua = userAgent.toLowerCase();
    if (ua.includes("mobile") || ua.includes("android")) return "MOBILE";
    if (ua.includes("tablet") || ua.includes("ipad")) return "TABLET";
    return "DESKTOP";
  }

  // Helper function to extract browser from user agent
  private static getBrowser(userAgent: string): string {
    if (!userAgent) return "Unknown";

    const ua = userAgent.toLowerCase();
    if (ua.includes("chrome")) return "Chrome";
    if (ua.includes("firefox")) return "Firefox";
    if (ua.includes("safari") && !ua.includes("chrome")) return "Safari";
    if (ua.includes("edge")) return "Edge";
    if (ua.includes("opera")) return "Opera";
    return "Other";
  }

  // Helper function to extract OS from user agent
  private static getOS(userAgent: string): string {
    if (!userAgent) return "Unknown";

    const ua = userAgent.toLowerCase();
    if (ua.includes("windows")) return "Windows";
    if (ua.includes("macintosh") || ua.includes("mac os")) return "macOS";
    if (ua.includes("linux")) return "Linux";
    if (ua.includes("android")) return "Android";
    if (ua.includes("ios") || ua.includes("iphone") || ua.includes("ipad"))
      return "iOS";
    return "Other";
  }

  // Log an event
  static async logEvent(
    action: string,
    metadata: any = {},
    userId?: string,
    sessionId?: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    try {
      const categoryMap: { [key: string]: string } = {
        SEARCH_FLIGHTS: "SEARCH",
        CLICK_FLIGHT: "CLICK",
        CLICK_FLIGHT_DEAL: "CLICK",
        CLICK_BLOG: "CLICK",
        CLICK_FAQ: "CLICK",
        USE_PROMO: "USER_ACTION",
        VIEW_COUNTRY: "PAGE_VIEW",
        BOOK_FLIGHT: "BOOKING",
        CANCEL_BOOKING: "BOOKING",
        CONTACT_FORM: "USER_ACTION",
        LOGIN: "USER_ACTION",
        REGISTER: "USER_ACTION",
        VIEW_PAGE: "PAGE_VIEW",
      };

      const log = new Log({
        userId: userId || null,
        sessionId: sessionId || null,
        action,
        category: categoryMap[action] || "USER_ACTION",
        metadata,
        ipAddress,
        userAgent,
        device: this.getDeviceType(userAgent || ""),
        browser: this.getBrowser(userAgent || ""),
        os: this.getOS(userAgent || ""),
      });

      await log.save();
    } catch (error) {
      console.error("Analytics logging error:", error);
      // Don't throw error - analytics should not break app functionality
    }
  }

  // Get total users count
  static async getTotalUsers(): Promise<number> {
    return await Log.distinct("userId", { userId: { $ne: null } }).then(
      (users) => users.length
    );
  }

  // Get total bookings count
  static async getTotalBookings(): Promise<number> {
    return await Log.countDocuments({ action: "BOOK_FLIGHT" });
  }

  // Get total amount from bookings
  static async getTotalAmount(): Promise<number> {
    const bookings = await Log.find({
      action: "BOOK_FLIGHT",
      "metadata.amount": { $exists: true },
    });

    return bookings.reduce((total, booking) => {
      return total + (booking.metadata.amount || 0);
    }, 0);
  }

  // Get total cancellations count
  static async getTotalCancellations(): Promise<number> {
    return await Log.countDocuments({ action: "CANCEL_BOOKING" });
  }

  // Get total contact forms count
  static async getTotalContactForms(): Promise<number> {
    return await Log.countDocuments({ action: "CONTACT_FORM" });
  }

  // Get popular destinations
  static async getPopularDestinations(limit: number = 10): Promise<any[]> {
    const searchAggregation = await Log.aggregate([
      {
        $match: { action: "SEARCH_FLIGHTS", "metadata.to": { $exists: true } },
      },
      { $group: { _id: "$metadata.to", searchCount: { $sum: 1 } } },
      { $sort: { searchCount: -1 } },
      { $limit: limit },
    ]);

    const bookingAggregation = await Log.aggregate([
      { $match: { action: "BOOK_FLIGHT", "metadata.to": { $exists: true } } },
      { $group: { _id: "$metadata.to", bookingCount: { $sum: 1 } } },
    ]);

    // Combine search and booking data
    const destinations = searchAggregation.map((item) => {
      const bookingData = bookingAggregation.find(
        (booking) => booking._id === item._id
      );
      return {
        destination: item._id,
        searchCount: item.searchCount,
        bookingCount: bookingData ? bookingData.bookingCount : 0,
      };
    });

    return destinations;
  }

  // Get device breakdown
  static async getDeviceBreakdown(): Promise<any[]> {
    const total = await Log.countDocuments();
    const breakdown = await Log.aggregate([
      { $group: { _id: "$device", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    return breakdown.map((item) => ({
      device: item._id,
      count: item.count,
      percentage: Math.round((item.count / total) * 100),
    }));
  }

  // Get browser breakdown
  static async getBrowserBreakdown(): Promise<any[]> {
    const total = await Log.countDocuments();
    const breakdown = await Log.aggregate([
      { $group: { _id: "$browser", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    return breakdown.map((item) => ({
      browser: item._id,
      count: item.count,
      percentage: Math.round((item.count / total) * 100),
    }));
  }

  // Get daily stats for a date range
  static async getDailyStats(days: number = 30): Promise<any[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const dailyStats = await Log.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          users: { $addToSet: "$userId" },
          bookings: {
            $sum: { $cond: [{ $eq: ["$action", "BOOK_FLIGHT"] }, 1, 0] },
          },
          searches: {
            $sum: { $cond: [{ $eq: ["$action", "SEARCH_FLIGHTS"] }, 1, 0] },
          },
          amount: {
            $sum: {
              $cond: [
                { $eq: ["$action", "BOOK_FLIGHT"] },
                { $ifNull: ["$metadata.amount", 0] },
                0,
              ],
            },
          },
        },
      },
      {
        $project: {
          date: "$_id",
          users: { $size: "$users" },
          bookings: 1,
          searches: 1,
          amount: 1,
        },
      },
      { $sort: { date: 1 } },
    ]);

    return dailyStats;
  }

  // Get conversion rates
  static async getConversionRates(): Promise<any> {
    const totalSearches = await Log.countDocuments({
      action: "SEARCH_FLIGHTS",
    });
    const totalBookings = await Log.countDocuments({ action: "BOOK_FLIGHT" });
    const totalContacts = await Log.countDocuments({ action: "CONTACT_FORM" });
    const totalDealClicks = await Log.countDocuments({
      action: "CLICK_FLIGHT_DEAL",
    });

    return {
      searchToBooking:
        totalSearches > 0
          ? Math.round((totalBookings / totalSearches) * 100)
          : 0,
      contactToBooking:
        totalContacts > 0
          ? Math.round((totalBookings / totalContacts) * 100)
          : 0,
      dealClickToBooking:
        totalDealClicks > 0
          ? Math.round((totalBookings / totalDealClicks) * 100)
          : 0,
    };
  }

  // Get popular content
  static async getPopularBlogs(limit: number = 10): Promise<any[]> {
    return await Log.aggregate([
      {
        $match: { action: "CLICK_BLOG", "metadata.itemId": { $exists: true } },
      },
      {
        $group: {
          _id: "$metadata.itemId",
          title: { $first: "$metadata.itemTitle" },
          clickCount: { $sum: 1 },
        },
      },
      { $sort: { clickCount: -1 } },
      { $limit: limit },
      {
        $project: {
          blogId: "$_id",
          title: 1,
          clickCount: 1,
        },
      },
    ]);
  }

  static async getPopularFAQs(limit: number = 10): Promise<any[]> {
    return await Log.aggregate([
      { $match: { action: "CLICK_FAQ", "metadata.itemId": { $exists: true } } },
      {
        $group: {
          _id: "$metadata.itemId",
          question: { $first: "$metadata.itemTitle" },
          clickCount: { $sum: 1 },
        },
      },
      { $sort: { clickCount: -1 } },
      { $limit: limit },
      {
        $project: {
          faqId: "$_id",
          question: 1,
          clickCount: 1,
        },
      },
    ]);
  }
}
