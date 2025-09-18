import mongoose, { Schema } from "mongoose";

// Activity Logs Schema
const ActivityLogsSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    action: {
        type: String,
        required: true
    },
    resource: {
        type: String,
        required: true
    },
    resourceId: String,
    details: {
        type: Object,
        default: {}
    },
    ipAddress: String,
    userAgent: String,
    timestamp: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Dashboard Analytics Schema
const DashboardAnalyticsSchema = new Schema({
    date: {
        type: Date,
        required: true,
        unique: true
    },
    users: {
        total: { type: Number, default: 0 },
        new: { type: Number, default: 0 },
        active: { type: Number, default: 0 }
    },
    bookings: {
        total: { type: Number, default: 0 },
        completed: { type: Number, default: 0 },
        cancelled: { type: Number, default: 0 },
        pending: { type: Number, default: 0 }
    },
    revenue: {
        total: { type: Number, default: 0 },
        currency: { type: String, default: 'USD' }
    },
    cancellations: {
        total: { type: Number, default: 0 },
        reasons: [{
            reason: String,
            count: Number
        }]
    },
    contactInfo: {
        inquiries: { type: Number, default: 0 },
        resolved: { type: Number, default: 0 },
        pending: { type: Number, default: 0 }
    }
}, { timestamps: true });

// System Metrics Schema
const SystemMetricsSchema = new Schema({
    timestamp: {
        type: Date,
        default: Date.now
    },
    performance: {
        responseTime: Number,
        throughput: Number,
        errorRate: Number
    },
    traffic: {
        pageViews: Number,
        uniqueVisitors: Number,
        bounceRate: Number
    },
    system: {
        cpuUsage: Number,
        memoryUsage: Number,
        diskUsage: Number
    }
}, { timestamps: true });

// Create and export models
const ActivityLogs = mongoose.model("ActivityLogs", ActivityLogsSchema);
const DashboardAnalytics = mongoose.model("DashboardAnalytics", DashboardAnalyticsSchema);
const SystemMetrics = mongoose.model("SystemMetrics", SystemMetricsSchema);

export { ActivityLogs, DashboardAnalytics, SystemMetrics };

export default ActivityLogs;