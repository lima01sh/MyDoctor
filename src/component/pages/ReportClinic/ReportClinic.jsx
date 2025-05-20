import React, { useState, useEffect } from "react";
import { Link,useLocation, useNavigate } from 'react-router-dom';
import { APi_URL_UAT,APi_URL_UPLOAD,Location } from "../../auth/config";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouseCircleExclamation,faEllipsis,faMagnifyingGlass,faUserMinus,faListUl } from '@fortawesome/free-solid-svg-icons';
import Swal from "sweetalert2";

import ReportIncome from "./ReportIncome";
import ReportDiseases from "./ReportDiseases";

import "./report.css";


const ReportClinic = () => {
  
  return (
    <div>
      <div className="p-4 mb-5 ">
        <h2 className="text-start display-6 fw-semibold text-titlepage">รายงานในระบบ</h2>
        <nav aria-label="breadcrumb" className="bg-light rounded-2 px-3 p-2">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item mb-0 active" aria-current="page"><FontAwesomeIcon className="me-1" icon={faHouseCircleExclamation} />รายงานในระบบ</li>
          </ol>
        </nav>
        <div className="mt-5">
          <ul className="nav nav-underline nav-fill mb-3" id="pills-tab" role="tablist">
            <li className="nav-item" role="presentation">
              <button className="nav-link py-2 active" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#income" type="button" role="tab" aria-controls="income" aria-selected="true">
                รายงานรายได้
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button className="nav-link py-2" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#diseases" type="button" role="tab" aria-controls="diseases" aria-selected="false">
                รายงานโรคที่พบบ่อย
              </button>
            </li>
          </ul>
          <div className="tab-content" id="pills-tabContent">
            <div className="tab-pane fade show active mt-5" id="income" role="tabpanel" aria-labelledby="income-tab">
              <ReportIncome />
            </div>
            <div className="tab-pane fade" id="diseases" role="tabpanel" aria-labelledby="diseases-tab">
              <ReportDiseases />
            </div>
          </div>
        </div>
      </div>
    </div>
    
  );
}
export default ReportClinic