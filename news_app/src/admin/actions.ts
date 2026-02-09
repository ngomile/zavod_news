import {
  getAuthToken
} from '@/app/auth/actions';

import {
  type Article,
} from '@/types';

import {
  API_URL
} from '@/lib/config';


const calculatePaginationIndices = (
  currentPage: number,
  pageSize: number,
  totalItems: number,
  currentResultSetLength: number
): { startIndex: number; endIndex: number; } => {
  if (currentPage < 1) {
      throw new Error("Current page must be at least 1.");
  }

  const startIndex = (currentPage - 1) * pageSize + 1;
  let endIndex = startIndex + pageSize - 1;

  if (endIndex > totalItems) {
      endIndex = totalItems;
  }
  if (endIndex > startIndex + currentResultSetLength) {
      endIndex = startIndex + currentResultSetLength;
  }

  return {
      startIndex,
      endIndex,
  };
}

export const fetchArticles = async (pageNumber: number = 1, orderBy: string | undefined = undefined): Promise<[Article[], number, number, number, number]> => {
  let articles: Article[] = [];
  let url = `${API_URL}articles/?page_size=18&page=${pageNumber}`;

  if (orderBy) {
    url = `${url}&order_by=${orderBy}`;
  }

  let count: number = 0;
  let nextPage: number = 0;

  try {
      const response = await fetch(url, { method: 'GET' });
      
      if (!response.ok) {
          throw new Error(`Error fetching articles: ${response.statusText}`);
      }

      const jsonData = await response.json();
      console.log(jsonData);
      
      count = jsonData.count;
      const data = jsonData.results;
      
      articles = data.map((item: Article) => ({
          id: item.id,
          title: item.title,
          content: item.content,
          created_on: item.created_at,
          tags: item.tags,
          main_image: item.lead_img,
          views: item.views,
      }));
      const nextPageURL = new URL(jsonData.next);
      const urlParams = new URLSearchParams(nextPageURL.search);

      nextPage = parseInt(urlParams.get('page') ?? '1');
  } catch (error) {
      console.error("Failed to fetch news items:", error);
  }

  const { startIndex, endIndex } = calculatePaginationIndices(
    pageNumber,
    18,
    count,
    articles.length
  );

  return [articles, count, nextPage, startIndex, endIndex];
};

export const fetchArticle = async (id: number): Promise<Article | undefined> => {
  let article: Article;
  const url = `${API_URL}articles/${id}/`;
  
  try {
    const response = await fetch(
      url,
      {
        'method': 'GET'
      }
    );

    const jsonData = await response.json();

    article = {
      id: jsonData.id,
      title: jsonData.title,
      lead_img: jsonData.lead_img,
      content: jsonData.content,
      images: jsonData.images,
      tags: jsonData.tags,
      created_at: jsonData.created_at,
      updated_at: jsonData.updated_at,
      likes_count: jsonData.likes_count,
      dislikes_count: jsonData.dislikes_count,
      user_reaction: jsonData.user_reaction
    };
    
    return article;
  } catch (error) {
    console.error(error);
  }

  return undefined;
};

export const deleteArticle = async (id: number): Promise<boolean> => {
    console.log(id);
    console.log(getAuthToken());

    return true;
}
