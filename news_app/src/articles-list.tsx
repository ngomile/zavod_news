import {
  useState,
  useEffect,
  useRef,
  type RefObject
} from 'react';

import {
  type Article,
  type Tag,
} from '@/types';

import ArticleTile from '@/components/tiles';

import {
  fetchArticlesByPage,
  fetchTag
} from '@/app/actions';


const useIsBottomVisible = (ref: RefObject<HTMLDivElement | null>) => {
  const [isBottomVisible, setIsBottomVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // isIntersecting is true when the element enters the screen
        setIsBottomVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }, // Trigger when 10% of the element is visible
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [ref]);

  return isBottomVisible;
}

const ArticlesInfiniteScroller = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [tag, setTag] = useState<Tag>();

  // Use null as a signal that there are no more pages
  const nextPage = useRef<number | null>(1);
  const fetchingRef = useRef<boolean>(false);

  // This ref will point to a small div at the very bottom of the list
  const bottomRef = useRef<HTMLDivElement>(null);
  const isBottomVisible = useIsBottomVisible(bottomRef);

  // Fetch tag info on mount
  useEffect(() => {
    const tagId = new URLSearchParams(window.location.search).get('tag_id');
    if (tagId) {
      fetchTag(parseInt(tagId)).then(data => setTag(data));
    }
  }, []);

  // Trigger fetch when bottom becomes visible
  useEffect(() => {
    // DON'T fetch if: already fetching, OR no next page exists
    if (isBottomVisible && !fetchingRef.current && nextPage.current !== null) {
      fetchingRef.current = true;

      const tagId = new URLSearchParams(window.location.search).get('tag_id');
 
      fetchArticlesByPage(nextPage.current, tagId)
        .then(data => {
          setArticles(prev => [...prev, ...data[0]]);
          
          nextPage.current = data[1] || null; 
        })
        .finally(() => {
          fetchingRef.current = false;
        });
    }
  }, [isBottomVisible]);

  return (
    <div className="grid grid-cols-12 gap-2 p-2 w-full mx-auto">
      {tag && (
        <div className="col-span-12 text-center p-4">
          <span className="inline-block bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-sm">
            {tag.label}
          </span>
          <div className="mt-2">
            <a href="/" className="text-gray-400 underline text-sm">Clear Filter</a>
          </div>
        </div>
      )}

      {articles.map((article, index) => (
        <div key={`${article.id}-${index}`} className="col-span-4">
          <ArticleTile article={article} />
        </div>
      ))}

      {/* THE SENTINEL: This invisible div triggers the next fetch */}
      <div 
        ref={bottomRef} 
        className="col-span-12 h-10 flex justify-center items-center"
      >
        {fetchingRef.current && <p className="text-gray-400">Loading more news...</p>}
        {!nextPage.current && articles.length > 0 && (
          <p className="text-gray-400">You've reached the end.</p>
        )}
      </div>
    </div>
  );
};

export default ArticlesInfiniteScroller;
