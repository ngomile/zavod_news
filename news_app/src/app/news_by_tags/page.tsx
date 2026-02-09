import {
  useState,
  useEffect,
} from 'react';

import {
    fetchTags
} from '@/app/actions';

import {
  type Tag
} from '@/types';

export default function Page() {
  const [tags, setTags] = useState<Tag[]>([]);
  
  useEffect(() => {
    fetchTags().then((newTagsList: Tag[]) => {
      setTags(newTagsList);
    });
  }, []);

  return (
    <div className="grid grid-cols-12 gap-2 p-2 min-h-screen">
      <header className="col-span-12">
        <h2 className="w-full my-2 text-center h-2 font-bold">Browse by Tag</h2>
      </header>
      { tags.map(tag => (
        <a className="col-span-3 group flex flex-col items-center gap-2 my-2 overflow-hidden" key="index" href={ `/?tag_id=${tag.id}` }>
          <img className="group-hover:scale-105 group-hover:object-cover transition delay-75 duration-500" src={tag.image} alt={tag.label}/>
          <span key={tag.id} className="inline-block bg-gray-200 text-gray-700 rounded-full px-2 py-1 text-sm mr-2 mb-2">
          {tag.label}
          </span>
        </a>
      ))}      
    </div>
  );
}
