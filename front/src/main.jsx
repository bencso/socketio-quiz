import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Join from './pages/Join.jsx';
import Create from './pages/Create.jsx';

const root = document.getElementById('root');
ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path='/create/:quizID' element={<Create />} />
      <Route path='/join/:roomID' element={<Join />} />
    </Routes>
  </BrowserRouter>
);