import React, { useState, useEffect } from "react";
import { Link,useLocation, useNavigate } from 'react-router-dom';
import { APi_URL_UAT,Location } from "../../auth/config";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPrescription,faFileInvoiceDollar,faCalendarDay,faFileInvoice,faNoteSticky,faHospitalUser,faMagnifyingGlass,faUserMinus,faListUl  } from '@fortawesome/free-solid-svg-icons';
import "./pharmacy.css"
import Swal from "sweetalert2";

import DataTable from "react-data-table-component";

const Pharmacy = () => {
    const location = useLocation();
    const { state } = location; 

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

    let thcase = '';
    let actionLink = '/';
    let actionLinkicon = '';
    switch (location.pathname) {
        case '/pharmacy':
        thcase = 'ข้อมูลการรักษา';
        actionLink = '/pharmacyInfo';
        actionLinkicon = faHospitalUser;
        break;         
        default:
        thcase = 'ข้อมูลการรักษา';
        actionLink = '/pharmacyInfo';
        actionLinkicon = faHospitalUser;
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

    const statusColorMap = {
        'รอคิว': {
            styletext:'text-warning bg-warning-subtle',
            label:'รอคิว',
        },
        'กำลังตรวจ': {
            styletext:'text-info bg-info-subtle',
            label:'ตรวจ',
        },
        'รอรับยา': {
            styletext:'text-primary bg-primary-subtle',
            label:'รอรับยา',
        },
        'ทำรายการเสร็จสิ้น': {
            styletext:'text-success bg-success-subtle',
            label:'เสร็จสิ้น',
        },
    }

    const columns = [
        {
            id: "0",
            name: 'คิว',
            selector: (row) => row.queue_number,
            cell: (row) => (
                <div className="px-0 mx-0">
                    <p className="mb-0">{row.queue_number}</p>
                </div>
            ),
            sortable: true,
            width: '10%',
        },
        {
            id: "1",
            name: 'HN_ID',
            selector: (row) => row.hn_patient_id,
            cell: (row) => (
                <div className="" >
                <p className="mb-0">{row.hn_patient_id}</p>
                </div>
            ),
            sortable: true,
            width: '15%',
        },
        {
            id: "2",
            name: 'วันที่',
            selector: (row) => row.appointment_time,
            cell: (row) => (
                <div className="" >
                <p className="mb-0">{row.appointment_time}</p>
                </div>
            ),
            sortable: true,
            width: '20%',
        },
        {
            id: "3",
            name: 'ชื่อ/สกุล',
            selector: (row) => row.thai_firstname,
            cell: (row) => (
                <div className="" >
                <p className="mb-0">{row.thai_firstname} {row.thai_lastname}</p>
                </div>
            ),
            width: '25%',
        },
        {
            id: "4",
            name: 'สถานะ',
            selector: (row) => row.status,
            cell: (row) => (
                <div>
                    <p className={`mb-0 px-2 rounded-pill ${statusColorMap[row.status]?.styletext || 'text-secondary bg-secondary-subtle'}`}>
                    {statusColorMap[row.status]?.label || row.status}
                    </p>
                </div>
            ),
            width: '15%',
        },
        {
            id: "5",
            name: 'ข้อมูลผู้ป่วย',
            cell: (row) => 
                row.status === 'รอรับยา' ?(
                <div className="mx-auto" >
                    <Link to={actionLink} className="btn btn-nav" disabled
                        state={{
                        queue_id: row.queue_id,
                        hn_patient_id: row.hn_patient_id,
                        }}>
                        <FontAwesomeIcon className="fa-lg fa-icon" icon={actionLinkicon} />
                    </Link>
                </div>
                ):(
                    <button className="btn btn-nav" disabled>
                        <FontAwesomeIcon className="fa-lg fa-icon" icon={actionLinkicon} />
                    </button>
                ),
            width: '15%',
        },
    ];
    // Table

    // ฟังก์ชันเพื่อแปลง Date เป็น 'YYYY-MM-DD'
    const formatDate = date => {
        return date.toISOString().split('T')[0]
    }

    const [selectedDate, setSelectedDate] = useState(formatDate(new Date()))

    const handleChange = (e) => {
        setSelectedDate(e.target.value)
    }
    
    const [patients, setPatients] = useState([]);
    const date = new Date();
    const today = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    const maxtoday = new Date().toISOString().split('T')[0];
 
    const apiUrl = `${APi_URL_UAT}today_patient&hn_patient_id=&date=${selectedDate}&clinic_id=${clinic_id}`; 
    
    console.log(today)
    
    const listmedicalrecord = () => {
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
                    setPatients([]);
                }
            }
        })
        .catch((error) => console.error("Error fetching data:", error));
    };

    useEffect(() => {
        if(selectedDate){
           listmedicalrecord(); 
        }
    }, [selectedDate]);

    const [search, setSearch] = useState("");

    const handleChangeSearch = (event) => {
      setSearch(event.target.value);
    };

    const filteredPatients = patients.filter(
    (row) =>
        row.hn_patient_id.toLowerCase().includes(search.toLowerCase()) ||
        row.queue_number.toLowerCase().includes(search.toLowerCase()) ||
        row.thai_firstname.toLowerCase().includes(search.toLowerCase()) ||
        row.thai_lastname.toLowerCase().includes(search.toLowerCase()) 
    );


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
                        <div className="">
                            <div className="row d-flex flex-column flex-md-row justify-content-between mt-4 mb-3">
                                <div className="d-flex flex-column flex-md-row">
                                    <div className="input-group mt-3 me-0 me-md-3">
                                        <span className="input-group-text">
                                            ข้อมูลวันที่
                                        </span>
                                        <input type="date" value={selectedDate} onChange={handleChange} className="form-control" />
                                    </div>
                                    <div className="input-group mt-3">
                                        <span className="input-group-text">
                                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                                        </span>
                                        <input type="text" className="form-control" placeholder="ค้นหาผู้ป่วยตามชื่อ, เลขผู้ป่วย ,คิวรักษา" value={search} onChange={handleChangeSearch} aria-label="Username" />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                   <DataTable columns={columns} data={filteredPatients} 
                                        customStyles={customStyles}
                                        pagination
                                        paginationComponentOptions={paginationComponentOptions}
                                        highlightOnHover
                                        pointerOnHover
                                        keyField="queue_id"
                                    /> 
                                </div>
                                
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Pharmacy