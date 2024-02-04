import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Signup from "./Pages/Register/Signup";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login/Login";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Sidebar from "./Components/Sidebar";
import OneProject from "./Pages/Projects/OneProject";
import Footer from "./Components/Footer";
import PDFViewer from "./Pages/Projects/PDFViewer";
import Export from "./Pages/Export/Export";
import { ParseDataPage } from "./Pages/ParseData";

function App() {
  return (
    <div>
      <BrowserRouter>
        <div className="AppContainer">
          <Routes>
            <Route path="/register" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/parse" element={<ParseDataPage />} />
            <Route
              path="/dashboard"
              element={
                <>
                  <Sidebar />
                  <Dashboard />
                </>
              }
            />
            <Route
              path="/oneproject"
              element={
                <>
                  <Sidebar />
                  <OneProject />
                </>
              }
            />
            <Route
              path="/fulltext"
              element={
                <>
                  <Sidebar />
                  <PDFViewer />
                </>
              }
            />

            <Route
              path="/prisma"
              element={
                <>
                  <Sidebar />
                </>
              }
            />
            <Route
              path="/settings"
              element={
                <>
                  <Sidebar />
                </>
              }
            />
            <Route
              path="/export"
              element={
                <>
                  <Sidebar />
                  <Export />
                </>
              }
            />

            {/* <Route path="/oneproject/:projectId" component={OneProject} /> */}
          </Routes>
        </div>

        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
