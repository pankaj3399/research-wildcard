import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import Signup from './Pages/Register/Signup'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './Pages/Login/Login'
import Dashboard from './Pages/Dashboard/Dashboard'
import Sidebar from './Components/Sidebar'
import OneProject from './Pages/Projects/OneProject'
import TitleAbstract from './Pages/Projects/TitleAbstract';
import FullText from './Pages/Projects/FullText';
import Footer from './Components/Footer'
import PDFViewer from './Pages/Projects/PDFViewer';
import Export from './Pages/Export/Export'
import FullTextReview from './Pages/Projects/FullTextReview';
import ProfilePage from './Pages/Profile/ProfilePage';





function App() {
  return (
    <div>
      <BrowserRouter>
        <div className="AppContainer">
          <Routes>
          <Route path='/register' element={<Signup />} />
          <Route path='/login' element={<Login />} />
          <Route path='/dashboard' element={<><Sidebar /><Dashboard /></>} />
          <Route path='/oneproject/:projectId' element={<><Sidebar/><OneProject /></>} />
          <Route path='/extraction' element={<><Sidebar/><PDFViewer /></>} />
          <Route path='/titleabstract' element={<><Sidebar/><TitleAbstract /></>} />
          <Route path='/prisma' element={<><Sidebar /></>} />
          <Route path='/profile' element={<><Sidebar/><ProfilePage /></>} />
          <Route path='/settings' element={<><Sidebar/></>} />
          <Route path='/titleabstract/:projectId' element={<><Sidebar/><TitleAbstract /></>} />
          <Route path='/fulltext/:projectId' element={<><FullText /></>} />



          {/* <Route path="/oneproject/:projectId" component={OneProject} /> */}
          </Routes>
        </div>
          

        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
