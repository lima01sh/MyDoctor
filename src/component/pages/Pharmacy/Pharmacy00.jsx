import React, { useState, useEffect } from "react";
import { Link,useLocation, useNavigate } from 'react-router-dom';
import { APi_URL_UAT,Location } from "../../auth/config";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPrescription,faFileInvoiceDollar,faCalendarDay,faFileInvoice,faNoteSticky  } from '@fortawesome/free-solid-svg-icons';
import "./pharmacy.css"
import Swal from "sweetalert2";

const Pharmacy00 = () => {
  const location = useLocation();
  const { state } = location; 

  const [patients, setPatients] = useState([]);
  const [hnPatientId, setHnPatientId] = useState("");
  const [date, setDate] = useState("");

  const apiKey = localStorage.getItem("token"); // ใส่ API Key ที่นี่
  const clinic_id = localStorage.getItem("clinic_id"); // ใส่ API Key ที่นี่

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  function refreshPage() {
    window.location.reload(false);
  }
  const handleLogout = () => {
    localStorage.clear(); // Clear data from localStorage
    window.location.href = Location; // Redirect to the main page
  };

  const maxtoday = new Date().toISOString().split('T')[0];
  const apiUrl = `${APi_URL_UAT}today_patient&hn_patient_id=${hnPatientId}&date=${date}&clinic_id=${clinic_id}`; // ใส่ API Key ที่นี่

  const fetchPatients = () => {
    if (!hnPatientId || !date) {
      Swal.fire({
        title: "Error!",
        text:
            "กรุณากรอกหมายเลข HN และวันที่ก่อนค้นหา",
        icon: "error",
        confirmButtonText: "OK",
        });
    }

    const myHeaders = new Headers();
    myHeaders.append("X-API-KEY", apiKey);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then((data) => {
       console.log(data)
        if(data["success"]===true){
          setPatients(data.data)
          setHnPatientId('')
          setDate('')
        }else{
          if(data.status === "error") {
            Swal.fire({
              icon: 'error',
              title: 'Token! หมดอายุ',
              text: 'กรุณาเข้าสู่ระบบใหม่',
              confirmButtonText: 'ออกจากระบบ'
            }).then(() => {
              handleLogout()
            });
            console.error("Unauthorized: กรุณาตรวจสอบ API Key หรือการเข้าสู่ระบบ");
          }else{
            setPatients([])
            Swal.fire({
            title: "Error!",
            text:
                "ไม่พบข้อมูล",
            icon: "error",
            confirmButtonText: "OK",
            }).then((result) => {
              if (result.isConfirmed) {
                setPatients()
              }
            });
          }
          
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  };
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    if (!hnPatientId || !date) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [hnPatientId, date]);

  return (
    <div>
      <div className="p-4 mb-5 ">
        <h2 className="text-start display-6 fw-semibold text-titlepage">เภสัชกรรม</h2>
        <nav aria-label="breadcrumb" className="bg-light rounded-2 px-3 p-2">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item mb-0 active" aria-current="page"><FontAwesomeIcon className="me-1" icon={faPrescription} />เภสัชกรรม</li>
          </ol>
        </nav>
        <div className="mt-3">
            <div className="mt-3">
              {/* ช่องค้นหา */}
              <div className="card p-4">
                <h2 className="text-start text-titlepage">ค้นหาในรายชื่อผู้ป่วยวันนี้</h2>
                <div className="row mb-4 mt-3">
                  <div className="col-md-4 mb-1 ">
                    <input
                      type="text"
                      placeholder="หมายเลข HN"
                      value={hnPatientId}
                      onChange={(e) => setHnPatientId(e.target.value)}
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-4 mb-1 ">
                    <input
                      type="date"
                      value={date}
                      max={maxtoday}
                      onChange={(e) => setDate(e.target.value)}
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-4 mb-1 ">
                    <button onClick={fetchPatients} disabled={isDisabled} className="btn btn-primary w-100">
                      ค้นหา
                    </button>
                  </div>
                </div>
                {/* info */}
                <div className="">
                  {/* <h2 className="text-center mb-4">รายชื่อผู้ป่วยวันนี้</h2> */}
                  <div className="row mt-4"> 
                    {patients&&
                    patients.map((patient) => (
                      <div key={patient.queue_id}>
                        <div  className="card">
                          <div className="card-body">
                            <div className="text-end my-1 d-none d-md-block">
                            <Link to={"/pharmacyInfo"} 
                              state={{
                                queue_id: patient.queue_id,
                                hn_patient_id: patient.hn_patient_id
                              }}
                              className="btn btn-primary px-4 py-3"> 
                                <FontAwesomeIcon className="me-2" icon={faFileInvoiceDollar} />ข้อมูลการรักษา
                              </Link>
                            </div>
                            <div className="row d-flex justify-conten-between">
                              <div className="col-md-6 col-lg-4">
                                <div className="img-card mt-5 ">
                                  <img src={patient.profile_image} alt="Profile"/>
                                </div>
                              </div>
                              <div className="col-md-6 col-lg-8">
                                <p className="card-title mt-4 h5">{patient.thai_prefix} {patient.thai_firstname} {patient.thai_lastname}</p>
                                <p className="mb-0">หมายเลข HN: {patient.hn_patient_id}</p>
                                <p className="mb-0">หมายเลขคิว: {patient.queue_number}</p>
                                <p className="">สถานะ: {patient.status}</p>
                                <p className="mb-0">เบอร์โทร: {patient.phone_number}</p>
                                <p className="mb-0">อายุ: {patient.age}</p>
                                <p className="mb-0">เพศ: {patient.gender_th}</p>
                                <p className="mb-0">กรุ๊ปเลือด: {patient.blood_type}</p>
                                <p className="">ที่อยู่: {patient.contact_address}</p>
                                <p className="mb-0">
                                  วันที่เข้ารักษา: {new Date(patient.appointment_time).toLocaleDateString("th-TH", {
                                  day: "2-digit",month: "2-digit",year: "numeric",})}
                                </p>
                                <p className="mb-0">เวลา: {patient.time}</p>
                                <div className="text-center my-3 d-block d-md-none d-grid gap-2">
                                  <Link to={"/pharmacyInfo"} 
                                  state={{
                                    queue_id: patient.queue_id,
                                    hn_patient_id: patient.hn_patient_id
                                  }}
                                  className="btn btn-primary px-4"> 
                                    <FontAwesomeIcon className="me-1" icon={faFileInvoiceDollar} />ข้อมูลการรักษา
                                  </Link>
                                </div>
                                  {/* {patient.status==="ทำรายการเสร็จสิ้น"?
                                    setDisable('disabled')
                                  :""
                                  } */}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
             
                  </div>
                </div>
              </div>
              
            </div>
        </div>
      </div>
    </div>
  )
}

export default Pharmacy00
