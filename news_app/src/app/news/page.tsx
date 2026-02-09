import {
  useState,
  useEffect
} from 'react';

import {
  useParams
} from 'react-router-dom';

import {
  Card,
  CardContent
} from '@/components/ui/card';

import type {
  Article
} from '@/types';

import {
  fetchArticle
} from '@/app/actions';
import CommentSection from '@/components/comment-section';

const ArticlePage = () => {
  const { id } = useParams();
  const [ article, setNewsItem ] = useState<Article>();

  useEffect(() => {
    fetchArticle(parseInt(id ?? '-1')).then(data => {
      setNewsItem(data);
    });
  }, [id]);

  return (
    <>
      { article ? (
        <div className="min-h-screen flex flex-col items-center gap-2 p-2">
          <header className="flex flex-col justify-center items-center">
            <h2 className="text-3xl min-h-8 mt-2 mb-5 font-bold">{article.title}</h2>
            <img src={article.lead_img} className="h-96 aspect-video" alt={article.title}/>
            <div>
                <span className="font-thin">{article.created_at}</span>
            </div>
            <div>
              {article?.tags?.map((tag, index) => (
                <a href={ `/?tag_id=${tag.id}` } key={index} className="inline-block bg-gray-200 text-gray-700 rounded-full px-2 py-1 text-sm mr-2 mb-2">
                  { tag.label }
                </a>
              ))}
            </div>
          </header>
          <div className="p-2 flex flex-row gap-2">
              { article.images?.map(image => (
                <img 
                  className="h-48 p-2 aspect-video object-fit object-contain bg-white"
                  src={image.image} alt={ `${article.title} image - ${image.id}`}
                />
              ))}
          </div>
          <div className="w-full max-w-2xl mt-10 p-4 border-t">
            <Card className="h-full">
              <CardContent className="h-full">
                {article.content}
              </CardContent>
            </Card>
          </div>
          <CommentSection articleId={article.id!} initialComments={article.comments!} />
        </div>
      ) : (
        <div>
          Could not fetch news item.
        </div>
      )}
    </>
  );
}

export default ArticlePage;