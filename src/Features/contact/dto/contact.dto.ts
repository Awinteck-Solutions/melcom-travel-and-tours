export interface ContactUsFormDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  inquiryType: string;
  subject: string;
  message: string;
  attachments?: {
    filename: string;
    url: string;
    mimeType: string;
  }[];
}

export interface ContactUsFormResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  inquiryType: any;
  subject: string;
  message: string;
  attachments: {
    filename: string;
    url: string;
    mimeType: string;
  }[];
  status: "NEW" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  assignedTo?: any;
  responseNotes: {
    note: string;
    respondedBy: any;
    respondedAt: string;
  }[];
  resolvedAt?: string;
  source: string;
  createdAt: string;
  updatedAt: string;
}

export interface InquiryTypeResponse {
  id: string;
  name: string;
  description?: string;
  order: number;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}

export interface CreateInquiryTypeDto {
  name: string;
  description?: string;
  order?: number;
  status?: "ACTIVE" | "INACTIVE";
}

export interface UpdateInquiryTypeDto {
  name?: string;
  description?: string;
  order?: number;
  status?: "ACTIVE" | "INACTIVE";
}

export interface UpdateContactFormStatusDto {
  status: "NEW" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  assignedTo?: string;
  responseNote?: string;
}

export interface ContactFormFilters {
  status?: "NEW" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  inquiryType?: string;
  assignedTo?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}
