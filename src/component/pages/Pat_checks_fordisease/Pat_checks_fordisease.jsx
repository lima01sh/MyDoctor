
import { useState, useEffect } from "react";
import { APi_URL_UAT, Location } from "../../auth/config";
import { Link, Navigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPills,           // ไอคอนหลักสำหรับเภสัชกรรม
  faPrescriptionBottle,
  faClipboardList,   // สำหรับรายการคิว
  faUserClock        // สำหรับการรอคิว
} from '@fortawesome/free-solid-svg-icons';
function Pat_checks_fordisease({ handleLogout }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const clinic_id = localStorage.getItem("clinic_id");

  const apiUrl = APi_URL_UAT + "list_queue&clinic_id=" + clinic_id;
  const apiKey = localStorage.getItem("token"); // ใส่ API Key ที่นี่
  useEffect(() => {
    fetchPatients();
    // localStorage.clear(); // Clear data from localStorage
    // window.location.href = '/'; // Redirect to the main page

  }, []);

  const fetchPatients = async () => {
    try {
      const myHeaders = new Headers({
        "X-API-KEY": apiKey,
        "Content-Type": "application/json" // เพิ่ม Content-Type
      });

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
      };

      const response = await fetch(apiUrl, requestOptions);
      console.log("Status Code:", response.status); // ตรวจสอบสถานะการตอบกลับ

      const handleLogout = () => {
        localStorage.clear(); // Clear data from localStorage
        window.location.href = Location; // Redirect to the main page
      };


      if (!response.ok) {
        if (response.status === 401) {
          Swal.fire({
            icon: 'error',
            title: 'Token! หมดอายุ',
            text: 'กรุณาเข้าสู่ระบบใหม่',
            confirmButtonText: 'ออกจากระบบ'
          }).then(() => {
            handleLogout()
          });
          console.error("Unauthorized: กรุณาตรวจสอบ API Key หรือการเข้าสู่ระบบ");
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("API Result:", result); // แสดงผลลัพธ์จาก API
      setPatients(result.data || []);
    } catch (error) {
      console.error("Error:", error.message);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handUpdate = async (id, t, q) => {
    const myHeaders = new Headers();
    myHeaders.append("X-API-KEY", apiKey);
    const formdata = new FormData();
    formdata.append("queue_id", id);
    formdata.append("status", t);
    formdata.append("queue", q);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow"
    };

    fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result['success'] === true) {
          alert(t + q);
          fetchPatients();
        } else {
          fetchPatients();
          console.log("result:", result);
        }
      })
      .catch((error) => console.error(error));
  }

  // if (loading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div className="p-4 mb-5 ">
        <h2 className="text-start display-6 fw-semibold text-titlepage">แพทย์ตรวจโรค</h2>
        <nav aria-label="breadcrumb" className="bg-light rounded-2 px-3 p-2 mb-3">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item mb-0 active" aria-current="page"><FontAwesomeIcon className="me-1" icon={faClipboardList} />แพทย์ตรวจโรค</li>
          </ol>
        </nav>
        <div className="table-responsive  ">
          <table className="table table-bordered table-hover">
            <thead className="table-primary table-style text-center">
              <tr>
                <th>HN</th>
                <th>คิว</th>
                <th>Full Name</th>
                <th>Age</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id}>
                  <td className="text-center">{patient.hn_patient_id}</td>
                  <td className="text-center">{patient.queue_number}</td>
                  <td>
                    {patient.thai_firstname} {patient.thai_lastname}
                  </td>
                  <td>{patient.age}</td>
                  <td>
                    <div className="d-flex gap-2 justify-content-center flex-wrap">
                      <div className="dropdown">
                        <button
                          className="btn btn-success btn-sm dropdown-toggle"
                          type="button"
                          id={`diagnoseDropdown${patient.queue_id}`}
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          วินิจฉัย
                        </button>
                        <ul
                          className="dropdown-menu"
                          aria-labelledby={`diagnoseDropdown${patient.queue_id}`}
                        >
                          <li>
                            <Link
                              className="dropdown-item"
                              to="/pat_checks_fordisease/create_ball"
                              state={{
                                ...patient,
                                history_id: patient.history_id,
                                queue_id: patient.queue_id
                              }}
                            >
                              หน้าจอวินิจฉัยรูปแบบที่ 1
                            </Link>
                          </li>
                          <li>
                            <Link
                              className="dropdown-item"
                              to="/pat_checks_fordisease/create_Beam"
                              state={{
                                ...patient,
                                history_id: patient.history_id,
                                queue_id: patient.queue_id
                              }}
                            >
                              หน้าจอวินิจฉัยรูปแบบที่ 2

                            </Link>
                          </li>
                          <li>
                            <Link
                              className="dropdown-item"
                              to="/pat_checks_fordisease/create_admin3"
                              state={{
                                ...patient,
                                history_id: patient.history_id,
                                queue_id: patient.queue_id
                              }}
                            >
                              หน้าจอวินิจฉัยรูปแบบที่ 3

                            </Link>
                          </li>
                        </ul>
                      </div>

                      <button
                        onClick={() =>
                          handUpdate(patient.queue_id, "ยกลิก", patient.queue_number)
                        }
                        className="btn btn-outline-danger btn-sm ms-2"
                      >
                        ยกเลิกคิว
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Pat_checks_fordisease;
