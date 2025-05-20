import React, { useState, useEffect } from "react";
import { Link,useLocation, useNavigate } from 'react-router-dom';
import { APi_URL_UAT,APi_URL_UPLOAD,Location } from "../../auth/config";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouseCircleExclamation,faEllipsis,faMagnifyingGlass,faUserMinus,faListUl } from '@fortawesome/free-solid-svg-icons';
import Swal from "sweetalert2";
import "./report.css";

const ReportDiseases = () => {
    const location = useLocation();
    const { state } = location;
    const clinic_id = localStorage.getItem('clinic_id');
    const user =  JSON.parse(localStorage.getItem("user")); // Get user data from localStorage
    const data_clinic =   user.data_clinic[0]; // Get user data from localStorage
  
    const apiKey = localStorage.getItem("token"); // ใส่ API Key ที่นี่

    const [diseases, setDiseases] = useState([]);
    const [diseasesM, setDiseasesM] = useState({});

    const apiUrl = `${APi_URL_UAT}get_most_common_diseases&clinic_id=${clinic_id}`; // ใส่ API Key ที่นี่

    const reportincome = async () => {
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
            if(data["success"]===true){
                setDiseases(data.data)
                setDiseasesM(data.data[0])
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
        .catch((error) => console.error("Error fetching data:", error));
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        reportincome();
    }, []);


    return (
        <div>
            
            <div className="d-flex justify-content-center mt-4 mb-3 mb-md-0">
                <div className="col-md-6 card card-peach border-0">
                    <div className="card-body">
                        <p className="card-title h5 mb-0">โรคที่พบบ่อยที่สุด</p>
                        <p className="card-text mt-3"><span className="fw-semibold">ชื่อโรค : </span>{diseasesM.description}</p>
                        <p className="card-text text-center mb-0 text-peach-dark">ความถี่ที่พบ (ครั้ง)</p>
                        <p className="card-text text-center mb-0 fs-1 text-peach-dark">{diseasesM.patient_count}</p>
                    </div>
                </div>
            </div>
         
            <table className="mt-4 table table-bordered">
                <thead>
                    <tr>
                        <th scope="col">ลำดับ</th>
                        <th scope="col">ชื่อโรค</th>
                        <th scope="col">ความถี่ที่พบ</th>
                    </tr>
                </thead>
                <tbody>
                    {diseases.map((item,index) => (
                    <tr key={index}>
                        <td scope="col" className="text-center">{index+1}</td>
                        <td scope="col">{item.description}</td>
                        <td scope="col" className="text-center">{item.patient_count}</td>
                    </tr>
                    ))}
                </tbody>
            </table>
            <p>ข้อมูลของ : {data_clinic.clinic_name}</p>
        </div>
    )
}
export default ReportDiseases