
import React, { useState, useEffect, useRef } from "react";
import './c.css';
import { APi_URL_UAT } from "../../auth/config";
import { useLocation, useNavigate } from "react-router-dom";
import { Modal, Button, Card, Collapse } from 'react-bootstrap';
import Swal from 'sweetalert2';
import DisplayData from "./DisplayData";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Pat_checks_fordisease_create_Beam = ({ handleLogout }) => {
    const getCurrentDateAndTime = () => {
        const currentDate = new Date();
        const date = currentDate.toISOString().split("T")[0];
        const time = currentDate.toISOString().split("T")[1].substring(0, 5);
        return { date, time };
    };

    const navigate = useNavigate();
    const location = useLocation();
    const patientData = location.state || {};
    const apiKey = localStorage.getItem("token");
    const clinic_id = localStorage.getItem("clinic_id");
    const [showModal, setShowModal] = useState(false);
    const [activePatient, setActivePatient] = useState(null);
    const [Text, setText] = useState(null);
    const [patient_vitals, setPatientVitals] = useState({});
    const [savedData, setSavedData] = useState(null);
    const [openSections, setOpenSections] = useState({});

    // Debounce timer for search
    const debounceTimeout = useRef(null);

    useEffect(() => {
        DrugAllergies();
        treatment_information();
    }, []);

    const DrugAllergies = () => {
        const myHeaders = new Headers();
        myHeaders.append("x-api-key", apiKey);
        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };
        fetch(APi_URL_UAT + "listdrug_allergies&hn_patient_id=" + patientData.hn_patient_id + "&clinic_id=" + clinic_id, requestOptions)
            .then((response) => {
                console.log('Status Code:', response.status);
                if (response.status === 401) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Token! หมดอายุ',
                        text: 'กรุณาเข้าสู่ระบบใหม่',
                        confirmButtonText: 'ออกจากระบบ'
                    }).then(() => {
                        handleLogout();
                    });
                }
                return response.json();
            })
            .then((result) => {
                setActivePatient(result.data);
            })
            .catch((error) => console.error(error));
    };

    const treatment_information = () => {
        const myHeaders = new Headers();
        myHeaders.append("x-api-key", apiKey);
        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };
        fetch(APi_URL_UAT + "treatment_information&history_id=" + patientData.history_id, requestOptions)
            .then((response) => {
                console.log('Status Code:', response.status);
                if (response.status === 401) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Token! หมดอายุ',
                        text: 'กรุณาเข้าสู่ระบบใหม่',
                        confirmButtonText: 'ออกจากระบบ'
                    }).then(() => {
                        handleLogout();
                    });
                }
                return response.json();
            })
            .then((result) => {
                setPatientVitals(result.data);
            })
            .catch((error) => console.error(error));
    };

    const initialState = {
        cc: [],
        pi: [],
        ph: [],
        pe: [],
        prx: [],
        fu: [],
        dx: [],
        rx: [],
        lab_results: [],
        xr_results: []
    };

    const [formData, setFormData] = useState(initialState);

    const toggleSection = (section) => {
        setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    const Update = async (id) => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-API-KEY", apiKey);
        const raw = JSON.stringify({ "queue_id": id });
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };
        fetch(APi_URL_UAT + "update", requestOptions)
            .then((response) => {
                console.log('Status Code:', response.status);
                if (response.status === 401) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Token! หมดอายุ',
                        text: 'กรุณาเข้าสู่ระบบใหม่',
                        confirmButtonText: 'ออกจากระบบ'
                    }).then(() => {
                        handleLogout();
                    });
                }
                return response.json();
            })
            .then((result) => {
                if (result["success"] === true) {
                    Adddata();
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'เกิดข้อผิดพลาด!',
                        text: 'กรุณาติดต่อผู้พัฒนาระบบ',
                        confirmButtonText: 'ลองอีกครั้ง'
                    });
                }
            })
            .catch((error) => {
                console.error(error);
                Swal.fire({
                    icon: 'error',
                    title: 'ข้อผิดพลาด!',
                    text: 'การเชื่อมต่อ API ล้มเหลว',
                    confirmButtonText: 'ปิด'
                });
            });
    };

    const Adddata = () => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-API-KEY", apiKey);
        const raw = JSON.stringify(savedData);
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };
        fetch(APi_URL_UAT + "Pat_checks_fordisease", requestOptions)
            .then((response) => {
                console.log('Status Code:', response.status);
                if (response.status === 401) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Token! หมดอายุ',
                        text: 'กรุณาเข้าสู่ระบบใหม่',
                        confirmButtonText: 'ออกจากระบบ'
                    }).then(() => {
                        handleLogout();
                    });
                }
                return response.json();
            })
            .then((result) => {
                if (result["success"] === true) {
                    Swal.fire({
                        icon: 'success',
                        title: 'สำเร็จ!',
                        text: 'บันทึกข้อมูลแล้ว',
                        confirmButtonText: 'ตกลง'
                    }).then(() => {
                        navigate('/pat_checks_fordisease');
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'เกิดข้อผิดพลาด!',
                        text: 'ไม่สามารถดึงข้อมูลได้',
                        confirmButtonText: 'ลองอีกครั้ง'
                    });
                }
            })
            .catch((error) => {
                console.error(error);
                Swal.fire({
                    icon: 'error',
                    title: 'ข้อผิดพลาด!',
                    text: 'การเชื่อมต่อ API ล้มเหลว',
                    confirmButtonText: 'ปิด'
                });
            });
    };

    const handSearch = async (tab, index, searchCode, url) => {
        // Clear previous debounce
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        // Skip search if searchCode is empty or too short
        if (!searchCode || searchCode.length < 2) {
            const newFormData = { ...formData };
            newFormData[tab][index].icdOptions = [];
            setFormData(newFormData);
            setText(null);
            return;
        }

        // Debounce the API call
        debounceTimeout.current = setTimeout(async () => {
            try {
                const myHeaders = new Headers();
                myHeaders.append("X-API-KEY", apiKey);
                const requestOptions = {
                    method: "GET",
                    headers: myHeaders,
                    redirect: "follow",
                };
                const response = await fetch(
                    `${APi_URL_UAT}${url}&search=${encodeURIComponent(searchCode)}`,
                    requestOptions
                );
                const result = await response.json();
                if (result.success && result.data.length > 0) {
                    const newFormData = { ...formData };
                    newFormData[tab][index].icdOptions = result.data;
                    setFormData(newFormData);
                    setText(null);
                } else {
                    setText("ไม่พบข้อมูล ที่ค้นหา");
                    console.error("ไม่พบข้อมูล ที่ค้นหา");
                }
            } catch (error) {
                console.error("เกิดข้อผิดพลาดในการค้นหาข้อมูล:", error);
                setText("เกิดข้อผิดพลาดในการค้นหา");
            }
        }, 300); // 300ms debounce delay
    };

    const highlightText = (text, searchTerm) => {
        if (!searchTerm || !text) return text;
        const regex = new RegExp(`(${searchTerm})`, "gi");
        const parts = text.split(regex);
        return parts.map((part, index) =>
            regex.test(part) ? (
                <span key={index} className="highlight">{part}</span>
            ) : (
                part
            )
        );
    };

    const handleICDSelect = (tab, index, icdData) => {
        const newFormData = { ...formData };
        newFormData[tab][index].code = icdData.icd10 || "";
        newFormData[tab][index].description = icdData.icd10name || "";
        newFormData[tab][index].icd_id = icdData.id || "";
        newFormData[tab][index].icdOptions = [];
        setFormData(newFormData);
    };

    const handleMeditemSelect = (tab, index, meditemData) => {
        const newFormData = { ...formData };
        newFormData[tab][index].medicine_name = meditemData.name || "";
        newFormData[tab][index].meditem_id = meditemData.meditem_id || "";
        newFormData[tab][index].price = meditemData.price || "";
        newFormData[tab][index].icdOptions = [];
        setFormData(newFormData);
    };

    const handPrxSelect = (tab, index, PrxData) => {
        const newFormData = { ...formData };
        newFormData[tab][index].procedure_name = PrxData.nameprcd || "";
        newFormData[tab][index].price = PrxData.priceprcd || "";
        newFormData[tab][index].prcd_id = PrxData.id || "";
        newFormData[tab][index].icdOptions = [];
        setFormData(newFormData);
    };

    const handLabelect = (tab, index, LabData) => {
        const newFormData = { ...formData };
        newFormData[tab][index].test_name = LabData.labname || "";
        newFormData[tab][index].price = LabData.pricelab || "";
        newFormData[tab][index].lab_data_id = LabData.id_lap || "";
        newFormData[tab][index].icdOptions = [];
        setFormData(newFormData);
    };

    const handRxayelect = (tab, index, RxayData) => {
        const newFormData = { ...formData };
        newFormData[tab][index].description = RxayData.xryname || "";
        newFormData[tab][index].price = RxayData.pricexry || "";
        newFormData[tab][index].rxay_id = RxayData.id || "";
        newFormData[tab][index].icdOptions = [];
        setFormData(newFormData);
    };

    const handleChange = (tab, index, field, value) => {
        const newFormData = { ...formData };
        newFormData[tab][index][field] = value;
        setFormData(newFormData);

        // Trigger search on specific fields
        if (
            (tab === "prx" && field === "procedure_name") ||
            (tab === "dx" && field === "code") ||
            (tab === "rx" && field === "medicine_name") ||
            (tab === "lab_results" && field === "test_name") ||
            (tab === "xr_results" && field === "description")
        ) {
            const urlMap = {
                prx: "list_prcd",
                dx: "list_icd",
                rx: "list_meditem",
                lab_results: "list_lab",
                xr_results: "list_rxay"
            };
            handSearch(tab, index, value, urlMap[tab]);
        }
    };

    const handleAddForm = (tab) => {
        const newFormData = { ...formData };
        const newForm =
            tab === "fu" ? {
                hn_patient_id: patientData.hn_patient_id,
                appointment_date: getCurrentDateAndTime().date,
                details: "",
                date: "",
                time: "",
                treatment_history_id: patientData.history_id,
                clinic_id: clinic_id
            } : tab === "lab_results" ? {
                hn_patient_id: patientData.hn_patient_id,
                test_name: "",
                result_value: "",
                price: "",
                status_sen: "",
                lab_data_id: "",
                treatment_history_id: patientData.history_id,
                clinic_id: clinic_id
            } : tab === "xr_results" ? {
                hn_patient_id: patientData.hn_patient_id,
                description: "",
                price: "",
                rxay_id: "",
                treatment_history_id: patientData.history_id,
                clinic_id: clinic_id
            } : tab === "cc" ? {
                hn_patient_id: patientData.hn_patient_id,
                description: "",
                treatment_history_id: patientData.history_id,
                clinic_id: clinic_id
            } : tab === "pi" ? {
                hn_patient_id: patientData.hn_patient_id,
                description: "",
                treatment_history_id: patientData.history_id,
                clinic_id: clinic_id
            } : tab === "ph" ? {
                hn_patient_id: patientData.hn_patient_id,
                description: "",
                treatment_history_id: patientData.history_id,
                clinic_id: clinic_id
            } : tab === "pe" ? {
                hn_patient_id: patientData.hn_patient_id,
                description: "",
                price: "80.00",
                treatment_history_id: patientData.history_id,
                clinic_id: clinic_id
            } : tab === "prx" ? {
                hn_patient_id: patientData.hn_patient_id,
                procedure_name: "",
                quantity: "",
                price: "",
                prcd_id: "",
                treatment_history_id: patientData.history_id,
                clinic_id: clinic_id
            } : tab === "dx" ? {
                hn_patient_id: patientData.hn_patient_id,
                code: "",
                description: "",
                icd_id: "",
                treatment_history_id: patientData.history_id,
                clinic_id: clinic_id
            } : tab === "rx" ? {
                hn_patient_id: patientData.hn_patient_id,
                medicine_name: "",
                dosage: "",
                usage_instruction: "",
                quantity: "",
                price: "",
                meditem_id: "",
                treatment_history_id: patientData.history_id,
                clinic_id: clinic_id
            } : {};
        newFormData[tab].push(newForm);
        setFormData(newFormData);
    };

    const handleDeleteForm = (tab, index) => {
        const newFormData = { ...formData };
        newFormData[tab].splice(index, 1);
        setFormData(newFormData);
    };

    const cleanEmptyArrays = (obj) => {
        if (Array.isArray(obj)) {
            return obj.length > 0 ? obj.map(cleanEmptyArrays) : undefined;
        } else if (typeof obj === "object" && obj !== null) {
            return Object.entries(obj).reduce((acc, [key, value]) => {
                const cleanedValue = cleanEmptyArrays(value);
                if (cleanedValue !== undefined) acc[key] = cleanedValue;
                return acc;
            }, {});
        }
        return obj;
    };

    const handleSave = () => {
        const cleanedData = { data: cleanEmptyArrays(formData) };
        setSavedData(cleanedData);
    };

    const handleCardClick = () => {
        setShowModal(true);
    };

    const handleClose = () => setShowModal(false);

    const cardStyle = {
        cursor: 'pointer',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    };

    if (!patient_vitals) {
        return <p className="text-center text-gray-500">กำลังโหลดข้อมูล...</p>;
    }

    return (
        <div className="container mt-4">
            <style>
                {`
                    :root {
  --primary-color: #5ba4d0;
  --primary-light: #e8f4f9;
  --accent-color: #7cccbd;
  --warning-color: #fad7b1;
  --danger-color: #f6d0cd;
  --text-dark: #4a5568;
  --text-light: #a0aec0;
  --border-color: #edf2f7;
  --shadow-color: rgba(0, 0, 0, 0.05);
  --bg-light: #ffffff;
  --bg-light-hover: #f9fafc;
}

body {
  font-family: 'Nunito', 'Kanit', sans-serif;
  background-color: #fafafa;
  color: var(--text-dark);
  line-height: 1.6;
}

/* Enhanced Alert styling for medical header */
.alert-danger {
  background: linear-gradient(135deg, #ffffff 0%, #f8fbfd 100%);
  border: 1px solid var(--border-color);
  border-left: 4px solid var(--primary-color);
  box-shadow: 0 4px 15px rgba(91, 164, 208, 0.08);
  margin-bottom: 2rem;
  padding: 1.75rem 2rem;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
}

.med-search-item .highlight {
  background-color: #fef08a; /* สีเหลืองอ่อนสำหรับไฮไลต์ */
  padding: 2px 4px;
  border-radius: 3px;
  font-weight: 500;
}

.alert-danger::before {
  content: '⚕️';
  position: absolute;
  top: 1.5rem;
  right: 2rem;
  font-size: 2rem;
  opacity: 0.1;
  transform: rotate(15deg);
}

.alert-danger::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--primary-color) 0%, var(--accent-color) 100%);
  border-radius: 10px 10px 0 0;
}

.alert-danger h1 {
  color: var(--primary-color);
  margin-bottom: 0.75rem;
  font-weight: 700;
  font-size: 1.75rem;
  letter-spacing: -0.5px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.alert-danger h1::before {
  content: '🏥';
  font-size: 1.5rem;
  margin-right: 0.25rem;
}

.alert-danger p {
  color: var(--text-dark);
  line-height: 1.6;
  font-size: 1rem;
  margin: 0;
  font-weight: 400;
  opacity: 0.9;
}

/* Enhanced Card styling */
.card {
  border: 1px solid var(--border-color);
  border-radius: 12px !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  overflow: hidden;
  position: relative;
  box-shadow: 0 2px 8px rgba(91, 164, 208, 0.06);
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--primary-color) 0%, var(--accent-color) 100%);
  opacity: 0.8;
}

.card-body {
  padding: 1.5rem;
  position: relative;
}

.card-body::after {
  content: '👤';
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.5rem;
  opacity: 0.08;
}

/* Special styling for patient info card */
.card:nth-child(2) .card-body::after {
  content: '📋';
}

.card-title {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: var(--primary-color);
  letter-spacing: -0.3px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.card-title::before {
  content: '•';
  color: var(--accent-color);
  font-size: 1rem;
  font-weight: bold;
}

.card-text {
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
  color: var(--text-dark);
  opacity: 0.8;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.card-text:last-child {
  margin-bottom: 0;
}

.card-text::before {
  content: '▸';
  color: var(--primary-color);
  font-size: 0.8rem;
  opacity: 0.6;
}

/* Special card effects */
.card[style*="cursor: pointer"],
.card[onclick] {
  cursor: pointer;
}

.card[style*="cursor: pointer"]:hover,
.card[onclick]:hover {
  transform: translateY(-4px) scale(1.03);
  box-shadow: 0 10px 30px rgba(91, 164, 208, 0.15);
}

.card[style*="cursor: pointer"] .card-body::after,
.card[onclick] .card-body::after {
  content: '👆';
  opacity: 0.1;
}

/* Patient name styling */
.text-uppercase.text-primary.font-bold {
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Enhanced Flexbox layout */
.row {
  display: flex;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;
  gap: 0;
}

.col-md-6 {
  flex: 0 0 50%;
  max-width: 50%;
  padding-right: 15px;
  padding-left: 15px;
}

.mb-3 {
  margin-bottom: 1.5rem !important;
}

/* Card container enhancements */
.row .col-md-6:first-child .card {
  background: linear-gradient(135deg, #ffffff 0%, #f0f8ff 100%);
}

.row .col-md-6:last-child .card {
  background: linear-gradient(135deg, #ffffff 0%, #f0fff4 100%);
}

.row .col-md-6:last-child .card::before {
  background: linear-gradient(90deg, var(--accent-color) 0%, var(--primary-color) 100%);
}

/* Medical icons - subtle version */
.card::before {
  content: '';
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 20px;
  height: 20px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%235ba4d0' opacity='0.1'%3E%3Cpath d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-8.5 12H9v-1.5H7.5V12h1.5v-1.5H10v1.5h1.5V12H10v1.5zm5 0h-3v-1.5h3V15zm0-3h-3v-1.5h3V12zm0-3h-8V7.5h8V9z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-size: contain;
  opacity: 0.1;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .col-md-6 {
    flex: 0 0 100%;
    max-width: 100%;
    margin-bottom: 1rem;
  }
  
  .card {
    margin-bottom: 1.5rem;
  }
  
  .card:hover {
    transform: translateY(-2px) scale(1.01);
  }
  
  .card-title {
    font-size: 1.1rem;
  }
  
  .card-text {
    font-size: 0.9rem;
  }
  
  .alert-danger {
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  .alert-danger h1 {
    font-size: 1.5rem;
  }
  
  .alert-danger p {
    font-size: 0.9rem;
  }
}

/* Thai font adjustments */
@font-face {
  font-family: 'Kanit';
  src: url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500&display=swap');
}

/* Button styles */
.btn-primary {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  box-shadow: 0 2px 4px rgba(91, 164, 208, 0.1);
  border-radius: 6px;
  padding: 0.5rem 1.25rem;
  font-weight: 500;
}

.btn-primary:hover {
  background-color: #4a93be;
  border-color: #4a93be;
  transform: translateY(-1px);
  box-shadow: 0 3px 6px rgba(91, 164, 208, 0.15);
}

/* Diagnosis form area */
.diagnosis-form {
  background-color: var(--bg-light);
  border-radius: 8px;
  padding: 1.25rem;
  box-shadow: 0 2px 8px var(--shadow-color);
  margin-top: 1.5rem;
}

.form-group label {
  color: var(--text-dark);
  font-weight: 500;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.form-control {
  border-radius: 6px;
  border: 1px solid var(--border-color);
  padding: 0.6rem;
  font-size: 0.9rem;
}

.form-control:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 0.15rem rgba(91, 164, 208, 0.1);
}

/* Clinic container */
.med-diagnosis-container {
  font-family: 'Prompt', 'Kanit', sans-serif;
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
  background-color: #FFFFFF;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  box-shadow: 0 2px 5px var(--shadow-color);
}

.med-alert-error {
  background-color: #FFFFFF;
  border: 1px solid var(--border-color);
  border-left: 3px solid var(--danger-color);
  color: var(--text-dark);
  padding: 12px 15px;
  margin-bottom: 20px;
  border-radius: 6px;
  font-weight: 400;
}

.med-fieldset-card {
  border: 1px solid var(--border-color);
  border-radius: 6px;
  margin-bottom: 16px;
  background-color: #FFFFFF;
  box-shadow: 0 1px 3px var(--shadow-color);
  transition: all 0.2s ease;
}

.med-fieldset-card:hover {
  box-shadow: 0 2px 6px var(--shadow-color);
  border-color: var(--primary-light);
}

.med-fieldset-header {
  background-color: var(--primary-light);
  color: var(--text-dark);
  padding: 12px 20px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  border-radius: 6px 6px 0 0;
  transition: all 0.2s ease;
}

.med-fieldset-header:hover {
  background-color: #daeaf3;
}

.med-fieldset-header h5 {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 500;
}

.med-fieldset-body {
  padding: 20px;
  background-color: #FFFFFF;
}

.med-form-card {
  border: 1px solid var(--border-color);
  border-radius: 6px;
  margin-bottom: 15px;
  background-color: #f8fbfd;
  box-shadow: 0 1px 2px var(--shadow-color);
  transition: all 0.2s ease;
  position: relative;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.med-form-card:hover {
  border-color: var(--primary-light);
}

.med-form-label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: var(--text-dark);
  font-size: 0.9rem;
}

.med-form-input,
.med-form-select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 0.9rem;
  color: var(--text-dark);
  background-color: #FFFFFF;
  transition: all 0.2s ease;
}

.med-form-input:focus,
.med-form-select:focus {
  border-color: var(--primary-color);
  outline: none;
  box-shadow: 0 0 0 2px rgba(91, 164, 208, 0.1);
}

.med-form-input:hover,
.med-form-select:hover {
  border-color: var(--primary-light);
  background-color: #f9fafc;
}

.med-btn {
  display: inline-flex;
  align-items: center;
  font-weight: 500;
  padding: 10px 16px;
  font-size: 0.9rem;
  border-radius: 6px;
  border: 1px solid transparent;
  transition: all 0.2s ease;
  cursor: pointer;
  width: 100%;
  justify-content: center;
}

.med-btn-danger i {
  margin-right: 0;
  font-size: 0.8rem;
}

.med-btn-primary {
  color: #FFFFFF;
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.med-btn-primary:hover {
  background-color: #4a93be;
  border-color: #4a93be;
}

.med-btn-success {
  color: #FFFFFF;
  background-color: var(--accent-color);
  border-color: var(--accent-color);
}

.med-btn-success:hover {
  background-color: #6bbbad;
  border-color: #6bbbad;
}

.med-btn-danger {
  color: var(--text-dark);
  background-color: var(--danger-color);
  border-color: var(--danger-color);
  width: auto;
  padding: 8px 16px;
  font-size: 0.9rem;
  align-self: flex-end;
  margin-top: 10px;
}

.med-btn-danger:hover {
  background-color: #f3c0bc;
  border-color: #f3c0bc;
}

.med-btn-container {
  display: flex;
  gap: 15px;
  margin-top: 20px;
  padding: 15px 0;
  border-top: 1px solid var(--border-color);
}

.med-empty-state {
  text-align: center;
  padding: 20px;
  color: var(--text-light);
  font-style: italic;
  background-color: #FFFFFF;
  border: 1px dashed var(--border-color);
  border-radius: 6px;
  margin: 10px 0;
}

.med-search-list {
  position: absolute;
  z-index: 1000;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background-color: #FFFFFF;
  border: 1px solid var(--border-color);
  border-radius: 0 0 6px 6px;
  box-shadow: 0 2px 5px var(--shadow-color);
  list-style: none;
  padding: 0;
  margin: 0;
}

.med-search-item {
  padding: 8px 12px;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s ease;
}

.med-search-item:last-child {
  border-bottom: none;
}

.med-search-item:hover {
  background-color: var(--primary-light);
  color: var(--text-dark);
}

.med-fieldset-header::before {
  content: '⚕️';
  margin-right: 8px;
  font-size: 14px;
  opacity: 0.7;
}

.med-diagnosis-container::before {
  content: '';
  display: block;
  height: 3px;
  background: linear-gradient(to right, var(--primary-light), #ffffff);
  margin-bottom: 20px;
  border-radius: 6px 6px 0 0;
}

@media screen and (max-width: 768px) {
  .med-diagnosis-container {
    padding: 15px;
    margin: 10px;
  }

  .med-btn-container {
    flex-direction: column;
    gap: 10px;
  }

  .med-btn-container .col-md-6 {
    width: 100%;
    margin-bottom: 10px;
  }

  .med-btn {
    width: 100%;
  }

  .med-form-input,
  .med-form-select {
    font-size: 0.85rem;
    padding: 8px 12px;
  }

  .med-form-label {
    font-size: 0.85rem;
  }
}
                `}
            </style>
            <div className="alert alert-danger" role="alert">
                <h1 className="text-2xl font-bold">แพทย์ตรวจโรค</h1>
                <p>หน้าวินิจฉัยโรค (ระบบแพทย์ตรวจโรค) หากรายการใดไม่มีการตรวจหรือข้อมูล ให้ลบรายการออก หากมีมากกว่า 1 รายการ ให้กดปุ่มเพิ่มรายการใหม่</p>
            </div>

            <div className="row">
                <div className="col-md-6 mb-3">
                    <div className="card shadow-lg rounded-4 border-light hover:shadow-xl transition-transform transform hover:scale-105" style={cardStyle}>
                        <div className="card-body">
                            <h5 className="card-title text-uppercase text-primary font-bold">{patientData.thai_firstname} {patientData.thai_lastname}</h5>
                            <p className="card-text text-muted">เลขผู้ป่วย: {patientData.hn_patient_id}</p>
                            <p className="card-text text-muted">คิวที่: {patientData.queue_number}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 mb-3">
                    <div className="card shadow-lg rounded-4 border-light hover:shadow-xl transition-transform transform hover:scale-105" onClick={handleCardClick} style={cardStyle}>
                        <div className="card-body">
                            <h5 className="card-title text-uppercase text-primary font-bold">ข้อมูลผู้ป่วย/ประวัติแพ้ยา</h5>
                            <p className="card-text text-muted">เลขผู้ป่วย: {patientData.hn_patient_id}</p>
                            <p className="card-text text-muted">ข้อมูลผู้ป่วยวันที่: {getCurrentDateAndTime().date}</p>
                        </div>
                    </div>
                </div>
            </div>

            {activePatient && (
                <Modal show={showModal} onHide={handleClose} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>{patientData.hn_patient_id} - {patientData.thai_firstname} {patientData.thai_lastname}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h5 className="text-info">Vital Signs:</h5>
                        {patient_vitals?.details?.patient_vitals?.map((vital, index) => (
                            <ul key={index} className="list-unstyled">
                                <li><strong>Weight:</strong> {vital.bw} kg</li>
                                <li><strong>Height:</strong> {vital.height} cm</li>
                                <li><strong>BMI:</strong> {vital.bmi}</li>
                                <li><strong>Temperature:</strong> {vital.temp}°C</li>
                                <li><strong>Pulse:</strong> {vital.pulse} bpm</li>
                                <li><strong>Respiration:</strong> {vital.respiration} breaths/min</li>
                                <li><strong>Blood Pressure:</strong> {vital.bp_systolic}/{vital.bp_diastolic} mmHg</li>
                                <li><strong>TB Status:</strong> {vital.tb_status}</li>
                                <li><strong>Eye Exam:</strong> {vital.eye_exam}</li>
                                <li><strong>Screening:</strong> {vital.screening}</li>
                                <li><strong>Alcohol Status:</strong> {vital.alcohol_status}</li>
                                <li><strong>Smoking Status:</strong> {vital.smoking_status}</li>
                                <li><strong>Pregnancy Status:</strong> {vital.pregnancy_status}</li>
                                <li><strong>GFR Status:</strong> {vital.gfr_status}</li>
                                <li><strong>Visit Reason:</strong> {vital.visit_reason}</li>
                            </ul>
                        ))}
                        <h5 className="text-info mt-4">Drug Allergies:</h5>
                        {activePatient.drug_allergies.map((allergy, index) => (
                            <Card key={index} className="mb-3">
                                <Card.Body>
                                    <Card.Title>Medicine: ({allergy.drug_code}) {allergy.med_name}</Card.Title>
                                    <Card.Text><strong>Details:</strong> {allergy.details}</Card.Text>
                                    <Card.Text><strong>Severity:</strong> {allergy.severity_description}</Card.Text>
                                    <Card.Text><strong>Allergy Name:</strong> {allergy.allergy_name}</Card.Text>
                                    <Card.Text><strong>History Source:</strong> {allergy.history_source_name}</Card.Text>
                                </Card.Body>
                            </Card>
                        ))}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>Close</Button>
                    </Modal.Footer>
                </Modal>
            )}

            <div className="med-diagnosis-container">
                {Text && (
                    <div className="med-alert-error" role="alert">
                        {Text}
                    </div>
                )}
                {Object.keys(initialState).map((tab, index) => (
                    <div key={index} className="med-fieldset-card">
                        <div className="med-fieldset-header" onClick={() => toggleSection(tab)}>
                            <h5 className="mb-0">{tab.toUpperCase()}</h5>
                        </div>
                        <Collapse in={openSections[tab]}>
                            <div className="med-fieldset-body">
                                {formData[tab].length === 0 ? (
                                    <p className="med-empty-state">ไม่มีรายการ กรุณากดเพิ่มรายการใหม่</p>
                                ) : (
                                    formData[tab].map((form, formIndex) => (
                                        <div key={formIndex} className="med-form-card">
                                            <div className="med-form-body">
                                                {/* Existing input fields for each tab remain unchanged */}
                                                {tab === "cc" && (
                                                    <div className="mb-3">
                                                        <label className="med-form-label">รายการ/รายละเอียด (CC)</label>
                                                        <input
                                                            type="text"
                                                            value={form.description}
                                                            onChange={(e) => handleChange(tab, formIndex, "description", e.target.value)}
                                                            className="med-form-input"
                                                        />
                                                    </div>
                                                )}
                                                {tab === "pi" && (
                                                    <div className="mb-3">
                                                        <label className="med-form-label">รายการ/รายละเอียด (PI)</label>
                                                        <input
                                                            type="text"
                                                            value={form.description}
                                                            onChange={(e) => handleChange(tab, formIndex, "description", e.target.value)}
                                                            className="med-form-input"
                                                        />
                                                    </div>
                                                )}
                                                {tab === "ph" && (
                                                    <div className="mb-3">
                                                        <label className="med-form-label">รายการ/รายละเอียด (PH)</label>
                                                        <input
                                                            type="text"
                                                            value={form.description}
                                                            onChange={(e) => handleChange(tab, formIndex, "description", e.target.value)}
                                                            className="med-form-input"
                                                        />
                                                    </div>
                                                )}
                                                {tab === "pe" && (
                                                    <div className="row">
                                                        <div className="col-md-8 mb-3">
                                                            <label className="med-form-label">รายการ/รายละเอียด (PE)</label>
                                                            <input
                                                                type="text"
                                                                value={form.description}
                                                                onChange={(e) => handleChange(tab, formIndex, "description", e.target.value)}
                                                                className="med-form-input"
                                                            />
                                                        </div>
                                                        <div className="col-md-4 mb-3">
                                                            <label className="med-form-label">ราคา (PE)</label>
                                                            <input
                                                                type="number"
                                                                value={form.price}
                                                                onChange={(e) => handleChange(tab, formIndex, "price", e.target.value)}
                                                                className="med-form-input"
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                                {tab === "prx" && (
                                                    <div className="row">
                                                        <input
                                                            type="text"
                                                            value={form.prcd_id}
                                                            onChange={(e) => handleChange(tab, formIndex, "prcd_id", e.target.value)}
                                                            className="med-form-input"
                                                            style={{ display: "none" }}
                                                        />
                                                        <div className="col-md-6 mb-3">
                                                            <label className="med-form-label">รายการ/รายละเอียด (PRX)</label>
                                                            <input
                                                                type="text"
                                                                value={form.procedure_name}
                                                                onChange={(e) => handleChange(tab, formIndex, "procedure_name", e.target.value)}
                                                                className="med-form-input"
                                                            />
                                                            {form.icdOptions && form.icdOptions.length > 0 && (
                                                                <ul className="med-search-list">
                                                                    {form.icdOptions.map((prx) => (
                                                                        <li
                                                                            key={prx.id}
                                                                            className="med-search-item"
                                                                            onClick={() => handPrxSelect(tab, formIndex, prx)}
                                                                        >
                                                                            {highlightText(prx.nameprcd, form.procedure_name)}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            )}
                                                        </div>
                                                        <div className="col-md-3 mb-3">
                                                            <label className="med-form-label">จำนวน (PRX)</label>
                                                            <input
                                                                type="text"
                                                                value={form.quantity}
                                                                onChange={(e) => handleChange(tab, formIndex, "quantity", e.target.value)}
                                                                className="med-form-input"
                                                            />
                                                        </div>
                                                        <div className="col-md-3 mb-3">
                                                            <label className="med-form-label">ราคาต่อหน่วย (PRX)</label>
                                                            <input
                                                                type="number"
                                                                value={form.price}
                                                                onChange={(e) => handleChange(tab, formIndex, "price", e.target.value)}
                                                                className="med-form-input"
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                                {tab === "fu" && (
                                                    <>
                                                        <div className="mb-3">
                                                            <label className="med-form-label">วันที่นัด</label>
                                                            <input
                                                                type="date"
                                                                value={form.date}
                                                                onChange={(e) => handleChange(tab, formIndex, "date", e.target.value)}
                                                                className="med-form-input"
                                                            />
                                                        </div>
                                                        <div className="mb-3">
                                                            <label className="med-form-label">รายละเอียดการนัด</label>
                                                            <input
                                                                type="text"
                                                                value={form.details}
                                                                onChange={(e) => handleChange(tab, formIndex, "details", e.target.value)}
                                                                className="med-form-input"
                                                            />
                                                        </div>
                                                        <div className="mb-3">
                                                            <label className="med-form-label">เวลานัด</label>
                                                            <input
                                                                type="time"
                                                                value={form.time}
                                                                onChange={(e) => handleChange(tab, formIndex, "time", e.target.value)}
                                                                className="med-form-input"
                                                            />
                                                        </div>
                                                    </>
                                                )}
                                                {tab === "dx" && (
                                                    <div className="row">
                                                        <input
                                                            type="text"
                                                            value={form.icd_id}
                                                            onChange={(e) => handleChange(tab, formIndex, "icd_id", e.target.value)}
                                                            className="med-form-input"
                                                            style={{ display: "none" }}
                                                        />
                                                        <div className="col-md-3 mb-3">
                                                            <label className="med-form-label">รหัสโรค (DX)</label>
                                                            <input
                                                                type="text"
                                                                value={form.code}
                                                                onChange={(e) => handleChange(tab, formIndex, "code", e.target.value)}
                                                                className="med-form-input"
                                                            />
                                                            {form.icdOptions && form.icdOptions.length > 0 && (
                                                                <ul className="med-search-list">
                                                                    {form.icdOptions.map((icd) => (
                                                                        <li
                                                                            key={icd.id}
                                                                            className="med-search-item"
                                                                            onClick={() => handleICDSelect(tab, formIndex, icd)}
                                                                        >
                                                                            {highlightText(`${icd.icd10} - ${icd.name_t} - ${icd.icd10name}`, form.code)}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            )}
                                                        </div>
                                                        <div className="col-md-9 mb-3">
                                                            <label className="med-form-label">ชื่อโรค (DX)</label>
                                                            <input
                                                                type="text"
                                                                value={form.description}
                                                                onChange={(e) => handleChange(tab, formIndex, "description", e.target.value)}
                                                                className="med-form-input"
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                                {tab === "rx" && (
                                                    <div className="row">
                                                        <input
                                                            type="text"
                                                            value={form.meditem_id}
                                                            onChange={(e) => handleChange(tab, formIndex, "meditem_id", e.target.value)}
                                                            className="med-form-input"
                                                            style={{ display: "none" }}
                                                        />
                                                        <div className="col-md-3 mb-3">
                                                            <label className="med-form-label">รายการยา (RX)</label>
                                                            <input
                                                                type="text"
                                                                value={form.medicine_name}
                                                                onChange={(e) => handleChange(tab, formIndex, "medicine_name", e.target.value)}
                                                                className="med-form-input"
                                                            />
                                                            {form.icdOptions && form.icdOptions.length > 0 && (
                                                                <ul className="med-search-list">
                                                                    {form.icdOptions.map((meditem) => (
                                                                        <li
                                                                            key={meditem.id}
                                                                            className="med-search-item"
                                                                            onClick={() => handleMeditemSelect(tab, formIndex, meditem)}
                                                                        >
                                                                            {highlightText(`${meditem.name} - ราคายา ${meditem.price} - (${meditem.stdcode})`, form.medicine_name)}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            )}
                                                        </div>
                                                        <div className="col-md-3 mb-3">
                                                            <label className="med-form-label">รหัสวิธีใช้ (RX)</label>
                                                            <input
                                                                type="text"
                                                                value={form.dosage}
                                                                onChange={(e) => handleChange(tab, formIndex, "dosage", e.target.value)}
                                                                className="med-form-input"
                                                            />
                                                        </div>
                                                        <div className="col-md-2 mb-3">
                                                            <label className="med-form-label">วิธีการใช้ยา (RX)</label>
                                                            <input
                                                                type="text"
                                                                value={form.usage_instruction}
                                                                onChange={(e) => handleChange(tab, formIndex, "usage_instruction", e.target.value)}
                                                                className="med-form-input"
                                                            />
                                                        </div>
                                                        <div className="col-md-2 mb-3">
                                                            <label className="med-form-label">จำนวนยา (RX)</label>
                                                            <input
                                                                type="number"
                                                                value={form.quantity}
                                                                onChange={(e) => handleChange(tab, formIndex, "quantity", e.target.value)}
                                                                className="med-form-input"
                                                            />
                                                        </div>
                                                        <div className="col-md-2 mb-3">
                                                            <label className="med-form-label">ราคายา/ต่อหน่วย (RX)</label>
                                                            <input
                                                                type="number"
                                                                value={form.price}
                                                                onChange={(e) => handleChange(tab, formIndex, "price", e.target.value)}
                                                                className="med-form-input"
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                                {tab === "lab_results" && (
                                                    <div className="row">
                                                        <input
                                                            type="text"
                                                            value={form.lab_data_id}
                                                            onChange={(e) => handleChange(tab, formIndex, "lab_data_id", e.target.value)}
                                                            className="med-form-input"
                                                            style={{ display: "none" }}
                                                        />
                                                        <div className="col-md-3 mb-3">
                                                            <label className="med-form-label">รายการ (LAB NAME)</label>
                                                            <input
                                                                type="text"
                                                                value={form.test_name}
                                                                onChange={(e) => handleChange(tab, formIndex, "test_name", e.target.value)}
                                                                className="med-form-input"
                                                            />
                                                            {form.icdOptions && form.icdOptions.length > 0 && (
                                                                <ul className="med-search-list">
                                                                    {form.icdOptions.map((Lab) => (
                                                                        <li
                                                                            key={Lab.id}
                                                                            className="med-search-item"
                                                                            onClick={() => handLabelect(tab, formIndex, Lab)}
                                                                        >
                                                                            {highlightText(`${Lab.labname} - ราคา ${Lab.pricelab}`, form.test_name)}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            )}
                                                        </div>
                                                        <div className="col-md-3 mb-3">
                                                            <label className="med-form-label">ราคา (LAB)</label>
                                                            <input
                                                                type="number"
                                                                value={form.price}
                                                                onChange={(e) => handleChange(tab, formIndex, "price", e.target.value)}
                                                                className="med-form-input"
                                                            />
                                                        </div>
                                                        <div className="col-md-3 mb-3">
                                                            <label className="med-form-label">Result Value</label>
                                                            <select
                                                                value={form.result_value}
                                                                onChange={(e) => handleChange(tab, formIndex, "result_value", e.target.value)}
                                                                className="med-form-select"
                                                            >
                                                                <option>เลือกสถานะ</option>
                                                                <option value="ส่ง LAB">ส่ง LAB</option>
                                                            </select>
                                                        </div>
                                                        <div className="col-md-3 mb-3">
                                                            <label className="med-form-label">สถานะ LAB</label>
                                                            <select
                                                                value={form.status_sen}
                                                                onChange={(e) => handleChange(tab, formIndex, "status_sen", e.target.value)}
                                                                className="med-form-select"
                                                            >
                                                                <option>เลือกสถานะ</option>
                                                                <option value="ส่งตรวจภายใน">ส่งตรวจภายใน</option>
                                                                <option value="ส่งตรวจภายนอก">ส่งตรวจภายนอก</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                )}
                                                {tab === "xr_results" && (
                                                    <div className="row">
                                                        <input
                                                            type="text"
                                                            value={form.rxay_id}
                                                            onChange={(e) => handleChange(tab, formIndex, "rxay_id", e.target.value)}
                                                            className="med-form-input"
                                                            style={{ display: "none" }}
                                                        />
                                                        <div className="col-md-8 mb-3">
                                                            <label className="med-form-label">รายการ (Rxay)</label>
                                                            <input
                                                                type="text"
                                                                value={form.description}
                                                                onChange={(e) => handleChange(tab, formIndex, "description", e.target.value)}
                                                                className="med-form-input"
                                                            />
                                                            {form.icdOptions && form.icdOptions.length > 0 && (
                                                                <ul className="med-search-list">
                                                                    {form.icdOptions.map((Rxay) => (
                                                                        <li
                                                                            key={Rxay.id}
                                                                            className="med-search-item"
                                                                            onClick={() => handRxayelect(tab, formIndex, Rxay)}
                                                                        >
                                                                            {highlightText(`${Rxay.xryname} - ราคา ${Rxay.pricexry}`, form.description)}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            )}
                                                        </div>
                                                        <div className="col-md-3 mb-3">
                                                            <label className="med-form-label">ราคา (Rxay)</label>
                                                            <input
                                                                type="number"
                                                                value={form.price}
                                                                onChange={(e) => handleChange(tab, formIndex, "price", e.target.value)}
                                                                className="med-form-input"
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                type="button"
                                                className="med-btn med-btn-danger mt-3"
                                                onClick={() => handleDeleteForm(tab, formIndex)}
                                                style={{ width: 'auto', alignSelf: 'flex-end' }}
                                            >
                                                <i className="bi bi-trash-fill"></i> ลบรายการ
                                            </button>
                                        </div>
                                    ))
                                )}
                                <button
                                    type="button"
                                    className="med-btn med-btn-primary mt-3"
                                    onClick={() => handleAddForm(tab)}
                                >
                                    <i className="bi bi-plus-circle"></i> เพิ่มรายการใหม่
                                </button>
                            </div>
                        </Collapse>
                    </div>
                ))}
                <div className="med-btn-container">
                    <div className="col-md-6">
                        <button
                            type="button"
                            className="med-btn med-btn-success"
                            onClick={handleSave}
                        >
                            <i className="bi bi-check-circle"></i> ตรวจสอบข้อมูล
                        </button>
                    </div>
                    {savedData && (
                        <div className="col-md-6">
                            <button
                                type="button"
                                className="med-btn med-btn-success"
                                onClick={() => Update(patientData.queue_id)}
                            >
                                <i className="bi bi-send"></i> ยืนยันการส่งข้อมูล
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {savedData && (
                <div className="mt-4">
                    <DisplayData savedData={savedData} />
                </div>
            )}
        </div>
    );
};

export default Pat_checks_fordisease_create_Beam;
