import React , { useState, useEffect }from 'react'
import { Link,useLocation ,useNavigate} from 'react-router-dom'
import "./registration.css";

import { APi_URL_UAT } from "../../auth/config";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHospitalUser,faPhone,faIdCard} from '@fortawesome/free-solid-svg-icons'
import profileDef from"../../img/ProfileDef.png";

import { differenceInYears,differenceInMonths } from "date-fns";

import Swal from "sweetalert2";

function PatienFormEdit({ userId }) {
  const location = useLocation();
  const { state } = location; 

  const clinic_id = localStorage.getItem('clinic_id');
  const hn_patient_id = state.hn_patient_id;

  const apiKey = localStorage.getItem("token"); // ใส่ API Key ที่นี่

  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: ''
  });

  const [loading, setLoading] = useState(true);
  const apiUrl = `${APi_URL_UAT}personal_information&hn_patient_id=${hn_patient_id}&clinic_id=${clinic_id}`;
  // 1. โหลดข้อมูลจาก API
  const personalInformation = (hn_patient_id,clinic_id) => {
    const myHeaders = new Headers();
    myHeaders.append("X-API-KEY", apiKey);

    const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
    };

    fetch(`${APi_URL_UAT}personal_information&hn_patient_id=${hn_patient_id}&clinic_id=${clinic_id}`,requestOptions)
    .then((response) => response.json())
    .then((data) => {
        if (data.success) {
            // console.log(data.data.patients[0])
            // setData(data.data.patients[0]);
            setFormData({
              thai_prefix:data.data.patients[0].thai_prefix || '',
              thai_firstname: data.data.patients[0].thai_firstname || '',
              thai_lastname: data.data.patients[0].thai_lastname || '',
            });
            setLoading(false);
        }
        
    })
    .catch((err) => {
      console.error('Error fetching user data:', err);
      setLoading(false);
    });
  };
  useEffect(() => {
      personalInformation(hn_patient_id,clinic_id);
  }, [hn_patient_id,clinic_id]);

  // useEffect(() => {
  //   fetch(`https://api.example.com/users/${userId}`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setFormData({
  //         firstname: data.firstname || '',
  //         lastname: data.lastname || '',
  //         email: data.email || ''
  //       });
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       console.error('Error fetching user data:', err);
  //       setLoading(false);
  //     });
  // }, [userId]);

  // 2. handle change ฟอร์ม
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // 3. ส่งข้อมูลทั้งหมด (รวมของเดิมที่ไม่ถูกแก้)
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`https://api.example.com/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then((res) => {
        if (res.ok) {
          alert('บันทึกข้อมูลสำเร็จ');
        } else {
          alert('เกิดข้อผิดพลาด');
        }
      })
      .catch((err) => console.error('Submit error:', err));
  };

  if (loading) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>ชื่อ</label>
        <input
          type="text"
          name="firstname"
          value={formData.firstname}
          onChange={handleChange}
          className="border px-2 py-1 w-full"
        />
      </div>
      <div>
        <label>นามสกุล</label>
        <input
          type="text"
          name="lastname"
          value={formData.lastname}
          onChange={handleChange}
          className="border px-2 py-1 w-full"
        />
      </div>
      <div>
        <label>อีเมล</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="border px-2 py-1 w-full"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        บันทึก
      </button>
    </form>
  );
}

export default PatienFormEdit;
