import React, { useState, useEffect } from "react";
import { Link,useLocation, useNavigate } from 'react-router-dom';
import { APi_URL_UAT } from "../../auth/config";
import Medicalrecord from "./Medicalrecord";
import PatienForm from "./PatienForm";
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
            <div className="row d-flex justify-content-end">
              <div className="col-12 col-md-6 col-lg-3 text-end">
                <Link to={URL_Q} target="_black" className="d-grid gap-2 nav-link">
                  <div className="btn btn-outline-primary px-5 py-4">
                    <FontAwesomeIcon icon={faArrowDownShortWide} className="mb-2 fa-2xl"/>
                    <br/>คิวรักษาวันนี้
                  </div>
                </Link>
              </div>
            </div>
            <div className="mt-3">
              {/* ช่องค้นหา */}
              <div className="card p-4">
                <h2 className="text-start text-titlepage">ค้นหาในเวชระเบียน</h2>
                <Medicalrecord />
              </div>
            </div>
            <div className="mt-4">
              {/* ฟอร์มลงทะเบียน */}
              <div className="card p-4">
                <h2 className="text-start mb-5 text-titlepage">ลงทะเบียนผู้ป่วยใหม่</h2>
                <PatienForm />
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Registration;
