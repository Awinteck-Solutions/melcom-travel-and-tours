export interface CreateBlogDto {
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  category: string;
  tags?: string[];
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  featured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}

export interface UpdateBlogDto {
  title?: string;
  content?: string;
  excerpt?: string;
  featuredImage?: string;
  category?: string;
  tags?: string[];
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  featured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}

export interface BlogResponse {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  category: any;
  author: any;
  tags: string[];
  status: string;
  publishedAt?: string;
  viewCount: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogCategoryDto {
  name: string;
  description?: string;
  image?: string;
  status?: "ACTIVE" | "INACTIVE";
}

export interface UpdateBlogCategoryDto {
  name?: string;
  description?: string;
  image?: string;
  status?: "ACTIVE" | "INACTIVE";
}

export interface BlogCategoryResponse {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  status: string;
  blogCount?: number;
  createdAt: string;
  updatedAt: string;
}
