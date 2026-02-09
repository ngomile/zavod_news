import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

import Login from '@/app/auth/login/page';
import Register from '@/app/auth/register/page';

import AppLayout from '@/app/layout';
import Index from '@/app/index';
import BrowseTags from '@/app/news_by_tags/page';
import ArticlePage from '@/app/news/page';

import AdminLayout from '@/admin/layout';
import AdminIndex from '@/admin/index';

import NewsItemsIndex from '@/admin/articles/index';
import ArticleDetail from '@/admin/articles/detail';
import CreateArticleForm from '@/admin/articles/create';

import AuthLayout from '@/app/auth/layout';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={ <AdminLayout />}>
          <Route index element={ <AdminIndex /> } />
          <Route path="articles">
            <Route index element={ <NewsItemsIndex /> } />
            <Route path=":id" element={ <ArticleDetail /> } />
            <Route path="create" element={ <CreateArticleForm /> } />
          </Route>
        </Route>
        <Route path="/" element={ <AppLayout /> }>
          <Route index element={ <Index /> } />
          <Route path="/browse_tags" element={ <BrowseTags /> } />
          <Route path="/articles/:id" element={ <ArticlePage /> }/>
        </Route>
        <Route path="/" element={ <AuthLayout /> }>
          <Route path="/login" element={ <Login />} />
          <Route path="/register" element={ <Register />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;