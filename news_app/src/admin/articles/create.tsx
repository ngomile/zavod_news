import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';

import {
    schema
} from '@/admin/articles/_schema';

import type {
    ArticleFormData
} from "@/admin/articles/_types";

import {
    createArticle
} from '@/admin/articles/_actions';

import { MultiSelect } from "@/components/ui/multi-select";
import { Newspaper, type LucideProps } from "lucide-react";

import {
    fetchTags
} from '@/app/actions';

import type {
    Tag
} from '@/types';

const CreateArticleForm: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<ArticleFormData>({
        resolver: zodResolver(schema),
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [ tags, setTags ] = useState<Tag[]>();

    const [ tagSelectOptions, setTagSelectOptions ] = useState<{
        value: string;
        label: string;
        icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
    }[]>();
    const [selectedTags, setSelectedTags] = useState<string[]>();

    const onSubmit = async (data: ArticleFormData) => {
        const newsItemData: ArticleFormData = {
            ...data,
            tags: selectedTags?.map(tag => parseInt(tag))
        };

        const newsItem = await createArticle(newsItemData);

        if (newsItem) {
            console.log("News item created successfully!", newsItem);
            window.location.assign('/admin/articles');
        } else {
            console.error("Failed to create news item.");
        }
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        } else {
            setImagePreview(null);
        }
    };

    useEffect(() => {
        fetchTags().then(newTags => {
            setTags(newTags);
        })
    }, []);

    useEffect(() => {
        const newTagSelectOptions = tags?.map(tag => {
            return {
                value: tag.id.toString(),
                label: tag.label,
                icon: Newspaper
            }
        });

        setTagSelectOptions(newTagSelectOptions);
    }, [tags]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <Input 
                    id="title" 
                    {...register('title')} 
                    className={`mt-1 block border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm`} 
                />
                {errors.title && <span className="text-red-500">{errors.title.message}</span>}
            </div>
            <div>
                <label htmlFor="main_image" className="block text-sm font-medium text-gray-700">Main Image</label>
                <Input 
                    type="file"
                    accept="image/*" 
                    id="main_image"
                    {...register('lead_img')} 
                    onChange={handleImageChange}
                    className={`mt-1 block border ${errors.lead_img ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm`} 
                />
                {errors.lead_img && <span className="text-red-500">{errors.lead_img.message}</span>}
                {imagePreview && (
                    <img src={imagePreview} alt="Image Preview" className="mt-2 max-w-xs border rounded-md" />
                )}
            </div>
            <div>
                <label htmlFor="extra_images" className="block text-sm font-medium text-gray-700">Extra Images</label>
                <Input 
                    type="file"
                    accept="image/*" 
                    id="images"
                    multiple
                    {...register('images')} 
                    className={`mt-1 block border ${errors.images ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm`} 
                />
                {errors.images && <span className="text-red-500">{errors.images.message}</span>}
            </div>
            <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                {tagSelectOptions && (
                    <MultiSelect
                        id="tags"
                        options={tagSelectOptions}
                        onValueChange={setSelectedTags}
                        defaultValue={selectedTags}
                        placeholder="Select Tags"
                        variant="inverted"
                        animation={2}
                        maxCount={3}
                    />
                )}
            </div>
            <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
                <Textarea 
                    id="content" 
                    {...register('content')} 
                    className={`mt-1 block border ${errors.content ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm`} 
                />
                {errors.content && <span className="text-red-500">{errors.content.message}</span>}
            </div>
            <Button type="submit">
                <Plus />
                Create
            </Button>
        </form>
    );
};

export default CreateArticleForm;
