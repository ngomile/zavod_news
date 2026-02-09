import * as z from 'zod';

export const schema = z.object({
    title: z.string().min(1, "Title is required").max(255, "Title cannot exceed 255 characters"),
    lead_img: z.custom<FileList>((fileList) => {
        return fileList instanceof FileList;
    }),
    content: z.string().min(1, "Content is required"),
    tags: z.array(z.number()).optional(),
    images: z.custom<FileList>().optional(),
});

