
import { React, useState, useEffect, Fragment } from "react";
import './c.css';
import { APi_URL_UAT } from "../../auth/config";
import { useLocation, useNavigate } from "react-router-dom"
import { Modal, Button, Card } from 'react-bootstrap';

import Swal from 'sweetalert2';
import "bootstrap-icons/font/bootstrap-icons.css";

import DisplayData from "./DisplayData3";

import 'bootstrap/dist/css/bootstrap.min.css';

const Pat_checks_fordisease_create_admin3 = ({ handleLogout }) => {

    const getCurrentDateAndTime = () => {
        const currentDate = new Date();
        const date = currentDate.toISOString().split("T")[0]; // วันในรูปแบบ YYYY-MM-DD
        const time = currentDate.toISOString().split("T")[1].substring(0, 5); // เวลาในรูปแบบ HH:MM
        return { date, time };
    };
    const navigate = useNavigate();
    const location = useLocation();
    const patientData = location.state || {}; // รับค่าที่ส่งมาจาก Link
    const apiKey = localStorage.getItem("token"); // ใส่ API Key ที่นี่
    const clinic_id = localStorage.getItem("clinic_id"); // ใส่ API Key ที่นี่
    const [showModal, setShowModal] = useState(false);  // สำหรับเปิด/ปิด Modal
    const [activePatient, setActivePatient] = useState(null);  // เก็บข้อมูลผู้ป่วยที่เลือก
    const [Text, setText] = useState(null);  // เก็บข้อมูลผู้ป่วยที่เลือก
    const [patient_vitals, setPatientVitals] = useState({});

    console.log("patientData", patientData);

    useEffect(() => {
        DrugAllergies();
        treatment_information();
    }, []);
    const [savedData, setSavedData] = useState(null);

    // api แพ้ยาผู้ป่วย
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
                console.log('Status Code:', response.status); // ดูว่าได้ 401 จริงไหม
                if (response.status === 401) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Token! หมดอายุ',
                        text: 'กรุณาเข้าสู่ระบบใหม่',
                        confirmButtonText: 'ออกจากระบบ'
                    }).then(() => {
                        handleLogout()
                    });
                }
                return response.json();
            })
            .then((result) => {
                setActivePatient(result.data);

            })
            .catch((error) => console.error(error));
    }
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
                console.log('Status Code:', response.status); // ดูว่าได้ 401 จริงไหม
                if (response.status === 401) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Token! หมดอายุ',
                        text: 'กรุณาเข้าสู่ระบบใหม่',
                        confirmButtonText: 'ออกจากระบบ'
                    }).then(() => {
                        handleLogout()
                    });
                }
                return response.json();
            })
            .then((result) => {
                setPatientVitals(result.data);

            })
            .catch((error) => console.error(error));
    }


    const initialState = {
        emp: [],
        cc: [],  // เปลี่ยนเป็นอาร์เรย์เปล่า
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
    const [activeTab, setActiveTab] = useState("emp");


    const Update = async (id) => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-API-KEY", apiKey);
        console.log(id)
        const raw = JSON.stringify({
            "queue_id": id
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch(APi_URL_UAT + "update", requestOptions)
            .then((response) => {
                console.log('Status Code:', response.status); // ดูว่าได้ 401 จริงไหม
                if (response.status === 401) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Token! หมดอายุ',
                        text: 'กรุณาเข้าสู่ระบบใหม่',
                        confirmButtonText: 'ออกจากระบบ'
                    }).then(() => {
                        handleLogout()
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
                console.error(error)
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
        console.log(raw);
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch(APi_URL_UAT + "Pat_checks_fordisease", requestOptions)
            .then((response) => {
                console.log('Status Code:', response.status); // ดูว่าได้ 401 จริงไหม
                if (response.status === 401) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Token! หมดอายุ',
                        text: 'กรุณาเข้าสู่ระบบใหม่',
                        confirmButtonText: 'ออกจากระบบ'
                    }).then(() => {
                        handleLogout()
                    });
                }
                return response.json();
            })
            .then((result) => {
                if (result["success"] === true) {
                    Swal.fire({
                        icon: 'success', // ไอคอนแจ้งเตือน (success, error, warning, info, question)
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
    }

    const handSearch = async (tab, index, searchCode, url) => {
        try {
            const myHeaders = new Headers();
            myHeaders.append("X-API-KEY", apiKey);

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow",
            };

            const response = await fetch(
                `${APi_URL_UAT}${url}&search=${searchCode}`,
                requestOptions
            );

            const result = await response.json();
            const newFormData = { ...formData };

            if (result.success && result.data.length > 0) {
                newFormData[tab][index].icdOptions = result.data;
                setFormData(newFormData);
                setText(null);
            } else {
                // ✅ เคลียร์ dropdown ด้วย
                newFormData[tab][index].icdOptions = [];
                setFormData(newFormData);

                setText("ไม่พบข้อมูลที่ค้นหา");
                console.warn("ไม่พบข้อมูลที่ค้นหา");
            }
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการค้นหาข้อมูล ICD10:", error);
        }
    };

    const handleICDSelect = (tab, index, icdData) => {

        const newFormData = { ...formData };
        newFormData[tab][index].code = icdData.icd10 || "";
        newFormData[tab][index].description = icdData.icd10name || "";
        newFormData[tab][index].icd_id = icdData.id || "";
        newFormData[tab][index].icdOptions = []; // เคลียร์รายการเมื่อเลือกแล้ว
        setFormData(newFormData);
    };
    const handleMeditemSelect = (tab, index, meditemData) => {
        const newFormData = { ...formData };
        newFormData[tab][index].medicine_name = meditemData.name || "";
        newFormData[tab][index].dosage = meditemData.medusage || "";
        newFormData[tab][index].meditem_id = meditemData.meditem_id || "";
        newFormData[tab][index].price = meditemData.price || "";
        newFormData[tab][index].icdOptions = []; // เคลียร์รายการเมื่อเลือกแล้ว
        setFormData(newFormData);
    };
    const handPrxSelect = (tab, index, PrxData) => {
        const newFormData = { ...formData };
        newFormData[tab][index].procedure_name = PrxData.nameprcd || "";
        newFormData[tab][index].price = PrxData.priceprcd || "";
        newFormData[tab][index].prcd_id = PrxData.id || "";
        newFormData[tab][index].icdOptions = []; // เคลียร์รายการเมื่อเลือกแล้ว
        setFormData(newFormData);
    };
    const handLabelect = (tab, index, LabData) => {
        const newFormData = { ...formData };
        newFormData[tab][index].test_name = LabData.labname || "";
        newFormData[tab][index].price = LabData.pricelab || "";
        newFormData[tab][index].lab_data_id = LabData.id_lap || "";
        newFormData[tab][index].icdOptions = []; // เคลียร์รายการเมื่อเลือกแล้ว
        setFormData(newFormData);
    };
    const handRxayelect = (tab, index, RxayData) => {
        const newFormData = { ...formData };
        newFormData[tab][index].description = RxayData.xryname || "";
        newFormData[tab][index].price = RxayData.pricexry || "";
        newFormData[tab][index].rxay_id = RxayData.id || "";
        newFormData[tab][index].icdOptions = []; // เคลียร์รายการเมื่อเลือกแล้ว
        setFormData(newFormData);
    };


    const handleChange = (tab, index, field, value) => {
        const newFormData = { ...formData };
        newFormData[tab][index][field] = value;
        setFormData(newFormData);
    };

    const handleAddForm = (tab) => {
        const newFormData = { ...formData };

        const newForm =
            tab === "fu"
                ? {
                    hn_patient_id: patientData.hn_patient_id,
                    appointment_date: getCurrentDateAndTime().date,
                    details: "",
                    date: "",
                    time: "",
                    treatment_history_id: patientData.history_id,
                    clinic_id: clinic_id
                }
                : tab === "lab_results"
                    ? {
                        hn_patient_id: patientData.hn_patient_id,
                        test_name: "",
                        result_value: "",
                        price: "",
                        status_sen: "",
                        lab_data_id: "",
                        treatment_history_id: patientData.history_id,
                        clinic_id: clinic_id
                    }
                    : tab === "xr_results"
                        ? {
                            hn_patient_id: patientData.hn_patient_id,
                            description: "",
                            price: "",
                            rxay_id: "",
                            treatment_history_id: patientData.history_id,
                            clinic_id: clinic_id
                        }
                        : tab === "cc"
                            ? {
                                hn_patient_id: patientData.hn_patient_id,
                                description: "",
                                treatment_history_id: patientData.history_id,
                                clinic_id: clinic_id
                            }
                            : tab === "pi"
                                ? {
                                    hn_patient_id: patientData.hn_patient_id,
                                    description: "",
                                    treatment_history_id: patientData.history_id,
                                    clinic_id: clinic_id
                                }
                                : tab === "ph"
                                    ? { hn_patient_id: patientData.hn_patient_id, description: "", treatment_history_id: patientData.history_id, clinic_id: clinic_id }
                                    : tab === "pe"
                                        ? { hn_patient_id: patientData.hn_patient_id, description: "", price: "80.00", treatment_history_id: patientData.history_id, clinic_id: clinic_id }
                                        : tab === "prx"
                                            ? { hn_patient_id: patientData.hn_patient_id, procedure_name: "", quantity: "", price: "", prcd_id: "", treatment_history_id: patientData.history_id, clinic_id: clinic_id }
                                            : tab === "dx"
                                                ? {
                                                    hn_patient_id: patientData.hn_patient_id,
                                                    code: "",
                                                    description: "",
                                                    icd_id: "",
                                                    treatment_history_id: patientData.history_id,
                                                    clinic_id: clinic_id
                                                }
                                                : tab === "rx"
                                                    ? {
                                                        hn_patient_id: patientData.hn_patient_id,
                                                        medicine_name: "",
                                                        dosage: "",
                                                        usage_instruction: "",
                                                        quantity: "",
                                                        price: "",
                                                        meditem_id: "",
                                                        treatment_history_id: patientData.history_id,
                                                        clinic_id: clinic_id
                                                    }
                                                    : {};

        console.log(newForm);
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

    // ฟังก์ชันที่ใช้เปิด Modal
    const handleCardClick = () => {
        setShowModal(true);  // เปิด Modal
    };

    // ฟังก์ชันที่ใช้ปิด Modal
    const handleClose = () => setShowModal(false);
    const cardStyle = {
        cursor: 'pointer',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    };

    if (!patient_vitals) {
        return <p>กำลังโหลดข้อมูล...</p>;
    }

    const getIconForTab = (tab) => {
        switch (tab) {
            case 'cc': return 'chat-dots';
            case 'pi': return 'info-circle';
            case 'ph': return 'clock-history';
            case 'pe': return 'clipboard2-pulse';
            case 'prx': return 'activity';
            case 'fu': return 'calendar-check';
            case 'dx': return 'file-medical';
            case 'rx': return 'capsule';
            case 'lab_results': return 'flask';
            case 'xr_results': return 'image';
            default: return 'circle';
        }
    };

    return (

        <>
            <style>{`
    @media (min-width: 1400px) {
      .col-xxl-1-5 {
        flex: 0 0 auto;
        width: 12.5%;
      }
    }
  `}</style>
            <div className="">
                <div className="container-fluid mt-2">
                    {/* Alert Section */}
                    <div className="rounded-4 overflow-hidden border shadow-sm mb-3">
                        <div className="d-flex align-items-center bg-light px-4 py-2">
                            <i className="bi bi-clipboard2-pulse fs-3 text-primary me-3"></i>
                            <h4 className="fw-bold mb-0 text-primary">ระบบแพทย์ตรวจโรค</h4>
                        </div>

                        {/* <div className="bg-warning bg-opacity-25 px-4 py-2 d-flex align-items-center gap-2 rounded-3">
                            <i className="bi bi-exclamation-triangle-fill text-warning fs-6"></i>
                            <p className="mb-0 text-dark fs-15">
                                หากไม่มีการตรวจหรือไม่มีข้อมูล ให้ลบรายการออก — หากมีหลายรายการ กรุณากด <strong>“เพิ่มรายการใหม่”</strong> เพื่อแยกการวินิจฉัย
                            </p>
                        </div> */}
                    </div>

                    {
                        console.log("activePatient ", activePatient)
                    }
                    {activePatient && (
                        <div className="card border-0 shadow rounded-4 bg-light-subtle mb-3">
                            <div className="card-body p-3">
                                {/* Header */}
                                <div className="d-flex align-items-center gap-2 mb-3">
                                    <div
                                        className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center shadow"
                                        style={{ width: 48, height: 48 }}
                                    >
                                        <i className="bi bi-person-circle fs-5"></i>
                                    </div>
                                    <div className="flex-grow-1">
                                        <h6 className="text-primary fw-semibold mb-1">
                                            {patientData.thai_firstname} {patientData.thai_lastname}
                                        </h6>
                                        <div className="d-flex flex-wrap align-items-center gap-2 fs-8 text-muted">
                                            <span className="badge text-bg-primary bg-opacity-75 px-2 py-1">
                                                <i className="bi bi-hash me-1"></i>คิว: {patientData.queue_number}
                                            </span>
                                            <span><i className="bi bi-fingerprint me-1"></i>HN: {patientData.hn_patient_id}</span>
                                        </div>
                                    </div>
                                </div>

                                {console.log("patient_vitals ", patient_vitals)}
                                {/* Vital Signs */}
                                {patient_vitals?.details?.patient_vitals?.map((vital, index) => (
                                    <div className="mb-2" key={index}>
                                        <div className="row g-1">
                                            {[
                                                // --- Vital Signs ---
                                                { label: "น้ำหนัก", value: `${vital.bw} kg`, icon: "bi-weight", color: "info" },
                                                { label: "ส่วนสูง", value: `${vital.height} cm`, icon: "bi-rulers", color: "info" },
                                                { label: "BMI", value: vital.bmi, icon: "bi-bar-chart-steps", color: "info" },
                                                { label: "อุณหภูมิ", value: `${vital.temp}°C`, icon: "bi-thermometer-half", color: "info" },
                                                { label: "ชีพจร", value: `${vital.pulse} bpm`, icon: "bi-heart-fill", color: "info" },
                                                { label: "หายใจ", value: `${vital.respiration} ครั้ง/นาที`, icon: "bi-wind", color: "info" },
                                                { label: "ความดัน", value: `${vital.bp_systolic}/${vital.bp_diastolic}`, icon: "bi-speedometer", color: "info" },
                                                { label: "GFR", value: vital.gfr_status || "–", icon: "bi-droplet-half", color: "info" },

                                                // --- Screening ---
                                                { label: "ตา", value: vital.eye_exam || "–", icon: "bi-eye", color: "secondary" },
                                                { label: "วัณโรค", value: vital.tb_status || "–", icon: "bi-shield-check", color: "secondary" },
                                                { label: "แอลกอฮอล์", value: vital.alcohol_status || "–", icon: "bi-cup-straw", color: "secondary" },
                                                { label: "สูบบุหรี่", value: vital.smoking_status || "–", icon: "bi-fire", color: "secondary" },
                                                { label: "ตั้งครรภ์", value: vital.pregnancy_status || "–", icon: "bi-gender-female", color: "secondary" },
                                                { label: "เหตุผล", value: vital.visit_reason || "–", icon: "bi-question-circle", color: "secondary" },
                                                { label: "คัดกรอง", value: vital.screening || "–", icon: "bi-ui-checks", color: "secondary" },
                                                { label: "แพ้ยา", value: vital.drug_allergy || "–", icon: "bi-capsule", color: "danger" },
                                            ].map((item, i) => (
                                                <div className="col-6 col-sm-4 col-md-2 col-xxl-1-5" key={i}>
                                                    <div className={`card border border-${item.color}-subtle shadow-sm rounded-3 text-center py-2 px-1 bg-white h-100`}>
                                                        <i className={`bi ${item.icon} fs-6 text-${item.color}`}></i>
                                                        <div className="fw-semibold small">{item.label}</div>
                                                        <div className="text-muted" style={{ fontSize: "0.75rem" }}>{item.value}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}


                                {/* Drug Allergies */}
                                <div className="mt-3">
                                    <div className="fw-bold text-danger  mb-2 d-flex align-items-center">
                                        <i className="bi bi-capsule me-2"></i>ประวัติแพ้ยา
                                    </div>
                                    {activePatient.drug_allergies.length > 0 ? (
                                        <div className="row g-2">
                                            {activePatient.drug_allergies.map((allergy, index) => (
                                                <div className="col-md-6 col-lg-4" key={index}>
                                                    <div className="card border border-danger-subtle shadow-sm rounded-3 bg-white h-100 p-2">
                                                        <div className="fw-bold text-danger small mb-1">
                                                            <i className="bi bi-exclamation-circle me-1"></i>
                                                            {allergy.med_name} ({allergy.drug_code})
                                                        </div>
                                                        <div className="small text-muted" style={{ fontSize: "0.85rem" }}>
                                                            <div><strong>รายละเอียด:</strong> {allergy.details}</div>
                                                            <div><strong>ระดับ:</strong> {allergy.severity_description}</div>
                                                            <div><strong>อาการ:</strong> {allergy.allergy_name}</div>
                                                            <div><strong>แหล่ง:</strong> {allergy.history_source_name}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="alert alert-light border text-center py-2 small">
                                            <i className="bi bi-info-circle me-1"></i> ไม่พบข้อมูลแพ้ยา
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-warning bg-opacity-25 px-4 py-2 d-flex align-items-center gap-2 rounded-3">
                        <i className="bi bi-exclamation-triangle-fill text-warning"></i>
                        <p style={
                            {
                                fontSize: "0.75rem",
                                margin: "0",
                                padding: "0",
                            }

                        } small className="mb-0 text-dark">
                            หากไม่มีการตรวจหรือไม่มีข้อมูล ให้ลบรายการออก — หากมีหลายรายการ กรุณากด <strong>“เพิ่มรายการใหม่”</strong> เพื่อแยกการวินิจฉัย
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="card shadow rounded-4 border-0 mb-4">
                        <div className="card-body py-3 px-2">
                            <div className="nav nav-pills row g-2 justify-content-center">
                                {Object.keys(initialState)
                                    .filter(tab => tab !== "emp")
                                    .map((tab, index) => (
                                        <div className="col-6 col-sm-4 col-md-3 col-lg-2 col-xxl-1-10" key={index}>
                                            <button
                                                onClick={() => setActiveTab(tab)}
                                                className={`nav-link w-100 py-2 px-2 d-flex flex-column align-items-center justify-content-center gap-1
                rounded-4 fw-medium text-uppercase
                ${activeTab === tab
                                                        ? "bg-primary text-white shadow-sm"
                                                        : "bg-white text-dark border border-primary-subtle hover-tab"}`}
                                                style={{
                                                    transition: 'all 0.2s ease',
                                                    fontSize: '0.75rem',
                                                    lineHeight: '1.1',
                                                    minHeight: '80px'
                                                }}
                                            >
                                                <i className={`bi bi-${getIconForTab(tab)} fs-5`}></i>
                                                <span className="text-nowrap">{tab}</span>
                                            </button>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                    <style>{`
                    @media (min-width: 1400px) {
                        .col-xxl-1-10 {
                        flex: 0 0 auto;
                        width: 10%;
                        }
                    }
                    `}
                    </style>

                </div>

                {/* Form Content */}
                <div className="tab-content">
                    <div className="tab-pane fade show active">
                        <div className="mt-3">
                            <>


                                <Modal
                                    className="modal-xl fade shadow-sm"
                                    show={activeTab !== "emp"}
                                    onHide={() => setActiveTab("emp")}
                                >
                                    <Modal.Header>
                                        <div closeButton className="bg-gradient text-primary">
                                            <div>
                                                <i className="bi bi-clipboard2-pulse me-2"></i>
                                                ข้อมูลการวินิจฉัย - {activeTab.toUpperCase()}
                                            </div>
                                        </div>
                                    </Modal.Header>

                                    <Modal.Body>

                                        {formData[activeTab].map((form, index) => (
                                            <div key={index} className="card shadow border-0 rounded-4">
                                                <div className="card-body">
                                                    <div className="row">
                                                        {activeTab === "cc" && (
                                                            <>
                                                                <div className="">
                                                                    <label className="form-label">รายการ/รายละอียด (CC)</label>
                                                                    <input
                                                                        type="text"
                                                                        value={form.description}
                                                                        onChange={(e) => handleChange(activeTab, index, "description", e.target.value)}
                                                                        className="form-control" />
                                                                </div>


                                                            </>
                                                        )}
                                                        {activeTab === "pi" && (
                                                            <>
                                                                <div className="">
                                                                    <label className="form-label">รายการ/รายละอียด (PI)</label>
                                                                    <input
                                                                        type="text"
                                                                        value={form.description}
                                                                        onChange={(e) => handleChange(activeTab, index, "description", e.target.value)}
                                                                        className="form-control" />
                                                                </div>
                                                            </>
                                                        )}
                                                        {activeTab === "ph" && (
                                                            <>
                                                                <div className="">
                                                                    <label className="form-label">รายการ/รายละอียด (PH)</label>
                                                                    <input
                                                                        type="text"
                                                                        value={form.description}
                                                                        onChange={(e) => handleChange(activeTab, index, "description", e.target.value)}
                                                                        className="form-control" />
                                                                </div>


                                                            </>
                                                        )}
                                                        {activeTab === "pe" && (
                                                            <>
                                                                <div className="row">
                                                                    <div className="col-md-8">
                                                                        <div className="">
                                                                            <label className="form-label">รายการ/รายละอียด (PE)</label>
                                                                            <input
                                                                                type="text"
                                                                                value={form.description}
                                                                                onChange={(e) => handleChange(activeTab, index, "description", e.target.value)}
                                                                                className="form-control" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-4">
                                                                        <div className="mt-2">
                                                                            <label className="form-label">ราคา (PE)</label>
                                                                            <input
                                                                                type="number"
                                                                                value={form.price}
                                                                                onChange={(e) => handleChange(activeTab, index, "price", e.target.value)}
                                                                                className="form-control" />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        )}

                                                        {activeTab === "prx" && (
                                                            <>
                                                                {/* ซ่อน ID */}
                                                                <input
                                                                    type="text"
                                                                    value={form.prcd_id}
                                                                    onChange={(e) =>
                                                                        handleChange(activeTab, index, "prcd_id", e.target.value)
                                                                    }
                                                                    className="form-control"
                                                                    style={{ display: "none" }}
                                                                />

                                                                <div className="row">
                                                                    {/* Auto-complete Search */}
                                                                    <div className="col-md-6 position-relative">
                                                                        <div className="mt-2">
                                                                            <label className="form-label fw-semibold">เลือกรายการ (PRX)</label>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control shadow-sm"
                                                                                value={form.procedure_name}
                                                                                onChange={(e) => {
                                                                                    const value = e.target.value;
                                                                                    handleChange(activeTab, index, "procedure_name", value);

                                                                                    if (value.trim() === "") {
                                                                                        // ล้างข้อมูลอัตโนมัติเมื่อช่องค้นหาถูกลบ
                                                                                        const newFormData = { ...formData };
                                                                                        newFormData[activeTab][index] = {
                                                                                            ...newFormData[activeTab][index],
                                                                                            procedure_name: "",
                                                                                            prcd_id: "",
                                                                                            quantity: "",
                                                                                            price: "",
                                                                                            icdOptions: [],
                                                                                        };
                                                                                        setFormData(newFormData);
                                                                                        setText(null);
                                                                                    } else {
                                                                                        handSearch(activeTab, index, value, "list_prcd");
                                                                                    }
                                                                                }}
                                                                                placeholder=""
                                                                            />
                                                                        </div>

                                                                        {/* แสดงรายการที่ค้นหาเจอ */}
                                                                        {form.procedure_name.trim().length > 0 &&
                                                                            form.icdOptions &&
                                                                            form.icdOptions.length > 0 && (
                                                                                <ul className="list-group position-absolute w-100 shadow-sm rounded mt-1 z-3">
                                                                                    {form.icdOptions.map((prx) => (
                                                                                        <li
                                                                                            key={prx.id}
                                                                                            className="list-group-item list-group-item-action"
                                                                                            onMouseDown={() => handPrxSelect(activeTab, index, prx)}
                                                                                        >
                                                                                            {prx.nameprcd} - {prx.code} ({prx.price} บาท)
                                                                                        </li>
                                                                                    ))}
                                                                                </ul>
                                                                            )}

                                                                        {/* (ออปชัน) แสดงข้อความไม่พบ */}
                                                                        {form.procedure_name.trim().length > 0 &&
                                                                            form.icdOptions &&
                                                                            form.icdOptions.length === 0 &&
                                                                            Text && (
                                                                                <ul className="list-group position-absolute w-100 shadow-sm rounded mt-1 z-3">
                                                                                    <li className="list-group-item text-center text-muted" disabled>
                                                                                        {Text}
                                                                                    </li>
                                                                                </ul>
                                                                            )}
                                                                    </div>

                                                                    {/* Quantity */}
                                                                    <div className="col-md-3">
                                                                        <div className="mt-2">
                                                                            <label className="form-label fw-semibold">จำนวน</label>
                                                                            <input
                                                                                type="number"
                                                                                value={form.quantity}
                                                                                onChange={(e) =>
                                                                                    handleChange(activeTab, index, "quantity", e.target.value)
                                                                                }
                                                                                className="form-control shadow-sm"
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    {/* Price */}
                                                                    <div className="col-md-3">
                                                                        <div className="mt-2">
                                                                            <label className="form-label fw-semibold">ราคาต่อหน่วย</label>
                                                                            <input
                                                                                type="number"
                                                                                value={form.price}
                                                                                onChange={(e) =>
                                                                                    handleChange(activeTab, index, "price", e.target.value)
                                                                                }
                                                                                className="form-control shadow-sm"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        )}


                                                        {activeTab === "fu" && (
                                                            <>
                                                                <div className="mt-2">
                                                                    <label className="form-label">วันที่นัด</label>
                                                                    <input
                                                                        type="date"
                                                                        value={form.date}
                                                                        onChange={(e) => handleChange(activeTab, index, "date", e.target.value)}
                                                                        className="form-control" />
                                                                </div>
                                                                <div className="mt-2">
                                                                    <label className="form-label">รายละอียดการนัด</label>
                                                                    <input
                                                                        type="text"
                                                                        value={form.details}
                                                                        onChange={(e) => handleChange(activeTab, index, "details", e.target.value)}
                                                                        className="form-control" />
                                                                </div>
                                                                <div className="mt-2">
                                                                    <label className="form-label">เวลานัด</label>
                                                                    <input
                                                                        type="time"
                                                                        value={form.time}
                                                                        onChange={(e) => handleChange(activeTab, index, "time", e.target.value)}
                                                                        className="form-control" />
                                                                </div>
                                                            </>
                                                        )}

                                                        {activeTab === "dx" && (
                                                            <>
                                                                {/* ซ่อน icd_id */}
                                                                <input
                                                                    type="text"
                                                                    value={form.icd_id}
                                                                    onChange={(e) =>
                                                                        handleChange(activeTab, index, "icd_id", e.target.value)
                                                                    }
                                                                    className="form-control"
                                                                    style={{ display: "none" }}
                                                                />

                                                                <div className="row">
                                                                    {/* รหัสโรค */}
                                                                    <div className="col-md-3">
                                                                        <div className="mt-2 position-relative">
                                                                            <label className="form-label">รหัสโรค (DX)</label>
                                                                            <input
                                                                                type="text"
                                                                                value={form.code}
                                                                                onChange={(e) => {
                                                                                    const value = e.target.value;
                                                                                    handleChange(activeTab, index, "code", value);

                                                                                    if (value.trim() === "") {
                                                                                        // เคลียร์ข้อมูลเมื่อ input ว่าง
                                                                                        const newFormData = { ...formData };
                                                                                        newFormData[activeTab][index] = {
                                                                                            ...newFormData[activeTab][index],
                                                                                            code: "",
                                                                                            description: "",
                                                                                            icd_id: "",
                                                                                            icdOptions: [],
                                                                                        };
                                                                                        setFormData(newFormData);
                                                                                        setText(null);
                                                                                    } else {
                                                                                        handSearch(activeTab, index, value, "list_icd");
                                                                                    }
                                                                                }}
                                                                                placeholder=""
                                                                                className="form-control"
                                                                            />

                                                                            {/* แสดงผลลัพธ์ที่ค้นหาเจอ */}
                                                                            {form.code.trim().length > 0 &&
                                                                                form.icdOptions &&
                                                                                form.icdOptions.length > 0 && (
                                                                                    <ul className="list-group position-absolute w-100 shadow-sm rounded mt-1 z-3">
                                                                                        {form.icdOptions.map((icd) => (
                                                                                            <li
                                                                                                key={icd.id}
                                                                                                className="list-group-item list-group-item-action"
                                                                                                onMouseDown={() => handleICDSelect(activeTab, index, icd)}
                                                                                            >
                                                                                                {icd.icd10} - {icd.name_t} - {icd.icd10name}
                                                                                            </li>
                                                                                        ))}
                                                                                    </ul>
                                                                                )}

                                                                            {/* (ออปชัน) แสดงข้อความไม่พบ */}
                                                                            {form.code.trim().length > 0 &&
                                                                                form.icdOptions &&
                                                                                form.icdOptions.length === 0 &&
                                                                                Text && (
                                                                                    <ul className="list-group position-absolute w-100 shadow-sm rounded mt-1 z-3">
                                                                                        <li className="list-group-item text-center text-muted" disabled>
                                                                                            {Text}
                                                                                        </li>
                                                                                    </ul>
                                                                                )}
                                                                        </div>
                                                                    </div>

                                                                    {/* ชื่อโรค */}
                                                                    <div className="col-md-9">
                                                                        <div className="mt-2">
                                                                            <label className="form-label">ชื่อโรค (DX)</label>
                                                                            <input
                                                                                type="text"
                                                                                value={form.description}
                                                                                onChange={(e) =>
                                                                                    handleChange(activeTab, index, "description", e.target.value)
                                                                                }
                                                                                className="form-control"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        )}

                                                        {activeTab === "rx" && (
                                                            <>
                                                                {/* ซ่อน meditem_id */}
                                                                <div className="mt-2">
                                                                    <input
                                                                        type="text"
                                                                        value={form.meditem_id}
                                                                        onChange={(e) =>
                                                                            handleChange(activeTab, index, "meditem_id", e.target.value)
                                                                        }
                                                                        className="form-control"
                                                                        style={{ display: "none" }}
                                                                    />
                                                                </div>

                                                                <div className="row">
                                                                    {/* รายการยา */}
                                                                    <div className="col-md-3 position-relative">
                                                                        <div className="mt-2">
                                                                            <label className="form-label">รายการยา (RX)</label>
                                                                            {/* {console.log(form.medicine_name)} */}
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                value={form.medicine_name}

                                                                                onChange={(e) => {
                                                                                    const value = e.target.value;
                                                                                    handleChange(activeTab, index, "medicine_name", value);
                                                                                    // console.log("H ",activeTab, index, "medicine_name", value);

                                                                                    if (value.trim() === "") {
                                                                                        // เคลียร์ข้อมูลเมื่อ input ว่าง
                                                                                        const newFormData = { ...formData };
                                                                                        newFormData[activeTab][index] = {
                                                                                            ...newFormData[activeTab][index],
                                                                                            medicine_name: "",
                                                                                            meditem_id: "",
                                                                                            price: "",
                                                                                            icdOptions: [],
                                                                                        };
                                                                                        setFormData(newFormData);
                                                                                        setText(null);
                                                                                    } else {
                                                                                        handSearch(activeTab, index, value + "&clinic_id=" + clinic_id, "meditem");
                                                                                    }
                                                                                }}
                                                                            />
                                                                        </div>

                                                                        {/* Dropdown suggestions */}
                                                                        {form.medicine_name.trim().length > 0 &&
                                                                            form.icdOptions &&
                                                                            form.icdOptions.length > 0 && (
                                                                                <ul className="list-group position-absolute w-100 shadow-sm rounded mt-1 z-3">
                                                                                    {form.icdOptions.map((meditem) => (
                                                                                        <li
                                                                                            key={meditem.id}
                                                                                            className="list-group-item list-group-item-action"
                                                                                            onMouseDown={() =>
                                                                                                handleMeditemSelect(activeTab, index, meditem)
                                                                                            }
                                                                                        >
                                                                                            {meditem.name} - ราคายา {meditem.price} - ({meditem.stdcode})
                                                                                        </li>
                                                                                    ))}
                                                                                </ul>
                                                                            )}
                                                                    </div>

                                                                    {/* รหัสวิธีใช้ */}
                                                                    <div className="col-md-3">
                                                                        <div className="mt-2">
                                                                            <label className="form-label">รหัสวิธีใช้ (RX)</label>
                                                                            <input
                                                                                type="text"
                                                                                value={form.dosage}
                                                                                onChange={(e) =>
                                                                                    handleChange(activeTab, index, "dosage", e.target.value)
                                                                                }
                                                                                className="form-control"
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    {/* วิธีการใช้ยา */}
                                                                    <div className="col-md-2">
                                                                        <div className="mt-2">
                                                                            <label className="form-label">วิธีการใช้ยา (RX)</label>
                                                                            <input
                                                                                type="text"
                                                                                value={form.usage_instruction}
                                                                                onChange={(e) =>
                                                                                    handleChange(activeTab, index, "usage_instruction", e.target.value)
                                                                                }
                                                                                className="form-control"
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    {/* จำนวนยา */}
                                                                    <div className="col-md-2">
                                                                        <div className="mt-2">
                                                                            <label className="form-label">จำนวนยา (RX)</label>
                                                                            <input
                                                                                type="number"
                                                                                value={form.quantity}
                                                                                onChange={(e) =>
                                                                                    handleChange(activeTab, index, "quantity", e.target.value)
                                                                                }
                                                                                className="form-control"
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    {/* ราคาต่อหน่วย */}
                                                                    <div className="col-md-2">
                                                                        <div className="mt-2">
                                                                            <label className="form-label">ราคายา/ต่อหน่วย (RX)</label>
                                                                            <input
                                                                                type="number"
                                                                                value={form.price}
                                                                                onChange={(e) =>
                                                                                    handleChange(activeTab, index, "price", e.target.value)
                                                                                }
                                                                                className="form-control"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        )}

                                                        {activeTab === "lab_results" && (
                                                            <>
                                                                {/* ซ่อน lab_data_id */}
                                                                <div className="mt-2">
                                                                    <input
                                                                        type="text"
                                                                        value={form.lab_data_id}
                                                                        onChange={(e) =>
                                                                            handleChange(activeTab, index, "lab_data_id", e.target.value)
                                                                        }
                                                                        className="form-control"
                                                                        style={{ display: "none" }}
                                                                    />
                                                                </div>

                                                                <div className="row">
                                                                    {/* ชื่อรายการ LAB */}
                                                                    <div className="col-md-3 position-relative">
                                                                        <div className="mt-2">
                                                                            <label className="form-label">รายการ (LAB NAME)</label>
                                                                            <input
                                                                                type="text"
                                                                                value={form.test_name}
                                                                                onChange={(e) => {
                                                                                    const value = e.target.value;
                                                                                    handleChange(activeTab, index, "test_name", value);

                                                                                    if (value.trim() === "") {
                                                                                        const newFormData = { ...formData };
                                                                                        newFormData[activeTab][index] = {
                                                                                            ...newFormData[activeTab][index],
                                                                                            test_name: "",
                                                                                            lab_data_id: "",
                                                                                            price: "",
                                                                                            icdOptions: [],
                                                                                        };
                                                                                        setFormData(newFormData);
                                                                                        setText(null);
                                                                                    } else {
                                                                                        handSearch(activeTab, index, value, "list_lab");
                                                                                    }
                                                                                }}
                                                                                className="form-control"
                                                                            />
                                                                        </div>

                                                                        {/* Dropdown: ตัวเลือก lab */}
                                                                        {form.test_name.trim().length > 0 &&
                                                                            form.icdOptions &&
                                                                            form.icdOptions.length > 0 && (
                                                                                <ul className="list-group position-absolute w-100 shadow-sm rounded mt-1 z-3">
                                                                                    {form.icdOptions.map((Lab) => (
                                                                                        <li
                                                                                            key={Lab.id}
                                                                                            className="list-group-item list-group-item-action"
                                                                                            onMouseDown={() => handLabelect(activeTab, index, Lab)}
                                                                                        >
                                                                                            {Lab.labname} - ราคา {Lab.pricelab}
                                                                                        </li>
                                                                                    ))}
                                                                                </ul>
                                                                            )}

                                                                        {/* ข้อความไม่พบ */}
                                                                        {form.test_name.trim().length > 0 &&
                                                                            form.icdOptions &&
                                                                            form.icdOptions.length === 0 &&
                                                                            Text && (
                                                                                <ul className="list-group position-absolute w-100 shadow-sm rounded mt-1 z-3">
                                                                                    <li className="list-group-item text-center text-muted" disabled>
                                                                                        {Text}
                                                                                    </li>
                                                                                </ul>
                                                                            )}
                                                                    </div>

                                                                    {/* ราคา */}
                                                                    <div className="col-md-3">
                                                                        <div className="mt-2">
                                                                            <label className="form-label">ราคา (LAB)</label>
                                                                            <input
                                                                                type="number"
                                                                                value={form.price}
                                                                                onChange={(e) =>
                                                                                    handleChange(activeTab, index, "price", e.target.value)
                                                                                }
                                                                                className="form-control"
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    {/* Result Value */}
                                                                    <div className="col-md-3">
                                                                        <div className="mt-2">
                                                                            <label className="form-label">Result Value</label>
                                                                            <select
                                                                                value={form.result_value}
                                                                                onChange={(e) =>
                                                                                    handleChange(activeTab, index, "result_value", e.target.value)
                                                                                }
                                                                                className="form-select"
                                                                            >
                                                                                <option>เลือกสถานะ</option>
                                                                                <option value="ส่ง LAB">ส่ง LAB</option>
                                                                            </select>
                                                                        </div>
                                                                    </div>

                                                                    {/* สถานะส่ง */}
                                                                    <div className="col-md-3">
                                                                        <div className="mt-2">
                                                                            <label className="form-label">สถานะ LAB</label>
                                                                            <select
                                                                                value={form.status_sen}
                                                                                onChange={(e) =>
                                                                                    handleChange(activeTab, index, "status_sen", e.target.value)
                                                                                }
                                                                                className="form-select"
                                                                            >
                                                                                <option>เลือกสถานะ</option>
                                                                                <option value="ส่งตรวจภายใน">ส่งตรวจภายใน</option>
                                                                                <option value="ส่งตรวจภายนอก">ส่งตรวจภายนอก</option>
                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        )}

                                                        {activeTab === "xr_results" && (
                                                            <>
                                                                {/* ซ่อน rxay_id */}
                                                                <div className="mt-2">
                                                                    <input
                                                                        type="text"
                                                                        value={form.rxay_id}
                                                                        onChange={(e) =>
                                                                            handleChange(activeTab, index, "rxay_id", e.target.value)
                                                                        }
                                                                        className="form-control"
                                                                        style={{ display: "none" }}
                                                                    />
                                                                </div>

                                                                <div className="row">
                                                                    {/* รายการ X-ray */}
                                                                    <div className="col-md-8 position-relative">
                                                                        <div className="mt-2">
                                                                            <label className="form-label">รายการ (Rxay)</label>
                                                                            <input
                                                                                type="text"
                                                                                value={form.description}
                                                                                onChange={(e) => {
                                                                                    const value = e.target.value;
                                                                                    handleChange(activeTab, index, "description", value);

                                                                                    if (value.trim() === "") {
                                                                                        const newFormData = { ...formData };
                                                                                        newFormData[activeTab][index] = {
                                                                                            ...newFormData[activeTab][index],
                                                                                            description: "",
                                                                                            rxay_id: "",
                                                                                            price: "",
                                                                                            icdOptions: [],
                                                                                        };
                                                                                        setFormData(newFormData);
                                                                                        setText(null);
                                                                                    } else {
                                                                                        handSearch(activeTab, index, value, "list_rxay");
                                                                                    }
                                                                                }}
                                                                                className="form-control"
                                                                            />
                                                                        </div>

                                                                        {/* Dropdown แสดงผลลัพธ์ */}
                                                                        {form.description.trim().length > 0 &&
                                                                            form.icdOptions &&
                                                                            form.icdOptions.length > 0 && (
                                                                                <ul className="list-group position-absolute w-100 shadow-sm rounded mt-1 z-3">
                                                                                    {form.icdOptions.map((Rxay) => (
                                                                                        <li
                                                                                            key={Rxay.id}
                                                                                            className="list-group-item list-group-item-action"
                                                                                            onMouseDown={() => handRxayelect(activeTab, index, Rxay)}
                                                                                        >
                                                                                            {Rxay.xryname} - ราคา {Rxay.pricexry}
                                                                                        </li>
                                                                                    ))}
                                                                                </ul>
                                                                            )}

                                                                        {/* ข้อความไม่พบ */}
                                                                        {form.description.trim().length > 0 &&
                                                                            form.icdOptions &&
                                                                            form.icdOptions.length === 0 &&
                                                                            Text && (
                                                                                <ul className="list-group position-absolute w-100 shadow-sm rounded mt-1 z-3">
                                                                                    <li className="list-group-item text-center text-muted" disabled>
                                                                                        {Text}
                                                                                    </li>
                                                                                </ul>
                                                                            )}
                                                                    </div>

                                                                    {/* ราคา */}
                                                                    <div className="col-md-3">
                                                                        <div className="mt-2">
                                                                            <label className="form-label">ราคา (Rxay)</label>
                                                                            <input
                                                                                type="number"
                                                                                value={form.price}
                                                                                onChange={(e) =>
                                                                                    handleChange(activeTab, index, "price", e.target.value)
                                                                                }
                                                                                className="form-control"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        )}

                                                        <div className="col-12">
                                                            <button
                                                                type="button"
                                                                className="btn btn-outline-danger mt-2 d-flex align-items-center gap-2"
                                                                onClick={() => handleDeleteForm(activeTab, index)}
                                                            >
                                                                <i className="bi bi-trash-fill"></i> ลบรายการ
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        <div className="text-center py-2">
                                            {Text ? (
                                                <div>
                                                    <div className="alert alert-danger fw-semibold shadow-sm" role="alert">
                                                        {Text}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div></div>
                                            )}
                                        </div>
                                    </Modal.Body>

                                    {/* ปุ่มเพิ่มรายการ */}


                                    {/* <Modal.Footer>
                                    <div className="row justify-content-center g-3 mt-4 mb-4">
                                        <div className="col-md-5">
                                            <button
                                                type="button"
                                                className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2 py-2 shadow-sm"
                                                onClick={() => handleAddForm(activeTab)}
                                                style={{
                                                    transition: "all 0.3s ease",
                                                    background: "linear-gradient(45deg, #4e73df 30%, #224abe 90%)",
                                                }}
                                                onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                                                onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                                            >
                                                <i className="bi bi-plus-circle fs-5"></i>
                                                <span className="fw-bold">เพิ่มรายการใหม่</span>
                                            </button>
                                        </div>
                                    </div>

                                    <Button
                                        variant="outline-secondary"
                                        onClick={() => setActiveTab("emp")}
                                        className="d-flex align-items-center gap-2"
                                    >
                                        <i className="bi bi-x-circle"></i> ปิด
                                    </Button>
                                </Modal.Footer> */}

                                    <Modal.Footer className="d-flex flex-wrap justify-content-between align-items-center gap-3 mt-4">
                                        <div>
                                            <Button
                                                variant="outline-primary"
                                                onClick={() => handleAddForm(activeTab)}
                                                className="d-flex align-items-center gap-2 px-4 py-2 shadow-sm"
                                                style={{
                                                    fontSize: "1rem",
                                                    fontWeight: "500",
                                                    borderRadius: "0.5rem",
                                                    transition: "all 0.2s ease-in-out"
                                                }}
                                                onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
                                                onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                                            >
                                                <i className="bi bi-plus-circle fs-5"></i>
                                                <span>เพิ่มรายการใหม่</span>
                                            </Button>
                                        </div>

                                        <div>
                                            <Button
                                                variant="outline-secondary"
                                                onClick={() => setActiveTab("emp")}
                                                className="d-flex align-items-center gap-2 px-4 py-2"
                                            >
                                                <i className="bi bi-x-circle"></i> ปิด
                                            </Button>
                                        </div>
                                    </Modal.Footer>

                                </Modal>
                                {/* </Modal> */}

                                <div className="row justify-content-center g-3 mb-4">
                                    <div className="col-md-6">
                                        <button
                                            type="button"
                                            className="btn btn-success w-100 d-flex align-items-center justify-content-center gap-2 py-2 shadow-lg position-relative overflow-hidden"
                                            onClick={() => handleSave()}
                                            style={{
                                                transition: 'all 0.3s ease',
                                                background: 'linear-gradient(45deg, #1cc88a 30%, #13855c 90%)'
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                        >
                                            <i className="bi bi-check-circle fs-5"></i>
                                            <span className="fw-bold">ตรวจสอบข้อมูล</span>
                                        </button>
                                    </div>
                                </div>
                            </>
                        </div>
                    </div>
                </div>


                <Modal

                    show={savedData}
                    fullscreen={true}
                >
                    <Modal.Body>
                        <DisplayData savedData={savedData} />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-secondary" onClick={() => setSavedData(false)}>
                            <i className="bi bi-x-circle"></i> ปิด
                        </Button>
                        <Button variant="outline-success" onClick={() => Update(patientData.queue_id)}>
                            <i className="bi bi-check-circle"></i> ยืนยันการส่งข้อมูล
                        </Button>
                    </Modal.Footer>
                </Modal>

            </div >
        </>
    );
};

export default Pat_checks_fordisease_create_admin3;


