import { Link, useLocation } from "react-router-dom"; // Import useLocation
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import "./Sidebar.css";

// eslint-disable-next-line react/prop-types
const Sidebar = ({ isOpen, toggleSidebar }) => {
    const location = useLocation(); // Use useLocation to track the current route
    const menus =   JSON.parse(localStorage.getItem("user")); // Get user data from localStorage
    console.log(menus.menus);

  
    return (
      <div className={`d-flex`}>
        {/* Sidebar */}
        <div className={`offcanvas border-0 offcanvas-start ${isOpen ? "show" : ""}`} tabIndex="-1" id="offcanvasSidebar" data-bs-scroll="true" data-bs-backdrop="false" aria-labelledby="offcanvasSidebarLabel">
          <div className="offcanvas-header py-4">
            <button className="btn btn-nav me-3" onClick={toggleSidebar} data-bs-dismiss="offcanvas" aria-label="Close">
              <FontAwesomeIcon className="fa-lg fa-icon" icon={faXmark}  />
            </button>
            <a className="navbar-brand" href="#">
              <img
                src="./loMyC.png"
                height="30"
                alt="Logo"
              />
              <span className="ms-3 fs-5">ระบบจัดการคลีนิก</span>
            </a>
          </div>
          <div className="offcanvas-body">
            <nav className="navbar navbar-light">
              <div className="d-flex align-items-center ms-4 mb-4">
                <div className="position-relative">
                  <img className="rounded-circle" src="https://www.shutterstock.com/image-vector/male-doctor-smiling-happy-face-600nw-2481032615.jpg" alt="User" style={{ width: 40, height: 40 }} />
                  <div className="bg-success rounded-circle border border-2 border-white position-absolute end-0 bottom-0 p-1"></div>
                </div>
                <div className="ms-3">
                  <h6 className="mb-0">{menus.username}</h6>
                  <span>{menus.role}</span>
                </div>
              </div>

              <div className="navbar-nav w-100 px-2 sideNav">
                {/* <Link to="/" className="nav-item nav-link sideNav-item rounded-2 px-3 mb-3 active">
                    <i className="fa-solid fa-house me-3"></i>หน้าหลัก
                </Link> */}
              {menus.menus.map((menu, index) => (
                  <Link key={index} to={`/${menu.menu_name.toLowerCase()}`} className={`nav-item nav-link sideNav-item rounded-2 px-3 mb-3 ${location.pathname === `/${menu.menu_name.toLowerCase()}` ? 'active' : ''}`}>
                    <i className={`${menu.icons.toLowerCase()} me-3`}></i>{menu.details} 
                  </Link>
                ))}
 
              </div>

              {/* Logout Button */}
              {/* <button onClick={handleLogout} className="btn btn-danger w-100 mt-4">Log Out</button> */}
            </nav>
          </div>
        </div>
        
      </div>
    );
  };
  
  export default Sidebar;
  