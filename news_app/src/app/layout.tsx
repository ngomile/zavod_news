import {
  Outlet
} from 'react-router-dom';

import Navbar from './navbar';

const Layout = () => {
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