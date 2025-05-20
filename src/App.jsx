import { Routes, Route } from "react-router-dom";
import Login from "./component/login/Login";
// import Uipost from "./component/pages/home/Uipost";
// import Uiget from "./component/pages/home/Uiget";
import Home from "./component/pages/home/home";
import NotFound from "./component/NotFound";
import {Location} from "./component/auth/config"
import Registration from "./component/pages/Registration/Registration";
import PatientInfo from "./component/pages/Registration/PatientInfo";
import PatienHistoryTake from "./component/pages/Registration/PatienHistoryTake";

import Setting from "./component/pages/setting/Setting";
import PermissionInfo from "./component/pages/setting/PermissionInfo";

import Medicine_warehouse from "./component/pages/Medicine_warehouse/Medicine_warehouse";
import Withdraw_history from "./component/pages/Medicine_warehouse/Withdraw_history";

import MedicalTech from "./component/pages/MedecalTech/MedecalTech";
import LabInternal from "./component/pages/MedecalTech/LabInternal";
import LabExternal from "./component/pages/MedecalTech/LabExternal";
import Pat_checks_fordisease from "./component/pages/Pat_checks_fordisease/Pat_checks_fordisease";
import Pat_checks_fordisease_create from "./component/pages/Pat_checks_fordisease/Pat_checks_fordisease_create"

import Listdrugallergies from "./component/pages/Registration/Listdrugallergies";
import Treatmenthistory from "./component/pages/Registration/Treatmenthistory";
import TreatmenthistoryInfo from "./component/pages/Registration/TreatmenthistoryInfo";
import Medicalrecord from "./component/pages/Registration/Medicalrecord";
import Pharmacy from "./component/pages/Pharmacy/Pharmacy";
import ReportClinic from "./component/pages/ReportClinic/ReportClinic";
import { useState } from "react";
import Sidebar from './component/layout/Sidebar';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars,faSliders,faCartShopping,faBell } from '@fortawesome/free-solid-svg-icons'

import "./App.css";



// eslint-disable-next-line react/prop-types
const Layout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    localStorage.clear(); // Clear data from localStorage
    window.location.href = Location; // Redirect to the main page
  };
 

  return (
    <div className="d-flex bg-main" style={{ height: "100vh" }}>
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar}  />

      {/* Main Content */}
      <main
        className={`flex-grow-1  ${isSidebarOpen ? "sidebar-open content" : "sidebar-closed"}`}
        style={{
          transition: "margin-left 0.3s ease",
        }}
      >
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg fixed-top navbar-white bg-white py-3">
          <div className="container-fluid pe-md-4">
            <button className={`btn btn-nav me-3 ${isSidebarOpen ? "d-none" : "d-block"}`} onClick={toggleSidebar} >
              <FontAwesomeIcon className="fa-lg fa-icon" icon={faBars}  />
            </button>
            <a className={`navbar-brand ${isSidebarOpen ? "d-none" : "d-block"}`} href="#">
              <img
                src="./loMyC.png"
                height="30"
                alt="Logo"
              />
              <span className="ms-3">ระบบจัดการคลีนิก</span>
            </a>
            

            {/* Menu items */}
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
      
            </div>

            {/* Right icons */}
            <div className="d-flex align-items-center">
              {/* User Avatar */}
              <div className="dropdown">
                <a
                  className="dropdown-toggle d-flex align-items-center hidden-arrow p-2 rounded-pill btn"
                  href="#"
                  id="userDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src="https://www.shutterstock.com/image-vector/male-doctor-smiling-happy-face-600nw-2481032615.jpg"
                    className="rounded-circle"
                    height="32"
                    alt="User Avatar"
                  />
                  <FontAwesomeIcon className="fa-icon ms-3 fa-lg me-1" icon={faSliders}  />
                </a>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                  {/* <li><h6 className="dropdown-header">Profile</h6></li>
                  <li><a className="dropdown-item" href="#">My profile</a></li>
                  <li><a className="dropdown-item" href="#">Account Settings</a></li>
                  <li><hr className="dropdown-divider"/></li> */}
                  <li><a className="dropdown-item" href="#"  onClick={handleLogout}>Logout</a></li>
                </ul>
              </div>
            </div>
          </div>
        </nav>
        

        {/* Content */}
        <div className="bg-main mt-5 px-4 pt-2">
          <div className="card rounded-4 border-0 p-3 mt-5">{children}</div>
        </div>
       
      </main>
    </div>
  );
};

const handleLogout = () => {
  localStorage.clear(); // Clear data from localStorage
  window.location.href = Location; // Redirect to the main page
};


function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <Routes>
      {/* Login Route Without Layout */}
      <Route path="/" element={<Login />} />

      {/* Routes With Layout */}
      <Route
        path="/home"
        element={
          <Layout isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}>
            <Home />
          </Layout>
        }
      />
      <Route
        path="/setting"
        element={
          <Layout isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}>
            <Setting />
          </Layout>
        }
      />
      <Route
        path="/permissioninfo"
        element={
          <Layout isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}>
            <PermissionInfo />
          </Layout>
        }
      />
      <Route
        path="/Medicalrecord"
        element={
          <Layout isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}>
            <Medicalrecord />
          </Layout>
        }
      />
      
      <Route
        path="/registration"
        element={
          <Layout isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}>
            <Registration />
          </Layout>
        }
      />
      <Route
        path="/patientinfo"
        element={
          <Layout isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}>
            <PatientInfo />
          </Layout>
        }
      />
      <Route
        path="/patienhistorytake"
        element={
          <Layout isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}>
            <PatienHistoryTake />
          </Layout>
        }
      />
      <Route
        path="/listdrugallergies"
        element={
          <Layout isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}>
            <Listdrugallergies />
          </Layout>
        }
      />
      <Route
        path="/treatmenthistory"
        element={
          <Layout isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}>
            <Treatmenthistory />
          </Layout>
        }
      />
      <Route
        path="/treatmenthistoryinfo"
        element={
          <Layout isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}>
            <TreatmenthistoryInfo />
          </Layout>
        }
      />
      <Route
        path="/pat_checks_fordisease"
        element={
          <Layout isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}>
            <Pat_checks_fordisease />
          </Layout>
        }
      />
          <Route
        path="/pat_checks_fordisease"
        element={
          <Layout isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} >
            <Pat_checks_fordisease handleLogout={handleLogout} />
          </Layout>
        }
      />
      <Route
        path="/pat_checks_fordisease/create"
        element={
          <Layout isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}>
            <Pat_checks_fordisease_create handleLogout={handleLogout} />
          </Layout>
        }
      />
      <Route
        path="/medicaltech"
        element={
          <Layout isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}>
            <MedicalTech />
          </Layout>
        }
      />
      <Route
        path="/labInternal"
        element={
          <Layout isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}>
            <LabInternal />
          </Layout>
        }
      />
      <Route
        path="/labExternal"
        element={
          <Layout isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}>
            <LabExternal />
          </Layout>
        }
      />
      <Route
        path="/pharmacy"
        element={
          <Layout isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}>
            <Pharmacy />
          </Layout>
        }
      />
      <Route
        path="/reportclinic"
        element={
          <Layout isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}>
            <ReportClinic />
          </Layout>
        }
      />
      <Route
        path="/medicine_warehouse"
        element={
          <Layout isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}>
            <Medicine_warehouse />
          </Layout>
        }
      />
      <Route
        path="/withdraw_history"
        element={
          <Layout isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}>
            <Withdraw_history />
          </Layout>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

