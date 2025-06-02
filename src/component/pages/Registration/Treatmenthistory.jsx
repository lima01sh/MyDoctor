import React , { useState, useEffect }from 'react'
import { Link,useLocation ,useNavigate} from 'react-router-dom'
import "./registration.css";

import { APi_URL_UAT } from "../../auth/config";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAddressCard,faHospitalUser,faBookMedical,faFolderOpen} from '@fortawesome/free-solid-svg-icons'
import DataTable from "react-data-table-component";

const Treatmenthistory = () => {
    const location = useLocation();
    const { state } = location; 
    const hn_patient_id = state.hn_patient_id; 
    const clinic_id = localStorage.getItem('clinic_id');

    const apiKey = localStorage.getItem("token"); // ใส่ API Key ที่นี่

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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
            name: 'วันที่เข้ารับการรักษา',
            selector: (row) => row.treatment_date,
            sortable: true,
        },
        {
            id: "2",
            name: 'รหัสการรักษา',
            selector: (row) => row.history_id,
            sortable: true,
        },
        {
            id: "3",
            name: 'ชื่อ-นามสกุล',
            selector: (row) => row.name,
            sortable: true,
        },
        {
            id: "4",
            name: 'สถานะ',
            selector: (row) => row.status,
            sortable: true,
        },
        {
            id: "5",
            name: 'รายละเอียด',
            selector: (row) => row.description,
            sortable: true,
        },
        {
            id: "6",
            name: 'ดูข้อมูล',
            selector: (row) => <Link to="/treatmenthistoryinfo" className="btn btn-nav"
                                    state={{
                                        hn_patient_id: row.hn_patient_id,
                                        thai_prefix: state.thai_prefix,
                                        thai_firstname: state.thai_firstname,
                                        thai_lastname: state.thai_lastname,
                                        history_id: row.history_id,
                                    }}>
                                    <FontAwesomeIcon className="fa-lg fa-icon" icon={faFolderOpen} />
                                </Link>,
            sortable: true,
            style: {
                justifyContent: 'center',
            },
        },
    ];
    // Table

    const [search, setSearch] = useState("");
    // check search
    const [data, setData] = useState([]);
    
    //  of Hooks 
    const apiUrl = `${APi_URL_UAT}personal_information&hn_patient_id=${hn_patient_id}&clinic_id=${clinic_id}`; // ใส่ API Key ที่นี่

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
            setData(result.data.treatment_history);
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
      <div className="p-4 mb-5 ">
            <h2 className="text-start display-6 fw-semibold text-titlepage">ประวัติการรักษา</h2>
            <nav aria-label="breadcrumb" className="bg-light rounded-2 px-3 p-2">
                 <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item"><Link to="/registration" className="breadcrumb-link"><FontAwesomeIcon className="me-1" icon={faAddressCard} />เวชระเบียน</Link></li>
                    <li className="breadcrumb-item"><Link to="/patientinfo" 
                    state={{hn_patient_id: hn_patient_id,
                        thai_prefix: state.thai_prefix,
                        thai_firstname: state.thai_firstname,
                        thai_lastname: state.thai_lastname,
                    }} className="breadcrumb-link"><FontAwesomeIcon className="me-1" icon={faHospitalUser} />ข้อมูลผู้ป่วย</Link></li>
                    <li className="breadcrumb-item mb-0 active" aria-current="page"><FontAwesomeIcon className="me-1" icon={faBookMedical} />ประวัติการรักษา</li>
                </ol>
            </nav>
            <div className="mt-5">
                <div className="card">
                    <div className="card-header fs-5 fw-semibold">
                        รหัสผู้ป่วย : {hn_patient_id}
                    </div>
                    <div className="p-2">
                        <DataTable columns={columns} data={filteredPatients} 
                        customStyles={customStyles}
                        pagination
                        paginationComponentOptions={paginationComponentOptions}
                        highlightOnHover
		                pointerOnHover
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Treatmenthistory
