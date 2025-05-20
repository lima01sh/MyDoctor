import React , { useState, useEffect }from 'react'
import { Link,useLocation ,useNavigate} from 'react-router-dom'
import "./registration.css";

import { APi_URL_UAT } from "../../auth/config";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAddressCard,faHospitalUser,faFileWaveform,faHandHoldingMedical,faPrint,faPills } from '@fortawesome/free-solid-svg-icons'

const Listdrugallergies = () => {
    const location = useLocation();
    const { state } = location; 
    const hn_patient_id = state.hn_patient_id; 
    const clinic_id = localStorage.getItem('clinic_id');

    const apiKey = localStorage.getItem("token"); // ใส่ API Key ที่นี่
    const apiUrl_drug = `${APi_URL_UAT}listdrug_allergies&hn_patient_id=${hn_patient_id}&clinic_id=${clinic_id}`;
    
    const [drug_allergieslist, setDrug_allergieslist] = useState([]);
    const listdrug_allergies = () => {
        const myHeaders = new Headers();
        myHeaders.append("X-API-KEY", apiKey);

        const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
        };

        fetch(
        apiUrl_drug,requestOptions
        )
        .then((response) => response.json())
        .then((result) => {
            console.log(result.data.drug_allergies)
            if (result.success) {
                setDrug_allergieslist(result.data.drug_allergies);
            }
        })
        .catch((error) => console.error(error));
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        listdrug_allergies();
    }, []);
     
  return (
    <div>
        <div className="p-4 mb-5 ">
            <h2 className="text-start display-6 fw-semibold text-titlepage">ประวัติแพ้ยา</h2>
            <nav aria-label="breadcrumb" className="bg-light rounded-2 px-3 p-2">
                <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item"><Link to="/registration" className="breadcrumb-link"><FontAwesomeIcon className="me-1" icon={faAddressCard} />เวชระเบียน</Link></li>
                    <li className="breadcrumb-item"><Link to="/patientinfo" 
                    state={{hn_patient_id: hn_patient_id,
                        thai_prefix: state.thai_prefix,
                        thai_firstname: state.thai_firstname,
                        thai_lastname: state.thai_lastname,
                    }} className="breadcrumb-link"><FontAwesomeIcon className="me-1" icon={faHospitalUser} />ข้อมูลผู้ป่วย</Link></li>
                    <li className="breadcrumb-item mb-0 active" aria-current="page"><FontAwesomeIcon className="me-1" icon={faPills} />ประวัติแพ้ยา</li>
                </ol>
            </nav>
            <div className="mt-5">
                <div className="card">
                    <div className="card-header fs-5 fw-semibold">
                        รหัสผู้ป่วย : {hn_patient_id}
                    </div>
                    <div className="card-body">
                        <p className="text-start fs-5 ">รายการแพ้ยา</p>
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th scope="col">รหัสยา</th>
                                    <th scope="col">ชื่อยา</th>
                                    <th scope="col">อธิบายระดับการแพ้</th>
                                    <th scope="col">ชนิดการแพ้</th>
                                    <th scope="col">ข้อมูลโดย</th>
                                </tr>
                            </thead>
                            <tbody>
                                {drug_allergieslist.map((item,index) => (
                                <tr key={index}>
                                    <td scope="col">{item.drug_code}</td>
                                    <td scope="col">{item.med_name}</td>
                                    <td scope="col">{item.severity_description}</td>
                                    <td scope="col">{item.allergy_name}</td>
                                    <td scope="col">{item.history_source_name}</td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    
    </div>
  )
}

export default Listdrugallergies
