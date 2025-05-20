import React, { useState, useEffect, useRef } from "react";
import { Link,useLocation, useNavigate } from 'react-router-dom';
import { APi_URL_UAT,Location,APi_URL_UPLOAD  } from "../../auth/config";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStethoscope,faHouseMedical,faCalendarDay,faComment} from '@fortawesome/free-solid-svg-icons';
import './medecalTech.css'
import Swal from "sweetalert2";

const LabInternal = () => {
    const location = useLocation();
    const { state } = location; 

    const [search, setSearch] = useState("");
    // check search
    const isEmpty = search === '';
    const [data, setData] = useState([]);

    let thcase = '';
    let actionLinkicon = '';
    switch (location.pathname) {
        case '/LabExternal':
            thcase = 'ส่งตรวจภายนอก';
            actionLinkicon = faComment;
        break;         
        case '/LabInternal':
            thcase = 'ส่งตรวจภายใน';
            actionLinkicon = faComment;
        break;         
        default:
            thcase = '';
            actionLinkicon = faComment;
    }
    
    const formatDate = (Cdate) => {
        const date = new Date(Cdate);
        var mm = ("0" + (date.getMonth() + 1)).slice(-2);
        var dd =("0" + (date.getDate())).slice(-2);
        var yy = date.getFullYear();
        var dateString = yy + '-' + mm + '-' + dd;

        return dateString
    };

    const handleLogout = () => {
        localStorage.clear(); // Clear data from localStorage
        window.location.href = Location; // Redirect to the main page
    };

    //  of Hooks 
    const apiUrl = `${APi_URL_UAT}listlab&hn_patient_id=&created_at=&status_sen=${thcase}&result_value=`;
    
    const apiKey = localStorage.getItem("token"); // ใส่ API Key ที่นี่

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
        .then((data) => {
            if (data["success"]===true) {
                setData(data.data.data);
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
                }
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

    const filteredLab = data.filter(
        (row) =>
        row.hn_patient_id.toLowerCase().includes(search.toLowerCase()) ||
        row.test_name.toLowerCase().includes(search.toLowerCase()) ||
        row.result_value.toLowerCase().includes(search.toLowerCase()) ||
        row.created_at.toLowerCase().includes(search.toLowerCase())
    );

    const [labData, setLabData] = useState(null); // State to store Lab data

    const clinic_id = localStorage.getItem("clinic_id"); // ใส่ API Key ที่นี่

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    
    const fetchLabData = (hn_patient_id,created_at,status_sen,result_value) => {
        const apiUrl_per = `${APi_URL_UAT}listlab&hn_patient_id=${hn_patient_id}&created_at=${created_at}&status_sen=${status_sen}&result_value=${result_value}`; // ใส่ API Key ที่นี่
        const myHeaders = new Headers();
        myHeaders.append("X-API-KEY", apiKey);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(apiUrl_per, requestOptions)
            .then((response) => response.json())
            .then((data) => {
            if(data.success){
                setLabData(data.data);
            }
            }
        ) // Store the treatment data
        .catch((error) => console.error("Error fetching treatment data:", error));
    };

    const [formData, setFormData] = useState({});
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const [File, setFile] = useState(null);
    const handleChangeFile = (e) => {
        setFile(e.target.files[0]);
    };
    
    const lab_id = useRef(null);
    const hn_patient_id = useRef(null);
    const created_at = useRef(null);
    const status_sen = useRef(null);
    const apiUrl_Result = `${APi_URL_UAT}lab_results`;

    const handleSubmit = (e) => {
        e.preventDefault();
        const lab_id1 = lab_id.current.value;
        const hn_patient_id1 = hn_patient_id.current.value;
        const created_at1 = created_at.current.value;
        const status_sen1 = status_sen.current.value;

        const myHeaders = new Headers();
        myHeaders.append("X-API-KEY",apiKey);

        const formdata = new FormData();
        formdata.append("lab_id", lab_id1);
        formdata.append("lab_results", formData.lab_results);
        formdata.append("lap_file", File);
        formdata.append("status_lab", formData.result_value);

        const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formdata,
        redirect: "follow"
        };

        fetch(apiUrl_Result, requestOptions)
        .then(response => {
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
            return response.json();
        })
        .then((data) => {
            if (data.success === true) {
                const sendresult_value = formData.result_value;
                const sendcreated_at = created_at1;
                const sendhn_patient_id = hn_patient_id1;
                const sendstatus_sen = status_sen1;
                Swal.fire({
                    title: "Success!",
                    text: "เพิ่มข้อมูล LAB เรียบร้อย",
                    icon: "success",
                    confirmButtonText: "OK",
                }).then((data) => {
                    if (data.isConfirmed) {
                        fetchLabData(sendhn_patient_id,sendcreated_at,sendstatus_sen,sendresult_value);
                    }
                });
            } else {
                Swal.fire({
                    title: "Error!",
                    text: "เกินข้อผิดพลาด (" + data.message + ")",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            }
        })
        .catch((error) => console.error(error));
    }

  return (
    <div>
        <div className="p-4 mb-5 ">
            <h2 className="text-start display-6 fw-semibold text-titlepage">Lab ภายใน</h2>
            <nav aria-label="breadcrumb" className="bg-light rounded-2 px-3 p-2">
                <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                        <Link to="/medicaltech" state={{}} className="breadcrumb-link">
                            <FontAwesomeIcon className="me-1" icon={faStethoscope} />เทคนิคการแพทย์
                        </Link>
                    </li>
                    <li className="breadcrumb-item mb-0 active" aria-current="page"><FontAwesomeIcon className="me-1" icon={faHouseMedical} />Lab ภายใน</li>
                </ol>
            </nav>
            <div className="mt-5">
                <div className="mt-3">
                    {/* ช่องค้นหา */}
                    <div className="card p-4">
                        <input type="text" className="form-control" placeholder="🔍 ค้นหาเลขผู้ป่วย, วันที่ส่ง Lab หรือสถานะ" value={search} onChange={handleChangeSearch} />
                        {/* ตารางแสดงข้อมูลผู้ป่วย */}
                        <div className="mt-3">
                            <h4 className="text-start mb-3">ผลการค้นหา รายชื่อผู้ป่วย</h4>
                            <div className="table-responsive ">
                                <table className="table table-bordered table-hover">
                                    <thead className="table-primary table-style text-center">
                                        <tr>
                                        <th>เลขผู้ป่วย HN</th>
                                        <th>ชื่อ LAB</th>
                                        <th>Status</th>
                                        <th>สถานะส่ง LAB</th>
                                        <th>ดูข้อมูล</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isEmpty !== true ?
                                    filteredLab.length > 0 ? (
                                        filteredLab.map((row) => (
                                        <tr key={row.lab_id}>
                                            <td className="text-center">{row.hn_patient_id}</td>
                                            <td className="text-center">{row.test_name}</td>
                                            <td className="text-center">{row.result_value}</td>
                                            <td className="text-center">{formatDate(row.created_at)}</td>
                                            <td className="text-center">
                                            <button className="btn btn-nav" onClick={()=>fetchLabData(row.hn_patient_id,formatDate(row.created_at),row.status_sen,row.result_value)} >
                                                <FontAwesomeIcon className="fa-lg fa-icon" icon={actionLinkicon} />
                                            </button>
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
                    {/* info */}
                    <div className="">
                        {/* <h2 className="text-center mb-4">รายชื่อผู้ป่วยวันนี้</h2> */}
                        <div className="mt-4"> 
                            {/* Display treatment data */}
                            {labData && (
                                    labData.data.map((labData) => (
                            <div className="card card-body" key={labData.lab_id}>
                                <p className="fs-3 fw-semibold">ข้อมูลการรักษา</p>
                                <div className="row">
                                    <div className="col-md-6 col-lg-8">
                                        <p className="mb-0"><strong>hn_patient_id:</strong> {labData.hn_patient_id}</p>
                                        <p className="mb-0"><strong>test_name:</strong> {labData.test_name}</p>
                                        <p className="mb-0">
                                            <strong>result_value: </strong> 
                                            <span className={`${labData.result_value === "รอผล" ? "text-warning":labData.result_value === "เสร็จสิ้น" ? "text-success" : "text-dark"}`}>{labData.result_value}</span>
                                        </p>
                                        <p className=""><strong>unit:</strong> {labData.unit}</p>
                                        <p className="mb-0"><strong>price:</strong> {labData.price}</p>
                                        <p className=""><strong>created_at:</strong> {labData.created_at}</p>
                                    </div>
                                    <div className="col-md-6 col-lg-4">
                                        <div className="d-flex flex flex-wrap">
                                            <div className="col-12 col-xxl-6 p-1 d-grid gap-2">
                                                <button className={`btn btn-primary ${labData.result_value === "เสร็จสิ้น" ? "disabled": ""}`} type="button" data-bs-toggle="modal" data-bs-target={"#Modal"+labData.lab_id}>
                                                    <FontAwesomeIcon className="me-2 fa-lg fa-icon" icon={faCalendarDay} /> Add Lab File
                                                </button>
                                                <div className="modal fade" id={"Modal"+labData.lab_id} aria-labelledby="ModalLabel" aria-hidden="true">
                                                <div className="modal-dialog">
                                                    <div className="modal-content">
                                                        <div className="modal-header">
                                                            <h1 className="modal-title fs-5" id="ModalLabel">Add Lab File</h1>
                                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                        </div>
                                                        <form onSubmit={handleSubmit}>
                                                            <div className="modal-body">
                                                                <p className="mb-0 fw-normal col-form-label">ผลตรวจ Lab : </p>
                                                                <input type="text" name="lab_results" className="form-control" onChange={handleChange} required/>
                                                                <p className="mb-0 fw-normal col-form-label">File : </p>
                                                                <input type="file" name="filelab" className="form-control" onChange={handleChangeFile} required/>
                                                                <p className="mb-0 fw-normal col-form-label">สถานะ Lab : </p>
                                                                <select
                                                                className="form-select"
                                                                value={formData.result_value}
                                                                onChange={handleChange} required
                                                                name="result_value"
                                                                >
                                                                    <option value="">สถานะ</option>
                                                                    <option value="ส่ง LAB">ส่ง LAB</option>
                                                                    <option value="รอผล">รอผล</option>
                                                                    <option value="เสร็จสิ้น">เสร็จสิ้น</option>
                                                                </select>

                                                                <input type="hidden" name="lab_id" ref={lab_id} defaultValue={labData.lab_id} required/>
                                                                <input type="hidden" name="hn_patient_id" ref={hn_patient_id} defaultValue={labData.hn_patient_id} required/>
                                                                <input type="hidden" name="created_at" ref={created_at} defaultValue={formatDate(labData.created_at)} required/>
                                                                <input type="hidden" name="status_sen" ref={status_sen}  defaultValue={labData.status_sen} required/>

                                                            </div>
                                                            <div className="modal-footer">
                                                                <button type="submit" className="px-5 py-2 btn btn-primary mx-auto" data-bs-dismiss="modal" aria-label="Close">
                                                                    Add File
                                                                </button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <p className="fw-bold">Lab File: </p>
                                    {labData.lap_file? 
                                        <iframe src={APi_URL_UPLOAD+labData.lap_file} width="100%" height="600px"></iframe>
                                    : "-- No File! --"}
                                </div>
                            </div>
                            )))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
  )
}

export default LabInternal
