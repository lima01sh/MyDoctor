import React , { useState, useEffect }from 'react'
import { Link,useLocation ,useNavigate} from 'react-router-dom'
import "./registration.css";

import { APi_URL_UAT } from "../../auth/config";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAddressCard,faHospitalUser,faBookMedical,faPills,faFileWaveform } from '@fortawesome/free-solid-svg-icons'

import PatienFormEdit from './patienFormEdit';

const PatientInfo = () => {
    const location = useLocation();
    const { state } = location; 
    const hn_patient_id = state.hn_patient_id; 
 

    useEffect(() => {
     window.scrollTo(0, 0);
    }, []);
 
    
    
  return (
    <div>
        <div className="p-4 mb-5 ">
            <h2 className="text-start display-6 fw-semibold text-titlepage">ข้อมูลผู้ป่วย</h2>
            <nav aria-label="breadcrumb" className="bg-light rounded-2 px-3 p-2">
            <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item"><Link to="/registration" className="breadcrumb-link"><FontAwesomeIcon className="me-1" icon={faAddressCard} />เวชระเบียน</Link></li>
                <li className="breadcrumb-item mb-0 active" aria-current="page"><FontAwesomeIcon className="me-1" icon={faHospitalUser} />ข้อมูลผู้ป่วย</li>
            </ol>
            </nav>
            <div className="mt-5">
                <div className="card">
                    <div className="card-header fs-5 fw-semibold">
                        รหัสผู้ป่วย : {hn_patient_id}
                    </div>
                    <div className="card-body">
                        <div className="row d-flex flex-column-reverse flex-xl-row mb-4">
                            <div className="col-xl-10 pt-3 mt-2">
                                <PatienFormEdit />
                            </div>
                            <div className="col-xl-2 mt-0 mt-xl-4">
                                <div className="d-flex flex-row justify-content-end flex-xl-column justify-content-xl-start">
                                    {/* ผู้ป่วยเข้ารับการรักษา ส่งข้อมูล/ปริ้นคิว */}
                                    <p className="fw-light d-none d-xl-block">ซักประวัติผู้ป่วย</p>
                                    <Link to="/patienhistorytake"  className="btn btn-primary py-2 me-2 me-xl-0 mb-0 mb-xl-2" type="button"
                                        state={{hn_patient_id: hn_patient_id,
                                            thai_prefix: state.thai_prefix,
                                            thai_firstname: state.thai_firstname,
                                            thai_lastname: state.thai_lastname,
                                        }}>
                                        <FontAwesomeIcon className="me-2 fa-lg fa-icon" icon={faFileWaveform} /> ซักประวัติ
                                    </Link>
                                    <hr />
                                    <p className="fw-light d-none d-xl-block">ประวัติผู้ป่วย</p>
                                    <Link to="/treatmenthistory"  className="btn btn-outline-success py-2 me-2 me-xl-0 mb-0 mb-xl-2" type="button"
                                    state={{hn_patient_id: hn_patient_id,
                                            thai_prefix: state.thai_prefix,
                                            thai_firstname: state.thai_firstname,
                                            thai_lastname: state.thai_lastname,
                                        }}>
                                        <FontAwesomeIcon className="me-2 fa-lg fa-icon" icon={faBookMedical} />ประวัติการรักษา
                                    </Link>
                                    <Link to="/listdrugallergies" className="btn btn-outline-danger py-2 me-2 me-xl-0 mb-0 mb-xl-2" type="button"
                                    state={{hn_patient_id: hn_patient_id,
                                            thai_prefix: state.thai_prefix,
                                            thai_firstname: state.thai_firstname,
                                            thai_lastname: state.thai_lastname,
                                        }}>
                                        <FontAwesomeIcon className="me-2 fa-lg fa-icon" icon={faPills} />ประวัติแพ้ยา
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default PatientInfo
