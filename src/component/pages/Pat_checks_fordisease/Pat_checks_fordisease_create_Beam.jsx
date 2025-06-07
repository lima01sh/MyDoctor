import React, { useState, useEffect, useRef } from "react";
import './c.css';
import { APi_URL_UAT } from "../../auth/config";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card, Collapse } from 'react-bootstrap';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { motion, AnimatePresence } from 'framer-motion';

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
    const [activePatient, setActivePatient] = useState(null);
    const [Text, setText] = useState(null);
    const [patient_vitals, setPatientVitals] = useState({});
    const [savedData, setSavedData] = useState(null);
    const [openSections, setOpenSections] = useState({});
    const [isReviewMode, setIsReviewMode] = useState(false);

    console.log("activePatient", activePatient);

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
        fetch(APi_URL_UAT + "treatment_information&history_id=" + patientData.history_id + "&clinic_id=" + clinic_id, requestOptions)
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
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        if (!searchCode || searchCode.length < 2) {
            const newFormData = { ...formData };
            newFormData[tab][index].icdOptions = [];
            setFormData(newFormData);
            setText(null);
            return;
        }

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
                    `${APi_URL_UAT}${url}&search=${encodeURIComponent(searchCode)}&clinic_id=${clinic_id}`,
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
        }, 300);
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
        newFormData[tab][index].dosage = meditemData.medusage || "";
        newFormData[tab][index].usage_instruction = meditemData.pack_chg || "";
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
                rx: "meditem",
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
        setIsReviewMode(true);
    };

    const handleEdit = () => {
        setIsReviewMode(false);
    };

    if (!patient_vitals) {
        return <p className="text-center text-gray-500">กำลังโหลดข้อมูล...</p>;
    }

    // Animation variants for the summary container
    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut",
            },
        },
        exit: { opacity: 0, y: -50, transition: { duration: 0.3 } },
    };

    // Animation variants for summary items
    const itemVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: (i) => ({
            opacity: 1,
            scale: 1,
            transition: {
                delay: i * 0.1, // Staggered delay for each item
                duration: 0.3,
                ease: "easeOut",
            },
        }),
    };

    return (
        <div className="container mt-4">
            <style>
                {`
                    :root {
    --primary-color: #1e88e5; /* Bolder blue */
    --primary-light: #bbdefb; /* Lighter blue for backgrounds */
    --accent-color: #26a69a; /* Vibrant teal */
    --warning-color: #ff8f00; /* Bright orange */
    --danger-color: #d32f2f; /* Deep red */
    --text-dark: #263238; /* Darker text for contrast */
    --text-light: #78909c; /* Lighter text for secondary elements */
    --border-color: #90a4ae; /* Darker, more visible border color */
    --shadow-color: rgba(0, 0, 0, 0.2); /* Slightly stronger shadow */
    --bg-light: #ffffff; /* White background */
    --bg-light-hover: #e3f2fd; /* Light hover background */
}

body {
    font-family: 'Nunito', 'Kanit', sans-serif;
    background-color: #f5f7fa;
    color: var(--text-dark);
    line-height: 1.7;
}

/* Main container layout */
.main-container {
    display: flex;
    gap: 24px;
}

.main-content {
    flex: 3;
    padding-right: 20px;
}

.sidebar {
    flex: 1;
    max-width: 360px;
    background: linear-gradient(135deg, #ffffff 0%, #e3f2fd 100%);
    border: 2px solid var(--primary-color); /* Bolder border */
    border-radius: 14px;
    padding: 2rem;
    box-shadow: 0 6px 14px var(--shadow-color);
    position: sticky;
    top: 20px;
    max-height: calc(100vh - 40px);
    overflow-y: auto;
}

.sidebar h5 {
    color: var(--primary-color);
    font-weight: 700;
    font-size: 1.25rem;
    margin-bottom: 1.2rem;
    display: flex;
    align-items: center;
    gap: 0.6rem;
}

.sidebar h5::before {
    content: '•';
    color: var(--accent-color);
    font-size: 1.2rem;
    font-weight: bold;
}

.sidebar ul {
    list-style: none;
    padding: 0;
    margin: 0 0 1.8rem 0;
}

.sidebar ul li {
    font-size: 1rem;
    color: var(--text-dark);
    margin-bottom: 0.6rem;
    display: flex;
    align-items: center;
    gap: 0.6rem;
}

.sidebar ul li::before {
    content: '▸';
    color: var(--primary-color);
    font-size: 0.9rem;
    opacity: 0.7;
}

.sidebar .card {
    background: #ffffff;
    border: 2px solid var(--primary-color); /* Bolder border */
    border-radius: 12px;
    margin-bottom: 1.2rem;
    box-shadow: 0 4px 8px var(--shadow-color);
}

.sidebar .card-body {
    padding: 1.2rem;
}

.sidebar .card-title {
    font-size: 1.1rem;
    color: var(--primary-color);
    font-weight: 600;
}

.sidebar .card-text {
    font-size: 0.95rem;
    color: var(--text-dark);
    opacity: 0.85;
}

/* Summary view styles */
.summary-container {
    background-color: var(--bg-light);
    border: 3px solid var(--primary-color); /* Thicker, more visible border */
    border-radius: 14px;
    padding: 2rem;
    box-shadow: 0 6px 14px var(--shadow-color);
    margin-top: 2rem;
}

.summary-section {
    margin-bottom: 1.8rem;
}

.summary-section h5 {
    color: var(--primary-color);
    font-weight: 700;
    font-size: 1.25rem;
    margin-bottom: 1.2rem;
    display: flex;
    align-items: center;
    gap: 0.6rem;
}

.summary-section h5::before {
    content: '•';
    color: var(--accent-color);
    font-size: 1.2rem;
    font-weight: bold;
}

.summary-item {
    background: #f5f7fa;
    border: 2px solid var(--accent-color); /* Bolder border */
    border-radius: 10px;
    padding: 1.2rem;
    margin-bottom: 1.2rem;
}

.summary-item p {
    font-size: 1rem;
    color: var(--text-dark);
    margin: 0.6rem 0;
    display: flex;
    align-items: center;
    gap: 0.6rem;
}

.summary-item p::before {
    content: '▸';
    color: var(--primary-color);
    font-size: 0.9rem;
    opacity: 0.7;
}

/* Existing styles with enhanced borders */
.alert-danger {
    background: linear-gradient(135deg, #ffffff 0%, #e3f2fd 100%);
    border: 3px solid var(--primary-color); /* Thicker border */
    border-left: 6px solid var(--accent-color); /* Bolder left border */
    box-shadow: 0 8px 22px rgba(30, 136, 229, 0.15);
    margin-bottom: 2.5rem;
    padding: 2rem 2.5rem;
    border-radius: 12px;
    position: relative;
    overflow: hidden;
}

.med-search-item .highlight {
    background-color: #ffee58;
    padding: 3px 5px;
    border-radius: 4px;
    font-weight: 600;
}

.alert-danger::before {
    content: '⚕️';
    position: absolute;
    top: 1.5rem;
    right: 2.5rem;
    font-size: 2.5rem;
    opacity: 0.15;
    transform: rotate(10deg);
}

.alert-danger::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px; /* Slightly thicker top border */
    background: linear-gradient(90deg, var(--primary-color) 0%, var(--accent-color) 100%);
    border-radius: 12px 12px 0 0;
}

.alert-danger h1 {
    color: var(--primary-color);
    margin-bottom: 1rem;
    font-weight: 800;
    font-size: 2rem;
    letter-spacing: -0.5px;
    display: flex;
    align-items: center;
    gap: 0.6rem;
}

.alert-danger h1::before {
    content: '🏥';
    font-size: 1.8rem;
    margin-right: 0.3rem;
}

.alert-danger p {
    color: var(--text-dark);
    line-height: 1.7;
    font-size: 1.1rem;
    margin: 0;
    font-weight: 500;
    opacity: 0.9;
}

.card {
    border: 2px solid var(--primary-color); /* Bolder border */
    border-radius: 14px !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    background: linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%);
    overflow: hidden;
    position: relative;
    box-shadow: 0 4px 12px var(--shadow-color);
}

.card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px; /* Thicker top border */
    background: linear-gradient(90deg, var(--primary-color) 0%, var(--accent-color) 100%);
    opacity: 0.9;
}

.card-body {
    padding: 1.8rem;
    position: relative;
}

.card-body::after {
    content: '👤';
    position: absolute;
    top: 1.2rem;
    right: 1.2rem;
    font-size: 1.8rem;
    opacity: 0.1;
}

.card-title {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: var(--primary-color);
    letter-spacing: -0.3px;
    display: flex;
    align-items: center;
    gap: 0.6rem;
}

.card-title::before {
    content: '•';
    color: var(--accent-color);
    font-size: 1.2rem;
    font-weight: bold;
}

.card-text {
    font-size: 1rem;
    margin-bottom: 0.6rem;
    color: var(--text-dark);
    opacity: 0.9;
    display: flex;
    align-items: center;
    gap: 0.6rem;
}

.card-text:last-child {
    margin-bottom: 0;
}

.card-text::before {
    content: '▸';
    color: var(--primary-color);
    font-size: 0.9rem;
    opacity: 0.7;
}

.card[style*="cursor: pointer"] {
    cursor: pointer;
}

.card[style*="cursor: pointer"]:hover {
    transform: translateY(-6px) scale(1.04);
    box-shadow: 0 14px 32px rgba(30, 136, 229, 0.25); /* Stronger shadow */
}

.text-uppercase.text-primary.font-bold {
    background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.6px;
}

.row {
    display: flex;
    flex-wrap: wrap;
    margin-right: -15px;
    margin-left: -15px;
    gap: 0;
}

.col-md-12 {
    flex: 0 0 100%;
    max-width: 100%;
    padding-right: 15px;
    padding-left: 15px;
}

.mb-3 {
    margin-bottom: 1.8rem !important;
}

.row .col-md-12 .card {
    background: linear-gradient(135deg, #ffffff 0%, #e3f2fd 100%);
}

.card::before {
    content: '';
    position: absolute;
    top: 1.2rem;
    right: 1.2rem;
    width: 24px;
    height: 24px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%231e88e5' opacity='0.15'%3E%3Cpath d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-8.5 12H9v-1.5H7.5V12h1.5v-1.5H10v1.5h1.5V12H10v1.5zm5 0h-3v-1.5h3V15zm0-3h-3v-1.5h3V12zm0-3h-8V7.5h8V9z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-size: contain;
    opacity: 0.15;
}

@media (max-width: 768px) {
    .main-container {
        flex-direction: column;
    }

    .main-content {
        padding-right: 0;
    }

    .sidebar {
        max-width: 100%;
        position: static;
        margin-top: 1.8rem;
        border: 2px solid var(--primary-color); /* Maintain bold border */
    }

    .col-md-12 {
        margin-bottom: 1.2rem;
    }

    .card {
        margin-bottom: 1.8rem;
        border: 2px solid var(--primary-color); /* Maintain bold border */
    }

    .card:hover {
        transform: translateY(-3px) scale(1.02);
    }

    .card-title {
        font-size: 1.15rem;
    }

    .card-text {
        font-size: 0.95rem;
    }

    .alert-danger {
        padding: 1.8rem;
        margin-bottom: 1.8rem;
        border: 2px solid var(--primary-color); /* Thicker border */
    }

    .alert-danger h1 {
        font-size: 1.75rem;
    }

    .alert-danger p {
        font-size: 1rem;
    }

    .summary-section h5 {
        font-size: 1.15rem;
    }

    .summary-item p {
        font-size: 0.95rem;
    }
}

@font-face {
    font-family: 'Kanit';
    src: url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;600&display=swap');
}

.btn-primary {
    background-color: var(--primary-color);
    border: 2px solid var(--primary-color); /* Bolder button border */
    box-shadow: 0 4px 8px rgba(30, 136, 229, 0.15);
    border-radius: 8px;
    padding: 0.6rem 1.5rem;
    font-weight: 600;
}

.btn-primary:hover {
    background-color: #1565c0;
    border: 2px solid #1565c0;
    transform: translateY(-2px);
    box-shadow: 0 6px 10px rgba(30, 136, 229, 0.2);
}

.diagnosis-form {
    background-color: var(--bg-light);
    border: 2px solid var(--primary-color); /* Bolder border */
    border-radius: 10px;
    padding: 1.5rem;
    box-shadow: 0 4px 12px var(--shadow-color);
    margin-top: 1.8rem;
}

.form-group label {
    color: var(--text-dark);
    font-weight: 600;
    margin-bottom: 0.6rem;
    font-size: 0.95rem;
}

.form-control {
    border: 2px solid var(--border-color); /* Thicker border */
    border-radius: 8px;
    padding: 0.7rem;
    font-size: 0.95rem;
}

.form-control:focus {
    border: 2px solid var(--primary-color);
    box-shadow: 0 0 0 0.25rem rgba(30, 136, 229, 0.2); /* Stronger focus shadow */
}

.med-diagnosis-container {
    font-family: 'Prompt', 'Kanit', sans-serif;
    max-width: 1200px;
    margin: 24px 0;
    padding: 24px;
    background-color: #ffffff;
    border: 3px solid var(--primary-color); /* Thicker border */
    border-radius: 10px;
    box-shadow: 0 4px 12px var(--shadow-color);
}

.med-alert-error {
    background-color: #ffffff;
    border: 2px solid var(--danger-color); /* Thicker border */
    border-left: 6px solid var(--danger-color); /* Bolder left border */
    color: var(--text-dark);
    padding: 14px 18px;
    margin-bottom: 24px;
    border-radius: 8px;
    font-weight: 500;
}

.med-fieldset-card {
    border: 2px solid var(--primary-color); /* Bolder border */
    border-radius: 10px;
    margin-bottom: 18px;
    background-color: #ffffff;
    box-shadow: 0 3px 8px var(--shadow-color);
    transition: all 0.3s ease;
}

.med-fieldset-card:hover {
    box-shadow: 0 4px 14px var(--shadow-color);
    border: 2px solid var(--accent-color); /* Bolder hover border */
}

.med-fieldset-header {
    background-color: var(--primary-light);
    color: var(--text-dark);
    padding: 14px 22px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid var(--border-color); /* Thicker border */
    border-radius: 8px 8px 0 0;
    transition: all 0.3s ease;
}

.med-fieldset-header:hover {
    background-color: #90caf9;
}

.med-fieldset-header h5 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
}

.med-fieldset-body {
    padding: 24px;
    background-color: #ffffff;
}

.med-form-card {
    border: 2px solid var(--accent-color); /* Bolder border */
    border-radius: 10px;
    margin-bottom: 18px;
    background-color: #f5f7fa;
    box-shadow: 0 3px 6px var(--shadow-color);
    transition: all 0.3s ease;
    position: relative;
    padding: 24px;
    display: flex;
    flex-direction: column;
}

.med-form-card:hover {
    border: 2px solid var(--primary-color); /* Bolder hover border */
    background-color: #e3f2fd;
}

.med-form-label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: var(--text-dark);
    font-size: 0.95rem;
}

.med-form-input,
.med-form-select {
    width: 100%;
    padding: 12px 14px;
    border: 2px solid var(--border-color); /* Thicker border */
    border-radius: 8px;
    font-size: 0.95rem;
    color: var(--text-dark);
    background-color: #ffffff;
    transition: all 0.3s ease;
}

.med-form-input:focus,
.med-form-select:focus {
    border: 2px solid var(--primary-color);
    outline: none;
    box-shadow: 0 0 0 3px rgba(30, 136, 229, 0.2);
}

.med-form-input:hover,
.med-form-select:hover {
    border: 2px solid var(--primary-light);
    background-color: #f9fafc;
}

.med-btn {
    display: inline-flex;
    align-items: center;
    font-weight: 600;
    padding: 12px 18px;
    font-size: 0.95rem;
    border-radius: 8px;
    border: 2px solid transparent; /* Added border for buttons */
    transition: all 0.3s ease;
    cursor: pointer;
    width: 100%;
    justify-content: center;
}

.med-btn-danger i {
    margin-right: 0;
    font-size: 0.9rem;
}

.med-btn-primary {
    color: #ffffff;
    background-color: var(--primary-color);
    border: 2px solid var(--primary-color); /* Bolder button border */
}

.med-btn-primary:hover {
    background-color: #1565c0;
    border: 2px solid #1565c0;
}

.med-btn-success {
    color: #ffffff;
    background-color: var(--accent-color);
    border: 2px solid var(--accent-color); /* Bolder button border */
}

.med-btn-success:hover {
    background-color: #00897b;
    border: 2px solid #00897b;
}

.med-btn-warning {
    color: #ffffff;
    background-color: var(--warning-color);
    border: 2px solid var(--warning-color); /* Bolder button border */
}

.med-btn-warning:hover {
    background-color: #ef6c00;
    border: 2px solid #ef6c00;
}

.med-btn-danger {
    color: #ffffff;
    background-color: var(--danger-color);
    border: 2px solid var(--danger-color); /* Bolder button border */
    width: auto;
    padding: 10px 18px;
    font-size: 0.95rem;
    align-self: flex-end;
    margin-top: 12px;
}

.med-btn-danger:hover {
    background-color: #b71c1c;
    border: 2px solid #b71c1c;
}

.med-btn-container {
    display: flex;
    gap: 18px;
    margin-top: 24px;
    padding: 18px 0;
    border-top: 2px solid var(--border-color); /* Thicker border */
}

.med-empty-state {
    text-align: center;
    padding: 24px;
    color: var(--text-light);
    font-style: italic;
    background-color: #ffffff;
    border: 2px dashed var(--primary-color); /* Bolder dashed border */
    border-radius: 8px;
    margin: 12px 0;
}

.med-search-list {
    position: absolute;
    z-index: 1000;
    width: 100%;
    max-height: 220px;
    overflow-y: auto;
    background-color: #ffffff;
    border: 2px solid var(--primary-color); /* Bolder border */
    border-radius: 0 0 10px 10px;
    box-shadow: 0 4px 10px var(--shadow-color);
    list-style: none;
    padding: 0;
    margin: 0;
}

.med-search-item {
    padding: 10px 14px;
    border-bottom: 1px solid var(--border-color);
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.3s ease;
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
    margin-right: 10px;
    font-size: 16px;
    opacity: 0.8;
}

.med-diagnosis-container::before {
    content: '';
    display: block;
    height: 5px; /* Thicker top border */
    background: linear-gradient(to right, var(--primary-light), #ffffff);
    margin-bottom: 24px;
    border-radius: 8px 8px 0 0;
}

@media screen and (max-width: 768px) {
    .med-diagnosis-container {
        padding: 18px;
        margin: 12px;
        border: 2px solid var(--primary-color); /* Maintain bold border */
    }

    .med-btn-container {
        flex-direction: column;
        gap: 12px;
    }

    .med-btn-container .col-md-6 {
        width: 100%;
        margin-bottom: 12px;
    }

    .med-btn {
        width: 100%;
        border: 2px solid; /* Ensure buttons have borders */
    }

    .med-form-input,
    .med-form-select {
        font-size: 0.9rem;
        padding: 10px 14px;
        border: 2px solid var(--border-color); /* Thicker border */
    }

    .med-form-label {
        font-size: 0.9rem;
    }
}
                `}
            </style>
            <div className="alert alert-danger" role="alert">
                <h1 className="text-2xl font-bold">แพทย์ตรวจโรค</h1>
                <p>หน้าวินิจฉัยโรค (ระบบแพทย์ตรวจโรค) หากรายการใดไม่มีการตรวจหรือข้อมูล ให้ลบรายการออก หากมีมากกว่า 1 รายการ ให้กดปุ่มเพิ่มรายการใหม่</p>
            </div>

            <div className="main-container">
                <div className="main-content">
                    <div className="row">
                        <div className="col-md-12 mb-3">
                            <div className="card shadow-lg rounded-4 border-light hover:shadow-xl transition-transform transform hover:scale-105">
                                <div className="card-body">
                                    <h5 className="card-title text-uppercase text-primary font-bold">{patientData.thai_firstname} {patientData.thai_lastname}</h5>
                                    <p className="card-text text-muted">เลขผู้ป่วย: {patientData.hn_patient_id}</p>
                                    <p className="card-text text-muted">คิวที่: {patientData.queue_number}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="med-diagnosis-container">
                        {Text && (
                            <div className="med-alert-error" role="alert">
                                {Text}
                            </div>
                        )}
                        <AnimatePresence>
                            {isReviewMode && (
                                <motion.div
                                    className="summary-container"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                >
                                    <h4 className="text-primary font-bold mb-4">สรุปข้อมูลที่บันทึก</h4>
                                    {Object.keys(formData).map((tab, index) => (
                                        formData[tab].length > 0 && (
                                            <div key={index} className="summary-section">
                                                <h5>{tab.toUpperCase()}</h5>
                                                {formData[tab].map((item, itemIndex) => (
                                                    <motion.div
                                                        key={itemIndex}
                                                        className="summary-item"
                                                        variants={itemVariants}
                                                        initial="hidden"
                                                        animate="visible"
                                                        custom={itemIndex}
                                                    >
                                                        {tab === "cc" && item.description && (
                                                            <p><strong>รายละเอียด:</strong> {item.description}</p>
                                                        )}
                                                        {tab === "pi" && item.description && (
                                                            <p><strong>รายละเอียด:</strong> {item.description}</p>
                                                        )}
                                                        {tab === "ph" && item.description && (
                                                            <p><strong>รายละเอียด:</strong> {item.description}</p>
                                                        )}
                                                        {tab === "pe" && (
                                                            <>
                                                                {item.description && <p><strong>รายละเอียด:</strong> {item.description}</p>}
                                                                {item.price && <p><strong>ราคา:</strong> {item.price}</p>}
                                                            </>
                                                        )}
                                                        {tab === "prx" && (
                                                            <>
                                                                {item.procedure_name && <p><strong>รายการ:</strong> {item.procedure_name}</p>}
                                                                {item.quantity && <p><strong>จำนวน:</strong> {item.quantity}</p>}
                                                                {item.price && <p><strong>ราคาต่อหน่วย:</strong> {item.price}</p>}
                                                            </>
                                                        )}
                                                        {tab === "fu" && (
                                                            <>
                                                                {item.date && <p><strong>วันที่นัด:</strong> {item.date}</p>}
                                                                {item.time && <p><strong>เวลานัด:</strong> {item.time}</p>}
                                                                {item.details && <p><strong>รายละเอียด:</strong> {item.details}</p>}
                                                            </>
                                                        )}
                                                        {tab === "dx" && (
                                                            <>
                                                                {item.code && <p><strong>รหัสโรค:</strong> {item.code}</p>}
                                                                {item.description && <p><strong>ชื่อโรค:</strong> {item.description}</p>}
                                                            </>
                                                        )}
                                                        {tab === "rx" && (
                                                            <>
                                                                {item.medicine_name && <p><strong>รายการยา:</strong> {item.medicine_name}</p>}
                                                                {item.dosage && <p><strong>รหัสวิธีใช้:</strong> {item.dosage}</p>}
                                                                {item.usage_instruction && <p><strong>วิธีการใช้:</strong> {item.usage_instruction}</p>}
                                                                {item.quantity && <p><strong>จำนวน:</strong> {item.quantity}</p>}
                                                                {item.price && <p><strong>ราคา/หน่วย:</strong> {item.price}</p>}
                                                            </>
                                                        )}
                                                        {tab === "lab_results" && (
                                                            <>
                                                                {item.test_name && <p><strong>รายการ:</strong> {item.test_name}</p>}
                                                                {item.result_value && <p><strong>ผล:</strong> {item.result_value}</p>}
                                                                {item.status_sen && <p><strong>สถานะ:</strong> {item.status_sen}</p>}
                                                                {item.price && <p><strong>ราคา:</strong> {item.price}</p>}
                                                            </>
                                                        )}
                                                        {tab === "xr_results" && (
                                                            <>
                                                                {item.description && <p><strong>รายการ:</strong> {item.description}</p>}
                                                                {item.price && <p><strong>ราคา:</strong> {item.price}</p>}
                                                            </>
                                                        )}
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )
                                    ))}
                                    <div className="med-btn-container">
                                        <div className="col-md-6">
                                            <button
                                                type="button"
                                                className="med-btn med-btn-warning"
                                                onClick={handleEdit}
                                            >
                                                <i className="bi bi-pencil-square"></i> แก้ไขข้อมูล
                                            </button>
                                        </div>
                                        <div className="col-md-6">
                                            <button
                                                type="button"
                                                className="med-btn med-btn-success"
                                                onClick={() => Update(patientData.queue_id)}
                                            >
                                                <i className="bi bi-send"></i> ยืนยันการส่งข้อมูล
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        {!isReviewMode && (
                            <>
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
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {activePatient && (
                    <div className="sidebar">
                        <h5>{patientData.hn_patient_id} - {patientData.thai_firstname} {patientData.thai_lastname}</h5>
                        <h5>Vital Signs</h5>
                        {patient_vitals?.details?.patient_vitals?.map((vital, index) => (
                            <ul key={index}>
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
                        <h5>Drug Allergies</h5>
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
                    </div>
                )}
            </div>
        </div>
    );
};

export default Pat_checks_fordisease_create_Beam;