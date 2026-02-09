import {
  Link
} from 'react-router-dom';

import {
  ArrowRight
} from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white w-full border-b">
      <div className="flex items-center justify-between px-4 max-w-screen-xl mx-auto py-3 md:flex md:px-8">
        <Link to="/">
          <h1>Zavod News</h1>
        </Link>
        <div>
          <a className="text-gray-600 hover:text-slate-400 font-bold flex flex-row gap-2 flex-nowrap" href="/">
            <ArrowRight />
            <span>Browse News</span>
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;