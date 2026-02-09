export type Article = {
    id?: number | undefined;
    title: string;
    lead_img: string;
    content: string;
    images?: ArticleImage[];
    created_at?: string;
    updated_at?: string;
    tags?: Tag[];
    views?: number;
    likes_count?: number;
    dislikes_count?: number;
    user_reaction?: "like" | "dislike" | null
    comments?: Comment[];
};

export type ArticleImage = {
    id: number;
    article: Article;
    image: string;
    created_at: string;
    updated_at: string;
};

export type Tag = {
    id: number;
    label: string;
    image: string;
    views?: number;
};

export type Reaction = {
    id: number;
    type: 'like' | 'dislike';
    user: User;
    news_item: Article;
    created_on: string;
    updated_on: string;
};

export type User = {
    id: number;
    username: string;
    email?: string;
};

export type Comment ={
  id: number;
  username: string;
  content: string;
  created_at: string;
};
