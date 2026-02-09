import {
    type Article
} from '@/types';
import ReactionButtons from './reaction-button';

const ArticleTile = ({ article }: { article: Article }) => {
  return (
    <div className="group overflow-hidden border rounded-lg shadow-md w-full h-screen flex row gap-2 justify-between items-center bg-white">
      <a className="flex justify-center items-center w-56 h-full" href={`/articles/${article.id}`}>
        <img
            src={article.lead_img} 
            alt="News item main image." 
            className="object-fit object-contain relative h-56 p-2 group-hover:scale-105 transition duration-500"
          />
      </a>
      <div className="p-4">
        <a className="text-lg font-semibold text-gray-700" href={`/articles/${article.id}`}>{article.title}</a>
        <div className="mt-2">
          {article?.tags?.map((tag, index) => (
            <a href={ `/?tag_id=${tag.id}` } key={index} className="inline-block bg-gray-200 text-gray-700 rounded-full px-2 py-1 text-sm mr-2 mb-2">
              {tag.label}
            </a>
          ))}
        </div>
        <div className="mt-2">
          <ReactionButtons articleId={article.id!} initialData={article}/>
        </div>
      </div>
    </div>
  );
};

export default ArticleTile;
