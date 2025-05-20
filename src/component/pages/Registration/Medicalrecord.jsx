import React, { useState, useEffect } from "react";
import "./registration.css"
import { Link, useLocation } from "react-router-dom"; // Import useLocation
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHospitalUser,faStethoscope } from '@fortawesome/free-solid-svg-icons'
//  of Hooks 
import { useFetch } from "../../auth/useGet";
import { APi_URL_UAT } from "../../auth/config";

const Medicalrecord = () => {
  const location = useLocation();
  let thcase = '';
  let actionLink = '/';
  let actionLinkicon = '';
  switch (location.pathname) {
    case '/registration':
      thcase = 'ขึ้นทะเบียน';
      actionLink = '/patientinfo';
      actionLinkicon = faHospitalUser;
      break;         
    default:
      thcase = 'ขึ้นทะเบียน';
      actionLink = '/patientinfo';
      actionLinkicon = faHospitalUser;
  }
  const { state } = location; 
  const [search, setSearch] = useState("");
  // check search
  const isEmpty = search === '';
  const [data, setData] = useState([]);
  
  //  of Hooks 
  const apiUrl = `${APi_URL_UAT}list_patients`;
  
  const apiKey = localStorage.getItem("token"); // ใส่ API Key ที่นี่

  // // สร้าง headers สำหรับ request
  // const myHeaders = new Headers();
  // myHeaders.append("X-API-KEY", apiKey);

  // const { data, error, loading } = useFetch(apiUrl, [], myHeaders);
  // if (loading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error.message}</div>;
  //  end of Hooks
  const listmedicalrecord = () => {
    const myHeaders = new Headers();
    myHeaders.append("x-api-key", apiKey);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    fetch(
      apiUrl,requestOptions
    )
      .then((response) => response.json())
      //  .then((result) => console.log(result))
      .then((result) => {
        if (result.success===true) {
          setData(result.data);
        }
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    listmedicalrecord();
  }, []);

  const handleChangeSearch = (event) => {
    setSearch(event.target.value);
  };

  const filteredPatients = data.filter(
    (row) =>
      row.hn_patient_id.toLowerCase().includes(search.toLowerCase()) ||
      row.thai_prefix.toLowerCase().includes(search.toLowerCase()) ||
      row.thai_firstname.toLowerCase().includes(search.toLowerCase()) ||
      row.thai_lastname.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
        {/* ช่องค้นหา */}
        <input type="text" className="form-control" placeholder="🔍 ค้นหาผู้ป่วยตามชื่อ, เลขผู้ป่วย หรือวันที่ลงทะเบียน" value={search} onChange={handleChangeSearch} />
    
        {/* ตารางแสดงข้อมูลผู้ป่วย */}
        <div className="mt-3">
            <h4 className="text-start mb-3">ผลการค้นหา รายชื่อผู้ป่วย</h4>
            <div className="table-responsive ">
                <table className="table table-bordered table-hover">
                    <thead className="table-primary table-style text-center">
                        <tr>
                          <th>เลขผู้ป่วย</th>
                          <th>คำนำหน้า</th>
                          <th>ชื่อ</th>
                          <th>นามสกุล</th>
                          <th>{thcase}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isEmpty !== true ?
                    filteredPatients.length > 0 ? (
                        filteredPatients.map((row) => (
                          <tr key={row.id}>
                            <td className="text-center">{row.hn_patient_id}</td>
                            <td className="text-center">{row.thai_prefix}</td>
                            <td className="text-center">{row.thai_firstname}</td>
                            <td className="text-center">{row.thai_lastname}</td>
                            <td className="text-center">
                              <Link to={actionLink} className="btn btn-nav"
                              state={{
                                hn_patient_id: row.hn_patient_id,
                                thai_prefix: row.thai_prefix,
                                thai_firstname: row.thai_firstname,
                                thai_lastname: row.thai_lastname,
                              }}>
                                <FontAwesomeIcon className="fa-lg fa-icon" icon={actionLinkicon} />
                              </Link>
                            </td>
                          </tr>
                        ))
                        ) : (
                        <tr>
                            <td colSpan="7" className="text-center text-danger">ไม่พบข้อมูล!! - กรุณาเช็คข้อมูลหรือลงทะเบียนผู้ป่วยใหม่</td>
                        </tr>
                        ): (
                        <tr>
                            <td colSpan="7" className="text-center text-danger">ค้นหาข้อมูลผู้ป่วย</td>
                        </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    
  );
};

export default Medicalrecord;
