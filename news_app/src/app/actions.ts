import {
  type Article,
  type Tag
} from '@/types';

import {
  API_URL
} from '@/lib/config';
import { getAuthToken, getUser } from './auth/actions';


export const fetchArticlesByPage = async (pageNumber: number = 1, tag: string | null): Promise<[Article[], number]> => {
  const user = getUser();
  let articles: Article[] = [];
  let nextPage = 1;

  let url = '';
  
  if (tag) {
    url = `${API_URL}articles/?page=${pageNumber}&tag=${tag}`;
  } else {
    url = `${API_URL}articles/?page=${pageNumber}`;
  }
  
  try {
      let headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (user) {
        const token = getAuthToken();
        headers = {
          ...headers,
          'Authorization': `Bearer ${token}`,
        };
      }
    
      const response = await fetch(url, { method: 'GET', headers: headers });
      
      if (!response.ok) {
          throw new Error(`Error fetching articles: ${response.statusText}`);
      }

      const jsonData = await response.json();
      const data = jsonData.results;
      
      articles = data.map((item: Article) => ({
          id: item.id,
          title: item.title,
          content: item.content,
          created_on: item.created_at,
          tags: item.tags,
          lead_img: item.lead_img,
          likes_count: item.likes_count,
          dislikes_count: item.dislikes_count,
          user_reaction: item.user_reaction
      }));
      
      const nextPageURL = new URL(jsonData.next);
      console.log(`Next page url ${nextPageURL}`);
      const urlParams = new URLSearchParams(nextPageURL.search);
      nextPage = parseInt(urlParams.get('page') ?? '1');
      console.log(`Next page${nextPage}`);
  } catch (error) {
      console.error("Failed to fetch news items:", error);
  }

  console.log(`Articles ${articles.length}, nextPage: ${nextPage}`);
  return [articles, nextPage];
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
      user_reaction: jsonData.user_reaction,
      comments: jsonData.comments,
    };
    
    return article;
  } catch (error) {
    console.error(error);
  }

  return undefined;
}

export const fetchTags = async () => {
  const url = `${API_URL}tags/`;
  let tags: Tag[] = [];

  try {
      const response = await fetch(url, { method: 'GET' });
      
      if (!response.ok) {
          throw new Error(`Error fetching news items: ${response.statusText}`);
      }

      const data = await response.json();

      tags = data.map((item: Tag) => ({
          id: item.id,
          label: item.label,
          image: item.image,
          views: item.views,
      }));
  } catch (error) {
      console.error("Failed to fetch tags:", error);
  }

  return tags;
}

export const fetchTag = async(id: number): Promise<Tag | undefined> => {
  let tag: Tag;
  const url = `${API_URL}tags/${id}/`;

  try {
    const response = await fetch(
      url,
      {
        'method': 'GET'
      }
    );

    const jsonData = await response.json();

    tag = {
      id: jsonData.id,
      label: jsonData.label,
      image: jsonData.image
    };
    
    return tag;
  } catch (error) {
    console.error(error);
  }

  return undefined;
};
