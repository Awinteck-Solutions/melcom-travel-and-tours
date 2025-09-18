import { Request, Response } from 'express';
import { 
    RecommendedCountries, 
    TermsAndConditions, 
    PrivacyPolicy, 
    CookiesPolicy, 
    ContactInfo, 
    ContactUsForm, 
    InquiryTypes, 
    FAQ 
} from '../schema/content.schema';
import { 
    RecommendedCountriesDTO, 
    TermsAndConditionsDTO, 
    PrivacyPolicyDTO, 
    CookiesPolicyDTO, 
    ContactInfoDTO, 
    ContactUsFormDTO, 
    InquiryTypesDTO, 
    FAQDTO 
} from '../dto/content.dto';

export class ContentController {
    // Recommended Countries
    async getRecommendedCountries(req: Request, res: Response) {
        try {
            const countries = await RecommendedCountries.find({ status: 'ACTIVE' });
            const countriesDTO = countries.map(country => new RecommendedCountriesDTO(country));
            
            res.status(200).json({
                success: true,
                data: countriesDTO,
                message: 'Recommended countries retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving recommended countries',
                error: error.message
            });
        }
    }

    // Terms and Conditions
    async getTermsAndConditions(req: Request, res: Response) {
        try {
            const terms = await TermsAndConditions.findOne({ status: 'ACTIVE' }).sort({ createdAt: -1 });
            if (!terms) {
                return res.status(404).json({
                    success: false,
                    message: 'Terms and conditions not found'
                });
            }

            const termsDTO = new TermsAndConditionsDTO(terms);
            
            res.status(200).json({
                success: true,
                data: termsDTO,
                message: 'Terms and conditions retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving terms and conditions',
                error: error.message
            });
        }
    }

    // Privacy Policy
    async getPrivacyPolicy(req: Request, res: Response) {
        try {
            const policy = await PrivacyPolicy.findOne({ status: 'ACTIVE' }).sort({ createdAt: -1 });
            if (!policy) {
                return res.status(404).json({
                    success: false,
                    message: 'Privacy policy not found'
                });
            }

            const policyDTO = new PrivacyPolicyDTO(policy);
            
            res.status(200).json({
                success: true,
                data: policyDTO,
                message: 'Privacy policy retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving privacy policy',
                error: error.message
            });
        }
    }

    // Cookies Policy
    async getCookiesPolicy(req: Request, res: Response) {
        try {
            const cookies = await CookiesPolicy.findOne({ status: 'ACTIVE' }).sort({ createdAt: -1 });
            if (!cookies) {
                return res.status(404).json({
                    success: false,
                    message: 'Cookies policy not found'
                });
            }

            const cookiesDTO = new CookiesPolicyDTO(cookies);
            
            res.status(200).json({
                success: true,
                data: cookiesDTO,
                message: 'Cookies policy retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving cookies policy',
                error: error.message
            });
        }
    }

    // Contact Info
    async getContactInfo(req: Request, res: Response) {
        try {
            const contact = await ContactInfo.findOne({ status: 'ACTIVE' }).sort({ createdAt: -1 });
            if (!contact) {
                return res.status(404).json({
                    success: false,
                    message: 'Contact information not found'
                });
            }

            const contactDTO = new ContactInfoDTO(contact);
            
            res.status(200).json({
                success: true,
                data: contactDTO,
                message: 'Contact information retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving contact information',
                error: error.message
            });
        }
    }

    // Contact Us Form
    async submitContactForm(req: Request, res: Response) {
        try {
            const formData = new ContactUsForm(req.body);
            const savedForm = await formData.save();
            
            const formDTO = new ContactUsFormDTO(savedForm);
            
            res.status(201).json({
                success: true,
                data: formDTO,
                message: 'Contact form submitted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error submitting contact form',
                error: error.message
            });
        }
    }

    // Get Contact Form Submissions (Admin)
    async getContactFormSubmissions(req: Request, res: Response) {
        try {
            const { status } = req.query;
            const filter = status ? { status } : {};
            
            const submissions = await ContactUsForm.find(filter).sort({ createdAt: -1 });
            const submissionsDTO = submissions.map(submission => new ContactUsFormDTO(submission));
            
            res.status(200).json({
                success: true,
                data: submissionsDTO,
                message: 'Contact form submissions retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving contact form submissions',
                error: error.message
            });
        }
    }

    // Update Contact Form Status (Admin)
    async updateContactFormStatus(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { status, response, respondedBy } = req.body;
            
            const updateData: any = { status };
            if (response) {
                updateData.response = response;
                updateData.respondedAt = new Date();
                updateData.respondedBy = respondedBy;
            }
            
            const updatedSubmission = await ContactUsForm.findByIdAndUpdate(id, updateData, { new: true });
            if (!updatedSubmission) {
                return res.status(404).json({
                    success: false,
                    message: 'Contact form submission not found'
                });
            }
            
            const submissionDTO = new ContactUsFormDTO(updatedSubmission);
            
            res.status(200).json({
                success: true,
                data: submissionDTO,
                message: 'Contact form status updated successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating contact form status',
                error: error.message
            });
        }
    }

    // Inquiry Types
    async getInquiryTypes(req: Request, res: Response) {
        try {
            const types = await InquiryTypes.find({ status: 'ACTIVE' });
            const typesDTO = types.map(type => new InquiryTypesDTO(type));
            
            res.status(200).json({
                success: true,
                data: typesDTO,
                message: 'Inquiry types retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving inquiry types',
                error: error.message
            });
        }
    }

    // FAQ
    async getFAQs(req: Request, res: Response) {
        try {
            const { category } = req.query;
            const filter = category ? { category, status: 'ACTIVE' } : { status: 'ACTIVE' };
            
            const faqs = await FAQ.find(filter).sort({ order: 1, createdAt: -1 });
            const faqsDTO = faqs.map(faq => new FAQDTO(faq));
            
            res.status(200).json({
                success: true,
                data: faqsDTO,
                message: 'FAQs retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving FAQs',
                error: error.message
            });
        }
    }

    // Create FAQ (Admin)
    async createFAQ(req: Request, res: Response) {
        try {
            const faqData = new FAQ(req.body);
            const savedFAQ = await faqData.save();
            
            const faqDTO = new FAQDTO(savedFAQ);
            
            res.status(201).json({
                success: true,
                data: faqDTO,
                message: 'FAQ created successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error creating FAQ',
                error: error.message
            });
        }
    }

    // Update FAQ (Admin)
    async updateFAQ(req: Request, res: Response) {
        try {
            const { id } = req.params;
            
            const updatedFAQ = await FAQ.findByIdAndUpdate(id, req.body, { new: true });
            if (!updatedFAQ) {
                return res.status(404).json({
                    success: false,
                    message: 'FAQ not found'
                });
            }
            
            const faqDTO = new FAQDTO(updatedFAQ);
            
            res.status(200).json({
                success: true,
                data: faqDTO,
                message: 'FAQ updated successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating FAQ',
                error: error.message
            });
        }
    }

    // Delete FAQ (Admin)
    async deleteFAQ(req: Request, res: Response) {
        try {
            const { id } = req.params;
            
            const deletedFAQ = await FAQ.findByIdAndDelete(id);
            if (!deletedFAQ) {
                return res.status(404).json({
                    success: false,
                    message: 'FAQ not found'
                });
            }
            
            res.status(200).json({
                success: true,
                message: 'FAQ deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error deleting FAQ',
                error: error.message
            });
        }
    }
}