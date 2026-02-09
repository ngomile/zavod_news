export type ArticleFormData = {
    title: string;
    lead_img: FileList;
    content: string;
    tags?: number[];
    images?: FileList;
};
