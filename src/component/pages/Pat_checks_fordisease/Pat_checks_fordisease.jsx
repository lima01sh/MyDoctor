
import { useState, useEffect } from "react";
import { APi_URL_UAT,Location } from "../../auth/config";
import { Link, Navigate } from "react-router-dom";
import Swal from 'sweetalert2';

function Pat_checks_fordisease({ handleLogout }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const clinic_id = localStorage.getItem("clinic_id");

  const apiUrl = APi_URL_UAT + "list_queue&clinic_id="+clinic_id;
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>แพทย์ตรวจโรค</h1>
      <table className="table">
        <thead>
          <tr>
            <th>HN</th>
            <th>คิว</th>
            <th>Full Name</th>
            <th>Age</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient,index) => (
            <tr key={index}>
              <td>{patient.hn_patient_id}</td>
              <td>{patient.queue_number}</td>
              <td>
                {patient.thai_firstname} {patient.thai_lastname}
              </td>

              <td>{patient.age}</td>
              <td>
                {patient.status === "กำลังตรวจ" ? (
                  <Link
                    to="/pat_checks_fordisease/create_bal"
                    state={{
                      phone_number: patient.phone_number,
                      thai_firstname: patient.thai_firstname,
                      thai_lastname: patient.thai_lastname,
                      hn_patient_id: patient.hn_patient_id,
                      queue_number: patient.queue_number,
                      history_id: patient.history_id,
                      queue_id: patient.queue_id
                    }}
                    className="btn btn-success btn-sm"
                  >
                    วินิจฉัย
                  </Link>

                ) : (
                  <button onClick={() => handUpdate(patient.queue_id, 'เรียกคิว', patient.queue_number)} className="btn btn-primary btn-sm">
                    เรียกคิว
                  </button>

                )}
                <button onClick={() => handUpdate(patient.queue_id, 'ยกลิก', patient.queue_number)} className="btn btn-outline-danger btn-sm ms-2">
                  ยกเลิกคิว
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Pat_checks_fordisease;
