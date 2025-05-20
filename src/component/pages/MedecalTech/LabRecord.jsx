import React, { useState, useEffect } from "react";
import './medecalTech.css'
import { Link, useLocation } from "react-router-dom"; // Import useLocation
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHospitalUser,faComment } from '@fortawesome/free-solid-svg-icons'
//  of Hooks 
import { useFetch } from "../../auth/useGet";
import { APi_URL_UAT } from "../../auth/config";

const LabRecord = () => {

    const [search, setSearch] = useState("");
    // check search
    const isEmpty = search === '';
    const [data, setData] = useState([]);

    const location = useLocation();
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
        .then((result) => {
            if (result.success===true) {
            setData(result.data.data);
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
    
    return (
        <div>
            {/* ช่องค้นหา */}
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
                                <Link to={'/LabExternal'} className="btn btn-nav"
                                state={{
                                    hn_patient_id: row.hn_patient_id,
                                    created_at: formatDate(row.created_at),
                                    status_sen: row.status_sen,
                                    result_value: row.result_value,
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

export default LabRecord;
