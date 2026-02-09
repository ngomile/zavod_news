import {
  getUser,
  logoutUser
} from '@/app/auth/actions';


const Navbar = () => {
  const menus = [
    { title: "News", path: "/" },
    { title: "Browse Tags", path: "/browse_tags" }
  ];

  const user = getUser();
  
  return (
    <nav className="bg-white w-full border-b">
      <div className="flex items-center justify-between px-4 max-w-screen-xl mx-auto py-3 md:flex md:px-8">
        <a href="/">
          <h1>Zavod News</h1>
        </a>
        <ul className="flex items-center flex-row space-x-6 space-y-0">
          {menus.map((item, idx) => (
            <li key={idx} className="text-gray-600 hover:text-slate-400 font-bold">
              <a href={item.path}>{item.title}</a>
            </li>
          ))}
        </ul>
        <div>
          { user ? (
            <div className="flex flex-row gap-2">
              { user.is_staff && (
                <a href="/admin" className="text-gray-600 hover:text-slate-400 font-bold">Admin</a>
              )}
              <button className="text-gray-600 hover:text-slate-400 font-bold" onClick={ logoutUser }>Logout</button>
            </div>
          ) : (
            <a className="text-gray-600 hover:text-slate-400 font-bold" href="/login">Login</a>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;