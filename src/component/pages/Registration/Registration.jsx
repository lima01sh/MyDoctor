import React, { useState, useEffect } from "react";
import { Link,useLocation, useNavigate } from 'react-router-dom';
import { APi_URL_UAT } from "../../auth/config";
import Medicalrecord from "./Medicalrecord";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHospitalUser,faAddressCard,faPhone,faIdCard,faArrowDownShortWide } from '@fortawesome/free-solid-svg-icons';
import profileDef from"../../img/ProfileDef.png";
import { differenceInYears,differenceInMonths } from "date-fns";

import Swal from "sweetalert2";

const Registration = () => {
  const clinic_id = localStorage.getItem("clinic_id");
  const user =  JSON.parse(localStorage.getItem("user")); // Get user data from localStorage
  const clinic_name =   user.data_clinic[0].clinic_name; // Get user data from localStorage
  const URL_Q = "https://www.addpay.co.th/service-ui/service-my-clinic/service-my-monitor/?clinic_id="+clinic_id+"&clinic_name="+clinic_name;
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div>
      <div className="p-4 mb-5 ">
        <h2 className="text-start display-6 fw-semibold text-titlepage"> เวชระเบียน</h2>
        <nav aria-label="breadcrumb" className="bg-light rounded-2 px-3 p-2">
          <ol className="breadcrumb mb-0">
            {/* <li className="breadcrumb-item"><a href="#">Home</a></li>
            <li className="breadcrumb-item"><a href="#">Library</a></li> */}
            <li className="breadcrumb-item mb-0 active" aria-current="page"><FontAwesomeIcon className="me-1" icon={faAddressCard} />เวชระเบียน</li>
          </ol>
        </nav>
        <div className="mt-3">
          <div className="">
            <div className="d-flex flex-column flex-md-row justify-content-end">
                <Link to={URL_Q} target="_black" className="btn btn-outline-primary px-5 py-3">
                    <FontAwesomeIcon icon={faArrowDownShortWide} className="mb-2 fa-2xl"/>
                    <br/>คิวรักษาวันนี้
                </Link>
            </div>
            <div className="mt-3">
              {/* ช่องค้นหา */}
              <div className="card p-4">
                <div className="d-flex flex-column flex-md-row justify-content-between">
                <h2 className="">รายชื่อในเวชระเบียน</h2>
                <Link to={"/patienform"} className="ms-3 btn btn-outline-success py-3">
                    <FontAwesomeIcon icon={faHospitalUser} className="mb-2 fa-xl"/>
                    <br/><span className="fs-6 fw-light">ลงทะเบียนผู้ป่วยใหม่</span>
                </Link>
                </div>
                <Medicalrecord />
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Registration;
