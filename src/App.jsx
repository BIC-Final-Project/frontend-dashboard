import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { lazy } from 'react';
import { Suspense } from 'react';

const Home = lazy(() => import('./moduls/operational/pages/Home'));
const About = lazy(() => import('./moduls/operational/pages/About'));

const App = () => {

  return (
    <Router>
      <main className="App">
        <Suspense>
          <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/about" element={<About />}/>
          </Routes>
          <footer>Footer</footer>
        </Suspense>
      </main>
    </Router>
  )
}

export default App
