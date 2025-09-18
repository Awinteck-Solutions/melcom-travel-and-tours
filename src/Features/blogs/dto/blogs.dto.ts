export class BlogsDTO {
        id: string
        title: string
        content: string
        excerpt: string
        category: string
        author: string
        imageUrl?: string
        tags: string[]
        readTime: number
        views: number
        likes: number
        status: string
        publishedAt?: Date
        createdAt: Date

        constructor(data) {
          this.id = data.id || data._id;
          this.title = data.title;
          this.content = data.content;
          this.excerpt = data.excerpt;
          this.category = data.category;
          this.author = data.author;
          this.imageUrl = data.imageUrl;
          this.tags = data.tags || [];
          this.readTime = data.readTime;
          this.views = data.views;
          this.likes = data.likes;
          this.status = data.status;
          this.publishedAt = data.publishedAt;
          this.createdAt = data.createdAt;
        }
}

export class BlogCategoriesDTO {
        id: string
        name: string
        description?: string
        imageUrl?: string
        status: string
        createdAt: Date

        constructor(data) {
          this.id = data.id || data._id;
          this.name = data.name;
          this.description = data.description;
          this.imageUrl = data.imageUrl;
          this.status = data.status;
          this.createdAt = data.createdAt;
        }
}