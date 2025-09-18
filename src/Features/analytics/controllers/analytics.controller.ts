import { Request, Response } from 'express';
import { ActivityLogs, DashboardAnalytics, SystemMetrics } from '../schema/analytics.schema';
import { ActivityLogsDTO, DashboardAnalyticsDTO, SystemMetricsDTO } from '../dto/analytics.dto';

export class AnalyticsController {
    // Get activity logs with filtering
    async getLogs(req: Request, res: Response) {
        try {
            const { userId, action, resource, startDate, endDate, limit = 50, page = 1 } = req.query;
            
            const filter: any = {};
            if (userId) filter.userId = userId;
            if (action) filter.action = action;
            if (resource) filter.resource = resource;
            
            if (startDate || endDate) {
                filter.timestamp = {};
                if (startDate) filter.timestamp.$gte = new Date(startDate as string);
                if (endDate) filter.timestamp.$lte = new Date(endDate as string);
            }
            
            const skip = (Number(page) - 1) * Number(limit);
            
            const logs = await ActivityLogs
                .find(filter)
                .sort({ timestamp: -1 })
                .skip(skip)
                .limit(Number(limit));
                
            const total = await ActivityLogs.countDocuments(filter);
            const logsDTO = logs.map(log => new ActivityLogsDTO(log));
            
            res.status(200).json({
                success: true,
                data: logsDTO,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    pages: Math.ceil(total / Number(limit))
                },
                message: 'Activity logs retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving activity logs',
                error: error.message
            });
        }
    }

    // Get dashboard analytics
    async getDashboardAnalytics(req: Request, res: Response) {
        try {
            const { startDate, endDate } = req.query;
            
            const filter: any = {};
            if (startDate || endDate) {
                filter.date = {};
                if (startDate) filter.date.$gte = new Date(startDate as string);
                if (endDate) filter.date.$lte = new Date(endDate as string);
            }
            
            const analytics = await DashboardAnalytics
                .find(filter)
                .sort({ date: -1 });
                
            const analyticsDTO = analytics.map(analytic => new DashboardAnalyticsDTO(analytic));
            
            // Calculate aggregated totals
            const aggregated = {
                users: {
                    total: analytics.reduce((sum, a) => sum + a.users.total, 0),
                    new: analytics.reduce((sum, a) => sum + a.users.new, 0),
                    active: analytics.reduce((sum, a) => sum + a.users.active, 0)
                },
                bookings: {
                    total: analytics.reduce((sum, a) => sum + a.bookings.total, 0),
                    completed: analytics.reduce((sum, a) => sum + a.bookings.completed, 0),
                    cancelled: analytics.reduce((sum, a) => sum + a.bookings.cancelled, 0),
                    pending: analytics.reduce((sum, a) => sum + a.bookings.pending, 0)
                },
                revenue: {
                    total: analytics.reduce((sum, a) => sum + a.revenue.total, 0),
                    currency: analytics.length > 0 ? analytics[0].revenue.currency : 'USD'
                },
                cancellations: {
                    total: analytics.reduce((sum, a) => sum + a.cancellations.total, 0)
                },
                contactInfo: {
                    inquiries: analytics.reduce((sum, a) => sum + a.contactInfo.inquiries, 0),
                    resolved: analytics.reduce((sum, a) => sum + a.contactInfo.resolved, 0),
                    pending: analytics.reduce((sum, a) => sum + a.contactInfo.pending, 0)
                }
            };
            
            res.status(200).json({
                success: true,
                data: {
                    daily: analyticsDTO,
                    aggregated
                },
                message: 'Dashboard analytics retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving dashboard analytics',
                error: error.message
            });
        }
    }

    // Get users analytics
    async getUsersAnalytics(req: Request, res: Response) {
        try {
            const { startDate, endDate } = req.query;
            
            const filter: any = {};
            if (startDate || endDate) {
                filter.date = {};
                if (startDate) filter.date.$gte = new Date(startDate as string);
                if (endDate) filter.date.$lte = new Date(endDate as string);
            }
            
            const analytics = await DashboardAnalytics
                .find(filter, { date: 1, users: 1 })
                .sort({ date: -1 });
                
            res.status(200).json({
                success: true,
                data: analytics,
                message: 'Users analytics retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving users analytics',
                error: error.message
            });
        }
    }

    // Get bookings analytics
    async getBookingsAnalytics(req: Request, res: Response) {
        try {
            const { startDate, endDate } = req.query;
            
            const filter: any = {};
            if (startDate || endDate) {
                filter.date = {};
                if (startDate) filter.date.$gte = new Date(startDate as string);
                if (endDate) filter.date.$lte = new Date(endDate as string);
            }
            
            const analytics = await DashboardAnalytics
                .find(filter, { date: 1, bookings: 1 })
                .sort({ date: -1 });
                
            res.status(200).json({
                success: true,
                data: analytics,
                message: 'Bookings analytics retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving bookings analytics',
                error: error.message
            });
        }
    }

    // Get revenue/amount analytics
    async getAmountAnalytics(req: Request, res: Response) {
        try {
            const { startDate, endDate } = req.query;
            
            const filter: any = {};
            if (startDate || endDate) {
                filter.date = {};
                if (startDate) filter.date.$gte = new Date(startDate as string);
                if (endDate) filter.date.$lte = new Date(endDate as string);
            }
            
            const analytics = await DashboardAnalytics
                .find(filter, { date: 1, revenue: 1 })
                .sort({ date: -1 });
                
            res.status(200).json({
                success: true,
                data: analytics,
                message: 'Amount analytics retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving amount analytics',
                error: error.message
            });
        }
    }

    // Get cancellations analytics
    async getCancellationsAnalytics(req: Request, res: Response) {
        try {
            const { startDate, endDate } = req.query;
            
            const filter: any = {};
            if (startDate || endDate) {
                filter.date = {};
                if (startDate) filter.date.$gte = new Date(startDate as string);
                if (endDate) filter.date.$lte = new Date(endDate as string);
            }
            
            const analytics = await DashboardAnalytics
                .find(filter, { date: 1, cancellations: 1 })
                .sort({ date: -1 });
                
            res.status(200).json({
                success: true,
                data: analytics,
                message: 'Cancellations analytics retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving cancellations analytics',
                error: error.message
            });
        }
    }

    // Get contact info analytics
    async getContactInfoAnalytics(req: Request, res: Response) {
        try {
            const { startDate, endDate } = req.query;
            
            const filter: any = {};
            if (startDate || endDate) {
                filter.date = {};
                if (startDate) filter.date.$gte = new Date(startDate as string);
                if (endDate) filter.date.$lte = new Date(endDate as string);
            }
            
            const analytics = await DashboardAnalytics
                .find(filter, { date: 1, contactInfo: 1 })
                .sort({ date: -1 });
                
            res.status(200).json({
                success: true,
                data: analytics,
                message: 'Contact info analytics retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving contact info analytics',
                error: error.message
            });
        }
    }
}