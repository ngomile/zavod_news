import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
    Trash
} from 'lucide-react';

import type {
    Article
} from '@/types';

import {
    deleteArticle as deleteItemImpl
} from '@/admin/articles/_actions';

function DeleteDialog({ newsItem }: { newsItem: Article}) {
    const deleteNewsItem = () => {
        deleteItemImpl(newsItem.id ?? -1);
        window.location.assign('/admin/articles');
    }

    return (
    <Dialog>
        <DialogTrigger asChild>
            <Button variant="outline">
                <Trash />
                Delete
            </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Delete News Article</DialogTitle>
                <DialogDescription>
                Are you sure you want to delete this article?
                </DialogDescription>
            </DialogHeader>
            <div>
                <div>#: { newsItem.id }</div>
                <blockquote>{ newsItem.title }</blockquote>
            </div>
            <DialogFooter>
                <Button onClick={ deleteNewsItem } className="bg-red-600" type="submit">
                    <Trash />
                    Delete
                    </Button>
                </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default DeleteDialog;