import { Request, Response } from "express";
import { AnalyticsService } from "../services/analytics.service";
import Log from "../schema/log.schema";
import User from "../../auth/schema/user.schema";
import { ContactUsForm } from "../../contact/schema/contact.schema";

export class AnalyticsController {
  // LOG EVENT
  static async logEvent(req: Request, res: Response) {
    try {
      const { action, metadata } = req.body;
      const userId = (req as any).user?.id;
      const sessionId = (req.headers["x-session-id"] as string) || "anonymous";
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.get("User-Agent");

      await AnalyticsService.logEvent(
        action,
        metadata,
        userId,
        sessionId,
        ipAddress,
        userAgent
      );

      return res.status(200).json({
        status: true,
        message: "Event logged successfully",
      });
    } catch (error) {
      console.log("error :>> ", error);
      return res.status(500).json({
        status: false,
        message: "Failed to log event",
        error: error,
      });
    }
  }

  // GET LOGS (Admin)
  static async getLogs(req: Request, res: Response) {
    try {
      const {
        action,
        category,
        userId,
        dateFrom,
        dateTo,
        country,
        device,
        browser,
        page = 1,
        limit = 50,
      } = req.query;

      const filter: any = {};

      if (action) filter.action = action;
      if (category) filter.category = category;
      if (userId) filter.userId = userId;
      if (country) filter.country = country;
      if (device) filter.device = device;
      if (browser) filter.browser = browser;

      if (dateFrom || dateTo) {
        filter.createdAt = {};
        if (dateFrom) filter.createdAt.$gte = new Date(dateFrom as string);
        if (dateTo) filter.createdAt.$lte = new Date(dateTo as string);
      }

      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

      const logs = await Log.find(filter)
        .populate("userId", "firstname lastname email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit as string));

      const total = await Log.countDocuments(filter);

      return res.status(200).json({
        status: true,
        message: "Logs retrieved successfully",
        data: {
          logs,
          pagination: {
            current: parseInt(page as string),
            total: Math.ceil(total / parseInt(limit as string)),
            count: total,
          },
        },
      });
    } catch (error) {
      console.log("error :>> ", error);
      return res.status(500).json({
        status: false,
        message: "Failed to retrieve logs",
        error: error,
      });
    }
  }

  // GET TOTAL USERS
  static async getTotalUsers(req: Request, res: Response) {
    try {
      const totalUsers = await User.countDocuments();

      return res.status(200).json({
        status: true,
        message: "Total users retrieved successfully",
        data: { totalUsers },
      });
    } catch (error) {
      console.log("error :>> ", error);
      return res.status(500).json({
        status: false,
        message: "Failed to retrieve total users",
        error: error,
      });
    }
  }

  // GET TOTAL BOOKINGS
  static async getTotalBookings(req: Request, res: Response) {
    try {
      const totalBookings = await AnalyticsService.getTotalBookings();

      return res.status(200).json({
        status: true,
        message: "Total bookings retrieved successfully",
        data: { totalBookings },
      });
    } catch (error) {
      console.log("error :>> ", error);
      return res.status(500).json({
        status: false,
        message: "Failed to retrieve total bookings",
        error: error,
      });
    }
  }

  // GET TOTAL AMOUNT
  static async getTotalAmount(req: Request, res: Response) {
    try {
      const totalAmount = await AnalyticsService.getTotalAmount();

      return res.status(200).json({
        status: true,
        message: "Total amount retrieved successfully",
        data: {
          totalAmount,
          currency: "USD", // Default currency
        },
      });
    } catch (error) {
      console.log("error :>> ", error);
      return res.status(500).json({
        status: false,
        message: "Failed to retrieve total amount",
        error: error,
      });
    }
  }

  // GET TOTAL CANCELLATIONS
  static async getTotalCancellations(req: Request, res: Response) {
    try {
      const totalCancellations = await AnalyticsService.getTotalCancellations();

      return res.status(200).json({
        status: true,
        message: "Total cancellations retrieved successfully",
        data: { totalCancellations },
      });
    } catch (error) {
      console.log("error :>> ", error);
      return res.status(500).json({
        status: false,
        message: "Failed to retrieve total cancellations",
        error: error,
      });
    }
  }

  // GET TOTAL CONTACT INFO
  static async getTotalContactInfo(req: Request, res: Response) {
    try {
      const totalContactForms = await ContactUsForm.countDocuments();
      const pendingForms = await ContactUsForm.countDocuments({
        status: "NEW",
      });
      const resolvedForms = await ContactUsForm.countDocuments({
        status: "RESOLVED",
      });
      const inProgressForms = await ContactUsForm.countDocuments({
        status: "IN_PROGRESS",
      });

      return res.status(200).json({
        status: true,
        message: "Contact info statistics retrieved successfully",
        data: {
          totalContactForms,
          pendingForms,
          resolvedForms,
          inProgressForms,
        },
      });
    } catch (error) {
      console.log("error :>> ", error);
      return res.status(500).json({
        status: false,
        message: "Failed to retrieve contact info statistics",
        error: error,
      });
    }
  }

  // GET COMPREHENSIVE ANALYTICS DASHBOARD
  static async getAnalyticsDashboard(req: Request, res: Response) {
    try {
      const { days = 30 } = req.query;

      // Get all analytics data in parallel
      const [
        totalUsers,
        totalBookings,
        totalAmount,
        totalCancellations,
        totalContactForms,
        dailyStats,
        popularDestinations,
        popularBlogs,
        popularFaqs,
        deviceBreakdown,
        browserBreakdown,
        conversionRates,
      ] = await Promise.all([
        User.countDocuments(),
        AnalyticsService.getTotalBookings(),
        AnalyticsService.getTotalAmount(),
        AnalyticsService.getTotalCancellations(),
        ContactUsForm.countDocuments(),
        AnalyticsService.getDailyStats(parseInt(days as string)),
        AnalyticsService.getPopularDestinations(10),
        AnalyticsService.getPopularBlogs(10),
        AnalyticsService.getPopularFAQs(10),
        AnalyticsService.getDeviceBreakdown(),
        AnalyticsService.getBrowserBreakdown(),
        AnalyticsService.getConversionRates(),
      ]);

      const analyticsData = {
        summary: {
          totalUsers,
          totalBookings,
          totalAmount,
          totalCancellations,
          totalContactForms,
        },
        dailyStats,
        popularDestinations,
        popularContent: {
          blogs: popularBlogs,
          faqs: popularFaqs,
        },
        userBehavior: {
          deviceBreakdown,
          browserBreakdown,
        },
        conversionRates,
        generatedAt: new Date().toISOString(),
      };

      return res.status(200).json({
        status: true,
        message: "Analytics dashboard data retrieved successfully",
        data: analyticsData,
      });
    } catch (error) {
      console.log("error :>> ", error);
      return res.status(500).json({
        status: false,
        message: "Failed to retrieve analytics dashboard data",
        error: error,
      });
    }
  }

  // GET ANALYTICS SUMMARY
  static async getAnalyticsSummary(req: Request, res: Response) {
    try {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const thisWeek = new Date(today);
      thisWeek.setDate(thisWeek.getDate() - 7);

      const thisMonth = new Date(today);
      thisMonth.setDate(thisMonth.getDate() - 30);

      // Get counts for different time periods
      const [
        totalUsers,
        totalBookings,
        todayBookings,
        weeklyBookings,
        monthlyBookings,
        totalAmount,
        weeklyAmount,
        monthlyAmount,
      ] = await Promise.all([
        User.countDocuments(),
        Log.countDocuments({ action: "BOOK_FLIGHT" }),
        Log.countDocuments({
          action: "BOOK_FLIGHT",
          createdAt: { $gte: yesterday },
        }),
        Log.countDocuments({
          action: "BOOK_FLIGHT",
          createdAt: { $gte: thisWeek },
        }),
        Log.countDocuments({
          action: "BOOK_FLIGHT",
          createdAt: { $gte: thisMonth },
        }),
        AnalyticsService.getTotalAmount(),
        // Calculate weekly and monthly amounts
        Log.find({
          action: "BOOK_FLIGHT",
          createdAt: { $gte: thisWeek },
          "metadata.amount": { $exists: true },
        }).then((logs) =>
          logs.reduce((sum, log) => sum + (log.metadata.amount || 0), 0)
        ),
        Log.find({
          action: "BOOK_FLIGHT",
          createdAt: { $gte: thisMonth },
          "metadata.amount": { $exists: true },
        }).then((logs) =>
          logs.reduce((sum, log) => sum + (log.metadata.amount || 0), 0)
        ),
      ]);

      const summary = {
        users: {
          total: totalUsers,
        },
        bookings: {
          total: totalBookings,
          today: todayBookings,
          weekly: weeklyBookings,
          monthly: monthlyBookings,
        },
        revenue: {
          total: totalAmount,
          weekly: weeklyAmount,
          monthly: monthlyAmount,
          currency: "USD",
        },
        period: {
          from: thisMonth.toISOString(),
          to: today.toISOString(),
        },
      };

      return res.status(200).json({
        status: true,
        message: "Analytics summary retrieved successfully",
        data: summary,
      });
    } catch (error) {
      console.log("error :>> ", error);
      return res.status(500).json({
        status: false,
        message: "Failed to retrieve analytics summary",
        error: error,
      });
    }
  }
}
