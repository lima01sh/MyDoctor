import React, { useState, useEffect } from "react";
import { Link,useLocation, useNavigate } from 'react-router-dom';
import { APi_URL_UAT } from "../../auth/config";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStethoscope,faHouseMedical,faTruckMedical,faFileInvoice,faNoteSticky  } from '@fortawesome/free-solid-svg-icons';
import './medecalTech.css'
import Swal from "sweetalert2";

const  MedicalTech = () => {
  return (
    <div>
      <div className="p-4 mb-5 ">
        <h2 className="text-start display-6 fw-semibold text-titlepage">เทคนิคการแพทย์</h2>
        <nav aria-label="breadcrumb" className="bg-light rounded-2 px-3 p-2">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item mb-0 active" aria-current="page"><FontAwesomeIcon className="me-1" icon={faStethoscope} />เทคนิคการแพทย์</li>
          </ol>
        </nav>
        <div className="mt-5">
            <div className="mt-5">
              <div className="d-flex flex-column flex-sm-row justify-content-evenly">
                <Link to="/LabInternal" className="card nav-link card-btn py-4 px-5 mb-4 mb-md-0">
                  <FontAwesomeIcon icon={faHouseMedical} className="fs-1"/>
                  <p className="text-titlepage fs-4 mb-0 mt-3">Lab ภายใน</p>
                </Link>
                <Link to="/LabExternal" className="card nav-link card-btn py-4 px-5 mb-4 mb-md-0">
                  <FontAwesomeIcon icon={faTruckMedical} className="fs-1"/>
                  <p className="text-titlepage fs-4 mb-0 mt-3">Lab ภายนอก</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default MedicalTech
