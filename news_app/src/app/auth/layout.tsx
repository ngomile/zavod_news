import {
  Outlet
} from 'react-router-dom';

import {
  getUser
} from '@/app/auth/actions';

import Navbar from './navbar';

const Layout = () => {
  const user = getUser();

  // Kind of like middleware but not really :).
  if (user) {
    window.location.assign('/');
  }

  return (
      <>
          <header>
              <Navbar />
          </header>
          <main className="bg-gray-100">
              <Outlet />
          </main>
      </>
  );
}

export default Layout;