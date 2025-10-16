import mongoose, { Schema } from "mongoose";

// Recommended Countries Schema
const RecommendedCountriesSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    imageUrl: String,
    currency: String,
    language: String,
    bestTimeToVisit: String,
    averageTemperature: String,
    timeZone: String,
    popularDestinations: [String],
    visaRequirements: String,
    status: {
        type: String,
        enum: ["ACTIVE", "DEACTIVE"],
        default: "ACTIVE",
    },
}, { timestamps: true });

// Terms and Conditions Schema
const TermsAndConditionsSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    version: {
        type: String,
        default: "1.0"
    },
    effectiveDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ["ACTIVE", "DEACTIVE"],
        default: "ACTIVE",
    },
}, { timestamps: true });

// Privacy Policy Schema
const PrivacyPolicySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    version: {
        type: String,
        default: "1.0"
    },
    effectiveDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ["ACTIVE", "DEACTIVE"],
        default: "ACTIVE",
    },
}, { timestamps: true });

// Cookies Policy Schema
const CookiesPolicySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    version: {
        type: String,
        default: "1.0"
    },
    effectiveDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ["ACTIVE", "DEACTIVE"],
        default: "ACTIVE",
    },
}, { timestamps: true });

// Contact Info Schema
const ContactInfoSchema = new Schema({
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    whatsapp: {
        type: String,
        required: true
    },
    workingHours: String,
    socialMedia: {
        facebook: String,
        twitter: String,
        instagram: String,
        linkedin: String,
        youtube: String
    },
    status: {
        type: String,
        enum: ["ACTIVE", "DEACTIVE"],
        default: "ACTIVE",
    },
}, { timestamps: true });

// Contact Us Form Submissions Schema
const ContactUsFormSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: String,
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    inquiryType: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["NEW", "IN_PROGRESS", "RESOLVED", "CLOSED"],
        default: "NEW",
    },
    response: String,
    respondedAt: Date,
    respondedBy: String,
}, { timestamps: true });

// Inquiry Types Schema
const InquiryTypesSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: String,
    status: {
        type: String,
        enum: ["ACTIVE", "DEACTIVE"],
        default: "ACTIVE",
    },
}, { timestamps: true });

// FAQ Schema
const FAQSchema = new Schema({
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    category: String,
    order: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ["ACTIVE", "DEACTIVE"],
        default: "ACTIVE",
    },
}, { timestamps: true });

// Create and export models
const RecommendedCountries = mongoose.model("RecommendedCountries", RecommendedCountriesSchema);
const TermsAndConditions = mongoose.model("TermsAndConditions", TermsAndConditionsSchema);
const PrivacyPolicy = mongoose.model("PrivacyPolicy", PrivacyPolicySchema);
const CookiesPolicy = mongoose.model("CookiesPolicy", CookiesPolicySchema);
const ContactInfo = mongoose.model("ContactInfo", ContactInfoSchema);
const ContactUsForm = mongoose.model("ContactUsForm", ContactUsFormSchema);
const InquiryTypes = mongoose.model("InquiryTypes", InquiryTypesSchema);
const FAQ = mongoose.model("FAQ", FAQSchema);

export { 
    RecommendedCountries, 
    TermsAndConditions, 
    PrivacyPolicy, 
    CookiesPolicy, 
    ContactInfo, 
    ContactUsForm, 
    InquiryTypes, 
    FAQ 
};

export default RecommendedCountries;