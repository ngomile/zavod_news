import {
  useState,
  useEffect
} from 'react';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Button
} from "@/components/ui/button";

import type {
  Article
} from "@/types";

import {
  fetchArticles,
} from '@/admin/actions';

export default function Index() {
  const [newsItems, setNewsItems] = useState<Article[]>([]);
  const [page, setPage] = useState<number>(1);
  const [count, setCount] = useState<number>(0);
  const [nextPage, setNextPage] = useState<number>(1);
  const [startIndex, setStartIndex] = useState<number>(-1);
  const [endIndex, setEndIndex] = useState<number>(-1);

  useEffect(() => {
    fetchArticles(page).then(data => {
      setNewsItems(data[0]);
      setCount(data[1]);
      setNextPage(data[2]);
      setStartIndex(data[3]);
      setEndIndex(data[4]);
    })
  }, [page]);

  const navigateToPage = (n: number) => {
    setPage(n);
  }

  return (
    <>
      <div className="w-full flex flex-row justify-end p-2">
        <Button asChild>
          <a href="/admin/articles/create">Create New</a>
        </Button>
      </div>
      <Table>
        <TableCaption>Here are your news stories</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="text-right">Created On</TableHead>
            </TableRow>
          </TableHeader>
        <TableBody>
          {newsItems.map(newsItem => (
          <TableRow key={newsItem.id} className="hover:cursor-pointer" onClick={ () => window.location.assign(`/admin/articles/${newsItem.id}`) }>
            <TableCell className="font-medium">{newsItem.id}</TableCell>
            <TableCell>{newsItem.title}</TableCell>
            <TableCell className="text-right">{newsItem.created_at}</TableCell>
          </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {startIndex}-{endIndex} of { count }.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateToPage(page - 1)}
            disabled={ page <= 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateToPage(page + 1)}
            disabled={ nextPage <= page }
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}
  