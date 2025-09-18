export class ActivityLogsDTO {
    id: string
    userId: string
    action: string
    resource: string
    resourceId?: string
    details: object
    ipAddress?: string
    userAgent?: string
    timestamp: Date
    createdAt: Date

    constructor(data) {
        this.id = data.id || data._id;
        this.userId = data.userId;
        this.action = data.action;
        this.resource = data.resource;
        this.resourceId = data.resourceId;
        this.details = data.details || {};
        this.ipAddress = data.ipAddress;
        this.userAgent = data.userAgent;
        this.timestamp = data.timestamp;
        this.createdAt = data.createdAt;
    }
}

export class DashboardAnalyticsDTO {
    id: string
    date: Date
    users: {
        total: number
        new: number
        active: number
    }
    bookings: {
        total: number
        completed: number
        cancelled: number
        pending: number
    }
    revenue: {
        total: number
        currency: string
    }
    cancellations: {
        total: number
        reasons: Array<{
            reason: string
            count: number
        }>
    }
    contactInfo: {
        inquiries: number
        resolved: number
        pending: number
    }
    createdAt: Date

    constructor(data) {
        this.id = data.id || data._id;
        this.date = data.date;
        this.users = data.users;
        this.bookings = data.bookings;
        this.revenue = data.revenue;
        this.cancellations = data.cancellations;
        this.contactInfo = data.contactInfo;
        this.createdAt = data.createdAt;
    }
}

export class SystemMetricsDTO {
    id: string
    timestamp: Date
    performance: {
        responseTime?: number
        throughput?: number
        errorRate?: number
    }
    traffic: {
        pageViews?: number
        uniqueVisitors?: number
        bounceRate?: number
    }
    system: {
        cpuUsage?: number
        memoryUsage?: number
        diskUsage?: number
    }
    createdAt: Date

    constructor(data) {
        this.id = data.id || data._id;
        this.timestamp = data.timestamp;
        this.performance = data.performance || {};
        this.traffic = data.traffic || {};
        this.system = data.system || {};
        this.createdAt = data.createdAt;
    }
}