export class RecommendedCountriesDTO {
    id: string
    name: string
    description?: string
    imageUrl?: string
    currency?: string
    language?: string
    bestTimeToVisit?: string
    averageTemperature?: string
    timeZone?: string
    popularDestinations: string[]
    visaRequirements?: string
    status: string
    createdAt: Date

    constructor(data) {
        this.id = data.id || data._id;
        this.name = data.name;
        this.description = data.description;
        this.imageUrl = data.imageUrl;
        this.currency = data.currency;
        this.language = data.language;
        this.bestTimeToVisit = data.bestTimeToVisit;
        this.averageTemperature = data.averageTemperature;
        this.timeZone = data.timeZone;
        this.popularDestinations = data.popularDestinations || [];
        this.visaRequirements = data.visaRequirements;
        this.status = data.status;
        this.createdAt = data.createdAt;
    }
}

export class TermsAndConditionsDTO {
    id: string
    title: string
    content: string
    version: string
    effectiveDate: Date
    status: string
    createdAt: Date

    constructor(data) {
        this.id = data.id || data._id;
        this.title = data.title;
        this.content = data.content;
        this.version = data.version;
        this.effectiveDate = data.effectiveDate;
        this.status = data.status;
        this.createdAt = data.createdAt;
    }
}

export class PrivacyPolicyDTO {
    id: string
    title: string
    content: string
    version: string
    effectiveDate: Date
    status: string
    createdAt: Date

    constructor(data) {
        this.id = data.id || data._id;
        this.title = data.title;
        this.content = data.content;
        this.version = data.version;
        this.effectiveDate = data.effectiveDate;
        this.status = data.status;
        this.createdAt = data.createdAt;
    }
}

export class CookiesPolicyDTO {
    id: string
    title: string
    content: string
    version: string
    effectiveDate: Date
    status: string
    createdAt: Date

    constructor(data) {
        this.id = data.id || data._id;
        this.title = data.title;
        this.content = data.content;
        this.version = data.version;
        this.effectiveDate = data.effectiveDate;
        this.status = data.status;
        this.createdAt = data.createdAt;
    }
}

export class ContactInfoDTO {
    id: string
    address: string
    phone: string
    whatsapp: string
    email: string
    workingHours?: string
    socialMedia?: {
        facebook?: string
        twitter?: string
        instagram?: string
        linkedin?: string
        youtube?: string
    }
    status: string
    createdAt: Date

    constructor(data) {
        this.id = data.id || data._id;
        this.address = data.address;
        this.phone = data.phone;
        this.whatsapp = data.whatsapp;
        this.email = data.email;
        this.workingHours = data.workingHours;
        this.socialMedia = data.socialMedia;
        this.status = data.status;
        this.createdAt = data.createdAt;
    }
}

export class ContactUsFormDTO {
    id: string
    name: string
    email: string
    phone?: string
    whatsapp?: string
    subject: string
    message: string
    inquiryType: string
    status: string
    response?: string
    respondedAt?: Date
    respondedBy?: string
    createdAt: Date

    constructor(data) {
        this.id = data.id || data._id;
        this.name = data.name;
        this.email = data.email;
        this.phone = data.phone;
        this.subject = data.subject;
        this.message = data.message;
        this.inquiryType = data.inquiryType;
        this.status = data.status;
        this.response = data.response;
        this.respondedAt = data.respondedAt;
        this.respondedBy = data.respondedBy;
        this.createdAt = data.createdAt;
    }
}

export class InquiryTypesDTO {
    id: string
    name: string
    description?: string
    status: string
    createdAt: Date

    constructor(data) {
        this.id = data.id || data._id;
        this.name = data.name;
        this.description = data.description;
        this.status = data.status;
        this.createdAt = data.createdAt;
    }
}

export class FAQDTO {
    id: string
    question: string
    answer: string
    category?: string
    order: number
    status: string
    createdAt: Date

    constructor(data) {
        this.id = data.id || data._id;
        this.question = data.question;
        this.answer = data.answer;
        this.category = data.category;
        this.order = data.order;
        this.status = data.status;
        this.createdAt = data.createdAt;
    }
}