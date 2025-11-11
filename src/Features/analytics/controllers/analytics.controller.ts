import { Request, Response } from 'express';
import { ActivityLogs, DashboardAnalytics, SystemMetrics } from '../schema/analytics.schema';
import { ActivityLogsDTO, DashboardAnalyticsDTO, SystemMetricsDTO } from '../dto/analytics.dto';
import UserCheckout from '../../userCheckout/schema/userCheckout.schema';
import User from '../../auth/schema/user.schema';
import { Roles } from '../../../enums/roles.enum';

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

    // Get dashboard overview analytics
    async getDashboardOverview(req: Request, res: Response) {
        try {
            // Total paid bookings (paymentStatus = 'PAID')
            const totalPaidBookings = await UserCheckout.countDocuments({ paymentStatus: 'PAID' });

            // Total users (role = 'USER')
            const totalUsers = await User.countDocuments({ role: Roles.USER });

            // Revenue (sum of totalAmount where paymentStatus = 'PAID')
            const revenueResult = await UserCheckout.aggregate([
                { $match: { paymentStatus: 'PAID' } },
                {
                    $group: {
                        _id: '$currency',
                        total: { $sum: '$totalAmount' }
                    }
                }
            ]);

            // Calculate revenue by currency
            const revenue: any = {};
            revenueResult.forEach((item: any) => {
                revenue[item._id] = item.total;
            });

            // Get total revenue (sum all currencies)
            const totalRevenue = revenueResult.reduce((sum: number, item: any) => sum + item.total, 0);

            // Get default currency (most common currency or GHS)
            const defaultCurrency = revenueResult.length > 0 
                ? revenueResult[0]._id 
                : 'GHS';

            // Admin accounts (count of users where role = 'ADMIN')
            const adminAccounts = await User.countDocuments({ role: Roles.ADMIN });

            res.status(200).json({
                success: true,
                message: 'Dashboard overview analytics retrieved successfully',
                data: {
                    totalPaidBookings,
                    totalUsers,
                    revenue: {
                        total: totalRevenue,
                        byCurrency: revenue,
                        currency: defaultCurrency
                    },
                    adminAccounts
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving dashboard overview analytics',
                error: error.message
            });
        }
    }

    // Helper function to generate all months in a date range
    private generateMonthRange(startDate: Date, endDate: Date): Array<{year: number, month: number, monthLabel: string}> {
        const months: Array<{year: number, month: number, monthLabel: string}> = [];
        const current = new Date(startDate);
        current.setDate(1); // Set to first day of month
        
        while (current <= endDate) {
            const year = current.getFullYear();
            const month = current.getMonth() + 1; // getMonth() returns 0-11
            const monthLabel = `${year}-${month.toString().padStart(2, '0')}`;
            
            months.push({ year, month, monthLabel });
            
            // Move to next month
            current.setMonth(current.getMonth() + 1);
        }
        
        return months;
    }

    // Get user signups graph data grouped monthly
    async getUserSignupsGraph(req: Request, res: Response) {
        try {
            const { startDate, endDate, role } = req.query;
            
            // Determine date range
            let start: Date;
            let end: Date;
            
            if (startDate && endDate) {
                start = new Date(startDate as string);
                end = new Date(endDate as string);
                end.setHours(23, 59, 59, 999);
            } else {
                // Get min/max dates from data if not provided
                const dateRange = await User.aggregate([
                    {
                        $group: {
                            _id: null,
                            minDate: { $min: '$createdAt' },
                            maxDate: { $max: '$createdAt' }
                        }
                    }
                ]);
                
                if (dateRange.length === 0 || !dateRange[0].minDate) {
                    return res.status(200).json({
                        success: true,
                        message: 'User signups graph data retrieved successfully',
                        data: []
                    });
                }
                
                start = startDate ? new Date(startDate as string) : new Date(dateRange[0].minDate);
                end = endDate ? new Date(endDate as string) : new Date(dateRange[0].maxDate);
                if (endDate) {
                    end.setHours(23, 59, 59, 999);
                }
            }
            
            // Build date filter
            const dateFilter: any = {
                createdAt: {
                    $gte: start,
                    $lte: end
                }
            };

            // Add role filter if provided
            if (role) {
                dateFilter.role = role;
            } else {
                // Default to USER role if not specified
                dateFilter.role = Roles.USER;
            }

            // Aggregate user signups by month
            const signupsData = await User.aggregate([
                { $match: dateFilter },
                {
                    $group: {
                        _id: {
                            year: { $year: '$createdAt' },
                            month: { $month: '$createdAt' }
                        },
                        count: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        year: '$_id.year',
                        month: '$_id.month',
                        monthLabel: {
                            $concat: [
                                { $toString: '$_id.year' },
                                '-',
                                { $cond: [
                                    { $lt: ['$_id.month', 10] },
                                    { $concat: ['0', { $toString: '$_id.month' }] },
                                    { $toString: '$_id.month' }
                                ]}
                            ]
                        },
                        count: 1
                    }
                }
            ]);

            // Generate all months in range
            const allMonths = this.generateMonthRange(start, end);
            
            // Create a map of existing data
            const dataMap = new Map<string, number>();
            signupsData.forEach((item: any) => {
                dataMap.set(item.monthLabel, item.count);
            });
            
            // Merge with all months, filling in 0 for missing months
            const completeData = allMonths.map(month => ({
                year: month.year,
                month: month.month,
                monthLabel: month.monthLabel,
                count: dataMap.get(month.monthLabel) || 0
            }));

            res.status(200).json({
                success: true,
                message: 'User signups graph data retrieved successfully',
                data: completeData
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving user signups graph data',
                error: error.message
            });
        }
    }

    // Get checkout bookings graph data grouped monthly
    async getCheckoutBookingsGraph(req: Request, res: Response) {
        try {
            const { startDate, endDate, status, paymentStatus } = req.query;
            
            // Determine date range
            let start: Date;
            let end: Date;
            
            if (startDate && endDate) {
                start = new Date(startDate as string);
                end = new Date(endDate as string);
                end.setHours(23, 59, 59, 999);
            } else {
                // Get min/max dates from data if not provided
                const dateRange = await UserCheckout.aggregate([
                    {
                        $group: {
                            _id: null,
                            minDate: { $min: '$createdAt' },
                            maxDate: { $max: '$createdAt' }
                        }
                    }
                ]);
                
                if (dateRange.length === 0 || !dateRange[0].minDate) {
                    return res.status(200).json({
                        success: true,
                        message: 'Checkout bookings graph data retrieved successfully',
                        data: []
                    });
                }
                
                start = startDate ? new Date(startDate as string) : new Date(dateRange[0].minDate);
                end = endDate ? new Date(endDate as string) : new Date(dateRange[0].maxDate);
                if (endDate) {
                    end.setHours(23, 59, 59, 999);
                }
            }
            
            // Build date filter
            const dateFilter: any = {
                createdAt: {
                    $gte: start,
                    $lte: end
                }
            };

            // Add status filter if provided
            if (status) {
                dateFilter.status = status;
            }

            // Add paymentStatus filter if provided
            if (paymentStatus) {
                dateFilter.paymentStatus = paymentStatus;
            }

            // Aggregate bookings by month and status
            const bookingsData = await UserCheckout.aggregate([
                { $match: dateFilter },
                {
                    $group: {
                        _id: {
                            year: { $year: '$createdAt' },
                            month: { $month: '$createdAt' },
                            paymentStatus: '$paymentStatus'
                        },
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: {
                        '_id.year': 1,
                        '_id.month': 1,
                        '_id.paymentStatus': 1
                    }
                },
                {
                    $group: {
                        _id: {
                            year: '$_id.year',
                            month: '$_id.month'
                        },
                        monthLabel: {
                            $first: {
                                $concat: [
                                    { $toString: '$_id.year' },
                                    '-',
                                    { $cond: [
                                        { $lt: ['$_id.month', 10] },
                                        { $concat: ['0', { $toString: '$_id.month' }] },
                                        { $toString: '$_id.month' }
                                    ]}
                                ]
                            }
                        },
                        data: {
                            $push: {
                                paymentStatus: '$_id.paymentStatus',
                                count: '$count'
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        year: '$_id.year',
                        month: '$_id.month',
                        monthLabel: 1,
                        paid: {
                            $let: {
                                vars: {
                                    paidData: {
                                        $arrayElemAt: [
                                            {
                                                $filter: {
                                                    input: '$data',
                                                    as: 'item',
                                                    cond: { $eq: ['$$item.paymentStatus', 'PAID'] }
                                                }
                                            },
                                            0
                                        ]
                                    }
                                },
                                in: { $ifNull: ['$$paidData.count', 0] }
                            }
                        },
                        pending: {
                            $let: {
                                vars: {
                                    pendingData: {
                                        $arrayElemAt: [
                                            {
                                                $filter: {
                                                    input: '$data',
                                                    as: 'item',
                                                    cond: { $eq: ['$$item.paymentStatus', 'PENDING'] }
                                                }
                                            },
                                            0
                                        ]
                                    }
                                },
                                in: { $ifNull: ['$$pendingData.count', 0] }
                            }
                        },
                        failed: {
                            $let: {
                                vars: {
                                    failedData: {
                                        $arrayElemAt: [
                                            {
                                                $filter: {
                                                    input: '$data',
                                                    as: 'item',
                                                    cond: { $eq: ['$$item.paymentStatus', 'FAILED'] }
                                                }
                                            },
                                            0
                                        ]
                                    }
                                },
                                in: { $ifNull: ['$$failedData.count', 0] }
                            }
                        }
                    }
                },
                {
                    $sort: {
                        year: 1,
                        month: 1
                    }
                }
            ]);

            // Generate all months in range
            const allMonths = this.generateMonthRange(start, end);
            
            // Create a map of existing data
            const dataMap = new Map<string, {paid: number, pending: number, failed: number}>();
            bookingsData.forEach((item: any) => {
                dataMap.set(item.monthLabel, {
                    paid: item.paid || 0,
                    pending: item.pending || 0,
                    failed: item.failed || 0
                });
            });
            
            // Merge with all months, filling in 0 for missing months
            const completeData = allMonths.map(month => {
                const existing = dataMap.get(month.monthLabel);
                return {
                    year: month.year,
                    month: month.month,
                    monthLabel: month.monthLabel,
                    paid: existing?.paid || 0,
                    pending: existing?.pending || 0,
                    failed: existing?.failed || 0
                };
            });

            res.status(200).json({
                success: true,
                message: 'Checkout bookings graph data retrieved successfully',
                data: completeData
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving checkout bookings graph data',
                error: error.message
            });
        }
    }
}