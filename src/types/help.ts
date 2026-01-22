export interface HelpCategory {
    id: string;
    name: string;
    icon: string;
    description: string;
}

export interface HelpArticle {
    id: string;
    title: string;
    content: string;
    categoryId: string;
    tags: string[];
    lastUpdated: string;
    isPopular?: boolean;
}
