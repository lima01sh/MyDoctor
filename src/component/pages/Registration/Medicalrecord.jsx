import React, { useState, useEffect } from "react";
import { Link,useLocation, useNavigate } from 'react-router-dom';
import "./registration.css"
import { APi_URL_UAT,APi_URL_UPLOAD,Location } from "../../auth/config";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHospitalUser,faMagnifyingGlass,faUserMinus,faListUl } from '@fortawesome/free-solid-svg-icons';
import Swal from "sweetalert2";
import { el } from "date-fns/locale";

import DataTable from "react-data-table-component";

const Medicalrecord = () => {

  const location = useLocation();
  const { state } = location;
  const clinic_id = localStorage.getItem('clinic_id');

  const apiKey = localStorage.getItem("token"); // ใส่ API Key ที่นี่

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

  useEffect(() => {
      window.scrollTo(0, 0);
  }, []);

  function refreshPage() {
    window.location.reload(false);
  }
  // tABLE
  const customStyles = {
    tableWrapper: {
        style: {
          borderRadius: '5px', // 👈 ขอบโค้ง
          overflow: 'hidden',   // ✅ บังคับให้มุมโค้งทำงาน
        },
    },
    table: {
        style: {
            borderRadius: '5px',
            border: 'none',
        },
    },
    rows: {
        style: {
            marginTop:'3px',
            marginBottom:'3px',
            minHeight: '50px',
            borderBottom: 'none',
            backgroundColor: '#ffffff',
        },
    },
    headCells: {
        style: {
            backgroundColor: '#E9F2FB',
            fontSize: '16px',
            fontWeight: 'bold',
            justifyContent: 'center',  // ✅ ใช้ที่นี่
            display: 'flex',           // ✅ สำคัญเพื่อให้ flex ทำงาน
            alignItems: 'center',      // ✅ ถ้าอยากให้อยู่กลางแนวตั้งด้วย
            color: '#547694',
        },
    },
    cells: {
        style: {
            fontSize: '16px',
            border: 'none',
            justifyContent:'center',
        },
    },
};
  const paginationComponentOptions = {
      selectAllRowsItem: true,
      selectAllRowsItemText: 'Alls',
  };
  const columns = [
    {
        id: "1",
        name: 'HN_ID',
        selector: (row) => row.hn_patient_id,
        cell: (row) => (
          <div className="">
            <p>{row.hn_patient_id}</p>
          </div>
        ),
        sortable: true,
    },
    {
        id: "2",
        name: 'คำนำหน้า',
        selector: (row) => row.thai_prefix,
        cell: (row) => (
          <div className="">
            <p>{row.thai_prefix}</p>
          </div>
        ),
        sortable: true,
    },
    {
        id: "3",
        name: 'ชื่อ',
        selector: (row) => row.thai_firstname,
        cell: (row) => (
          <div className="">
            <p>{row.thai_firstname}</p>
          </div>
        ),
        sortable: true,
    },
    {
        id: "4",
        name: 'สกุล',
        selector: (row) => row.thai_lastname,
        cell: (row) => (
          <div className="">
            <p>{row.thai_lastname}</p>
          </div>
        ),
        sortable: true,
    },
    {
        id: "5",
        name: 'ข้อมูลผู้ป่วย',
        cell: (row) => (
          <div className="mx-auto">
            <Link to={actionLink} className="btn btn-nav"
                state={{
                hn_patient_id: row.hn_patient_id,
                thai_prefix: row.thai_prefix,
                thai_firstname: row.thai_firstname,
                thai_lastname: row.thai_lastname,
                }}>
                <FontAwesomeIcon className="fa-lg fa-icon" icon={actionLinkicon} />
            </Link>
          </div>
        ),
    },
  ];
  // Table

  const [search, setSearch] = useState("");

  const handleChangeSearch = (event) => {
    setSearch(event.target.value);
  };
  // check search
  const [data, setData] = useState([]);


  const handleLogout = () => {
    localStorage.clear(); // Clear data from localStorage
    window.location.href =Location; // Redirect to the main page
  };

  const apiUrl = `${APi_URL_UAT}list_patients&clinic_id=${clinic_id}`;
    
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
    .then((result) => {
      console.log(result);
      if (result.success) {
        setData(result.data);
      }else{
        if(result.status === "error") {
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
          Swal.fire({
          title: "Error!",
          text:
              "ไม่พบข้อมูล",
          icon: "error",
          confirmButtonText: "OK",
          });
        }
      }

    })
    .catch((error) => console.error(error));
  };

    useEffect(() => {
        listmedicalrecord();
    }, []);


  const filteredPatients = data.filter(
  (row) =>
      row.hn_patient_id.toLowerCase().includes(search.toLowerCase()) ||
      row.thai_prefix.toLowerCase().includes(search.toLowerCase()) ||
      row.thai_firstname.toLowerCase().includes(search.toLowerCase()) ||
      row.thai_lastname.toLowerCase().includes(search.toLowerCase())
  );


  return (
    <div>
        <div className="mt-3">
          <div className="mt-3">
            <div className="row d-flex flex-column flex-md-row justify-content-between mt-4 mb-3">
              <div className="">
                <div className="input-group">
                  <span className="input-group-text">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                  </span>
                  <input type="text" className="form-control" placeholder="ค้นหาผู้ป่วยตามชื่อ, เลขผู้ป่วย หรือวันที่ลงทะเบียน" value={search} onChange={handleChangeSearch} aria-label="Username" />
                </div>
              </div>
            </div>
            <div className="">
              <DataTable columns={columns} data={filteredPatients} 
                customStyles={customStyles}
                pagination
                paginationComponentOptions={paginationComponentOptions}
                highlightOnHover
                pointerOnHover
                keyField="id"
              />
            </div>
          </div>
        </div>

    </div>
  )
}

export default Medicalrecord
