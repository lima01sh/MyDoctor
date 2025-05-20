
import { React,useState, useEffect } from "react";
import './c.css';
import { APi_URL_UAT } from "../../auth/config";
import { useLocation, useNavigate } from "react-router-dom"
import { Modal, Button, Card } from 'react-bootstrap';
import Swal from 'sweetalert2';

import DisplayData from "./DisplayData";

import 'bootstrap/dist/css/bootstrap.min.css';

const Pat_checks_fordisease_create = ({ handleLogout }) => {
    
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
        fetch(APi_URL_UAT + "treatment_information&history_id=" + patientData.history_id, requestOptions)
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
        cc: [{ hn_patient_id: patientData.hn_patient_id, description: "", treatment_history_id: patientData.history_id, clinic_id: clinic_id }],
        pi: [{ hn_patient_id: patientData.hn_patient_id, description: "", treatment_history_id: patientData.history_id, clinic_id: clinic_id }],
        ph: [{ hn_patient_id: patientData.hn_patient_id, description: "", treatment_history_id: patientData.history_id, clinic_id: clinic_id }],
        pe: [{ hn_patient_id: patientData.hn_patient_id, description: "", price: "80.00", treatment_history_id: patientData.history_id, clinic_id: clinic_id }],
        prx: [{ hn_patient_id: patientData.hn_patient_id, procedure_name: "", quantity: "", price: "", prcd_id: "", treatment_history_id: patientData.history_id, clinic_id: clinic_id }],
        fu: [
            {
                hn_patient_id: patientData.hn_patient_id,
                appointment_date: getCurrentDateAndTime().date,
                details: "",
                date: "",
                time: "",
                treatment_history_id: patientData.history_id,
                clinic_id: clinic_id
            }
        ],
        dx: [
            {
                hn_patient_id: patientData.hn_patient_id,
                code: "",
                description: "",
                icd_id: "",
                treatment_history_id: patientData.history_id,
                clinic_id: clinic_id
            }
        ],
        rx: [
            {
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
        ],
        lab_results: [
            {
                hn_patient_id: patientData.hn_patient_id,
                test_name: "",
                result_value: "",
                price: "",
                status_sen: "",
                lab_data_id: "",
                treatment_history_id: patientData.history_id,
                clinic_id: clinic_id
            }
        ],
        xr_results: [
            {
                hn_patient_id: patientData.hn_patient_id,
                description: "",
                price: "",
                rxay_id: "",
                treatment_history_id: patientData.history_id,
                clinic_id: clinic_id
            }
        ]
    };

    const [formData, setFormData] = useState(initialState);
    const [activeTab, setActiveTab] = useState("cc");


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
            if (result.success && result.data.length > 0) {
                const newFormData = { ...formData };
                newFormData[tab][index].icdOptions = result.data; // เก็บรายการตัวเลือก ICD10
                setFormData(newFormData);
                setText(null)
            } else {
                setText("ไม่พบข้อมูล  ที่ค้นหา")
                console.error("ไม่พบข้อมูล  ที่ค้นหา");
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
    return (
        <div className=" mt-4">

            <div className="">

                <div className="alert alert-danger" role="alert">
                    <h1>แพทย์ตรวจโรค</h1>

                    หน้าวินิจสัยโรค (ระบบแพทย์ตรวจโรค) หากรายไหนไม่มีการตรวจ หรือข้อมูล ให้ลบรายการออก แต่ถ้าหากมีมากกว่า 1 รายการ ให้กด ปุ่ม เพิ่มรายการใหม่
                </div>
                <div className="row">

                    <div className="col-md-6 mb-3">
                        <div className="card shadow-lg rounded-4 border-light" style={cardStyle}>
                            <div className="card-body">
                                <h5 className="card-title text-uppercase text-primary">{patientData.thai_firstname} {patientData.thai_lastname}</h5>
                                <p className="card-text text-muted">เลขผู้ป่วย: {patientData.hn_patient_id}</p>
                                <p className="card-text text-muted">คิวที่: {patientData.queue_number}</p>
                            </div>
                        </div>
                    </div>


                    <div className="col-md-6 mb-3">
                        <div className="card shadow-lg rounded-4 border-light" onClick={() => handleCardClick()} style={cardStyle}>
                            <div className="card-body">
                                <h5 className="card-title text-uppercase text-primary">ข้อมูลผู้ป่วย/ประวัติแพ้ยา</h5>
                                <p className="card-text text-muted">เลขผู้ป่วย: {patientData.hn_patient_id}</p>
                                <p className="card-text text-muted">ข้อมูลผู้ป่วยวันที่: {getCurrentDateAndTime().date}</p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Modal สำหรับแสดงรายละเอียดเพิ่มเติม */}
                {activePatient && (
                    <Modal show={showModal} onHide={handleClose} size="lg">
                        <Modal.Header closeButton>
                            <Modal.Title>{patientData.hn_patient_id} - {patientData.thai_firstname} {patientData.thai_lastname}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <h5 className="text-info">Vital Signs:</h5>
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

                            <h5 className="text-info mt-4">Drug Allergies:</h5>
                            {activePatient.drug_allergies.map((allergy, index) => (
                                <Card key={index} className="mb-3">
                                    <Card.Body>
                                        <Card.Title>Medicine: ({allergy.drug_code}) {allergy.med_name}</Card.Title>
                                        <Card.Text>
                                            <strong>Details:</strong> {allergy.details}
                                        </Card.Text>
                                        <Card.Text>
                                            <strong>Severity:</strong> {allergy.severity_description}
                                        </Card.Text>
                                        <Card.Text>
                                            <strong>Allergy Name:</strong> {allergy.allergy_name}
                                        </Card.Text>
                                        <Card.Text>
                                            <strong>History Source:</strong> {allergy.history_source_name}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            ))}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                )}
            </div>





            {/* Tabs Navigation */}
            <div className="card shadow-lg rounded-4 border-light" style={cardStyle}>
                <div className="card-body">
                    <ul className="nav nav-pills mb-3 d-flex flex-wrap justify-content-center">
                        {Object.keys(initialState).map((tab, index) => (
                            <li key={index} className="nav-item">
                                <button
                                    className={`nav-link px-4 py-2 mx-3 rounded-pill text-uppercase ${activeTab === tab ? "active bg-primary text-white shadow-lg transform scale-105" : "bg-light text-dark"}`}
                                    onClick={() => setActiveTab(tab)}
                                    style={{
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    {tab.toUpperCase()}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>



            {/* Form Content */}
            <div className="tab-content">
                <div className="tab-pane fade show active">
                    <div className="mt-3">
                        <div className="text-center">
                            {Text ? (
                                <div>
                                    {/* แสดงข้อมูลที่เลือก */}
                                    <div className="alert alert-danger" role="alert">


                                        {Text}
                                    </div>

                                </div>
                            ) : (
                                <div>

                                </div>
                            )}
                        </div>
                        {formData[activeTab].map((form, index) => (
                            <div key={index} className="card mb-4 shadow-lg">
                                <div className="card-body">
                                    <div className="row">


                                        {activeTab === "cc" && (
                                            <>
                                                <div className="mt-2">
                                                    <label className="form-label">รายการ/รายละอียด (CC)</label>
                                                    <input
                                                        type="text"
                                                        value={form.description}
                                                        onChange={(e) => handleChange(activeTab, index, "description", e.target.value)}
                                                        className="form-control"
                                                    />
                                                </div>


                                            </>
                                        )}
                                        {activeTab === "pi" && (
                                            <>
                                                <div className="mt-2">
                                                    <label className="form-label">รายการ/รายละอียด (PI)</label>
                                                    <input
                                                        type="text"
                                                        value={form.description}
                                                        onChange={(e) => handleChange(activeTab, index, "description", e.target.value)}
                                                        className="form-control"
                                                    />
                                                </div>
                                            </>
                                        )}
                                        {activeTab === "ph" && (
                                            <>
                                                <div className="mt-2">
                                                    <label className="form-label">รายการ/รายละอียด (PH)</label>
                                                    <input
                                                        type="text"
                                                        value={form.description}
                                                        onChange={(e) => handleChange(activeTab, index, "description", e.target.value)}
                                                        className="form-control"
                                                    />
                                                </div>


                                            </>
                                        )}
                                        {activeTab === "pe" && (
                                            <>
                                                <div className="row">
                                                    <div className="col-md-8">
                                                        <div className="mt-2">
                                                            <label className="form-label">รายการ/รายละอียด (PE)</label>
                                                            <input
                                                                type="text"
                                                                value={form.description}
                                                                onChange={(e) => handleChange(activeTab, index, "description", e.target.value)}
                                                                className="form-control"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="mt-2">
                                                            <label className="form-label">ราคา (PE)</label>
                                                            <input
                                                                type="number"
                                                                value={form.price}
                                                                onChange={(e) => handleChange(activeTab, index, "price", e.target.value)}
                                                                className="form-control"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>





                                            </>
                                        )}

                                        {activeTab === "prx" && (
                                            <>
                                                <div className="mt-2">
                                                    <input
                                                        type="text"
                                                        value={form.prcd_id}
                                                        onChange={(e) => handleChange(activeTab, index, "prcd_id", e.target.value)}
                                                        className="form-control"
                                                        style={{ display: "none" }} // ใช้ CSS เพื่อซ่อน input
                                                    />
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="mt-2">
                                                            <label className="form-label">รายการ/รายละอียด (PRX)</label>
                                                            <input
                                                                type="text"
                                                                value={form.procedure_name}
                                                                onChange={(e) => handleChange(activeTab, index, "procedure_name", e.target.value)}
                                                                onBlur={() => handSearch(activeTab, index, form.procedure_name, "list_prcd")}
                                                                className="form-control"
                                                            />
                                                        </div>
                                                        {form.icdOptions && form.icdOptions.length > 0 && (
                                                            <ul className="list-group position-absolute w-100" style={{ zIndex: 1000 }}>
                                                                {form.icdOptions.map((prx) => (
                                                                    <li
                                                                        key={prx.id}
                                                                        className="list-group-item list-group-item-action"
                                                                        onClick={() => handPrxSelect(activeTab, index, prx)}
                                                                    >
                                                                        {prx.nameprcd}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                    </div>

                                                    <div className="col-md-3">
                                                        <div className="mt-2">
                                                            <label className="form-label">จำนวน (PRX)</label>
                                                            <input
                                                                type="text"
                                                                value={form.quantity}
                                                                onChange={(e) => handleChange(activeTab, index, "quantity", e.target.value)}
                                                                className="form-control"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <div className="mt-2">
                                                            <label className="form-label">ราคาต่อหน่วย (PRX)</label>
                                                            <input
                                                                type="number"
                                                                value={form.price}
                                                                onChange={(e) => handleChange(activeTab, index, "price", e.target.value)}
                                                                className="form-control"
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
                                                        className="form-control"
                                                    />
                                                </div>
                                                <div className="mt-2">
                                                    <label className="form-label">รายละอียดการนัด</label>
                                                    <input
                                                        type="text"
                                                        value={form.details}
                                                        onChange={(e) => handleChange(activeTab, index, "details", e.target.value)}
                                                        className="form-control"
                                                    />
                                                </div>
                                                <div className="mt-2">
                                                    <label className="form-label">เวลานัด</label>
                                                    <input
                                                        type="time"
                                                        value={form.time}
                                                        onChange={(e) => handleChange(activeTab, index, "time", e.target.value)}
                                                        className="form-control"
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {activeTab === "dx" && (
                                            <>
                                                <div className="mt-2">
                                                    <input
                                                        type="text"
                                                        value={form.icd_id}
                                                        onChange={(e) => handleChange(activeTab, index, "icd_id", e.target.value)}
                                                        className="form-control"
                                                        style={{ display: "none" }}
                                                    />
                                                </div>

                                                <div className="row">
                                                    <div className="col-md-3">
                                                        <div className="mt-2 position-relative">
                                                            <label className="form-label">รหัสโรค (DX)</label>
                                                            <input
                                                                type="text"
                                                                value={form.code}
                                                                onChange={(e) => handleChange(activeTab, index, "code", e.target.value)}
                                                                onBlur={() => handSearch(activeTab, index, form.code, "list_icd")}
                                                                className="form-control"
                                                            />
                                                            {form.icdOptions && form.icdOptions.length > 0 && (
                                                                <ul className="list-group position-absolute w-100" style={{ zIndex: 1000 }}>
                                                                    {form.icdOptions.map((icd) => (
                                                                        <li
                                                                            key={icd.id}
                                                                            className="list-group-item list-group-item-action"
                                                                            onClick={() => handleICDSelect(activeTab, index, icd)}
                                                                        >
                                                                            {icd.icd10} - {icd.name_t} - {icd.icd10name}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="col-md-9">
                                                        <div className="mt-2">
                                                            <label className="form-label">ชื่อโรค (DX)</label>
                                                            <input
                                                                type="text"
                                                                value={form.description}
                                                                onChange={(e) => handleChange(activeTab, index, "description", e.target.value)}
                                                                className="form-control"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {/* {activeTab === "dx" && (
    <>
        <div className="mt-2">
            <input
                type="text"
                value={form.icd_id}
                onChange={(e) => handleChange(activeTab, index, "icd_id", e.target.value)}
                className="form-control"
                style={{ display: "none" }} // ซ่อน input
            />
        </div>

        <div className="row">
            <div className="col-md-3">
                <div className="mt-2">
                    <label className="form-label">รหัสโรค (DX)</label>
                    <input
                        type="text"
                        value={form.code}
                        onChange={(e) => handleChange(activeTab, index, "code", e.target.value)}
                        onBlur={() => handleICDSearch(activeTab, index, form.code)} // เรียกใช้การค้นหาเมื่อออกจาก input
                        className="form-control"
                    />
                </div>
            </div>
            <div className="col-md-9">
                <div className="mt-2">
                    <label className="form-label">ชื่อโรค (DX)</label>
                    <input
                        type="text"
                        value={form.description}
                        onChange={(e) => handleChange(activeTab, index, "description", e.target.value)}
                        className="form-control"
                    />
                </div>
            </div>
        </div>
    </>
)} */}

                                        {/* {activeTab === "dx" && (
                                            <>

                                        
                                                <div className="mt-2">
                                                    <input
                                                        type="text"
                                                        value={form.icd_id}
                                                        onChange={(e) => handleChange(activeTab, index, "icd_id", e.target.value)}
                                                        className="form-control"
                                                        style={{ display: "none" }} // ใช้ CSS เพื่อซ่อน input
                                                    />
                                                </div>

                                                <div className="row">
                                                    <div className="col-md-3">
                                                        <div className="mt-2">
                                                            <label className="form-label">รหัสโรค (DX)</label>
                                                            <input
                                                                type="text"
                                                                value={form.code}
                                                                onChange={(e) => handleChange(activeTab, index, "code", e.target.value)}
                                                                className="form-control"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-9">

                                                        <div className="mt-2">
                                                            <label className="form-label">ชื่อโรค (DX)</label>
                                                            <input
                                                                type="text"
                                                                value={form.description}
                                                                onChange={(e) => handleChange(activeTab, index, "description", e.target.value)}
                                                                className="form-control"
                                                            />
                                                        </div>
                                                    </div>


                                                </div>
                                            </>
                                        )} */}


                                        {activeTab === "rx" && (
                                            <>
                                                <div className="mt-2">
                                                    <input
                                                        type="text"
                                                        value={form.meditem_id}
                                                        onChange={(e) => handleChange(activeTab, index, "meditem_id", e.target.value)}
                                                        className="form-control"
                                                        style={{ display: "none" }} // ใช้ CSS เพื่อซ่อน input
                                                    />
                                                </div>

                                                <div className="row">
                                                    <div className="col-md-3">
                                                        <div className="mt-2">
                                                            <label className="form-label">รายการยา (RX)</label>
                                                            <input
                                                                type="text"
                                                                value={form.medicine_name}
                                                                onChange={(e) => handleChange(activeTab, index, "medicine_name", e.target.value)}
                                                                onBlur={() => handSearch(activeTab, index, form.medicine_name, "list_meditem")}
                                                                className="form-control"
                                                            />
                                                        </div>
                                                        {form.icdOptions && form.icdOptions.length > 0 && (
                                                            <ul className="list-group position-absolute w-100" style={{ zIndex: 1000 }}>
                                                                {form.icdOptions.map((meditem) => (
                                                                    <li
                                                                        key={meditem.id}
                                                                        className="list-group-item list-group-item-action"
                                                                        onClick={() => handleMeditemSelect(activeTab, index, meditem)}
                                                                    >
                                                                        {meditem.name} - ราคายา {meditem.price} - ({meditem.stdcode})
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                    </div>
                                                    <div className="col-md-3">
                                                        <div className="mt-2">
                                                            <label className="form-label">รหัสวิธีใช้ (RX)</label>
                                                            <input
                                                                type="text"
                                                                value={form.dosage}
                                                                onChange={(e) => handleChange(activeTab, index, "dosage", e.target.value)}
                                                                className="form-control"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-2">
                                                        <div className="mt-2">
                                                            <label className="form-label">วิธีการใช้ยา (RX)</label>
                                                            <input
                                                                type="text"
                                                                value={form.usage_instruction}
                                                                onChange={(e) => handleChange(activeTab, index, "usage_instruction", e.target.value)}
                                                                className="form-control"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-2">
                                                        <div className="mt-2">
                                                            <label className="form-label">จำนวนยา (RX)</label>
                                                            <input
                                                                type="number"
                                                                value={form.quantity}
                                                                onChange={(e) => handleChange(activeTab, index, "quantity", e.target.value)}
                                                                className="form-control"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-2">
                                                        <div className="mt-2">
                                                            <label className="form-label">ราคายา/ต่อหน่วย (RX)</label>
                                                            <input
                                                                type="number"
                                                                value={form.price}
                                                                onChange={(e) => handleChange(activeTab, index, "price", e.target.value)}
                                                                className="form-control"
                                                            />
                                                        </div>
                                                    </div>


                                                </div>
                                            </>
                                        )}

                                        {activeTab === "lab_results" && (
                                            <>
                                                <div className="mt-2">
                                                    <input
                                                        type="text"
                                                        value={form.lab_data_id}
                                                        onChange={(e) => handleChange(activeTab, index, "lab_data_id", e.target.value)}
                                                        className="form-control"
                                                        style={{ display: "none" }} // ใช้ CSS เพื่อซ่อน input
                                                    />
                                                </div>

                                                <div className="row">
                                                    <div className="col-md-3">
                                                        <div className="mt-2">
                                                            <label className="form-label">รายการ (LAB NAME)</label>
                                                            <input
                                                                type="text"
                                                                value={form.test_name}
                                                                onChange={(e) => handleChange(activeTab, index, "test_name", e.target.value)}
                                                                onBlur={() => handSearch(activeTab, index, form.test_name, "list_lab")}
                                                                className="form-control"
                                                            />
                                                        </div>
                                                        {form.icdOptions && form.icdOptions.length > 0 && (
                                                            <ul className="list-group position-absolute w-100" style={{ zIndex: 1000 }}>
                                                                {form.icdOptions.map((Lab) => (
                                                                    <li
                                                                        key={Lab.id}
                                                                        className="list-group-item list-group-item-action"
                                                                        onClick={() => handLabelect(activeTab, index, Lab)}
                                                                    >
                                                                        {Lab.labname} - ราคา {Lab.pricelab}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                    </div>
                                                    <div className="col-md-3">

                                                        <div className="mt-2">
                                                            <label className="form-label">ราคา (LAB)</label>
                                                            <input
                                                                type="number"
                                                                value={form.price}
                                                                onChange={(e) => handleChange(activeTab, index, "price", e.target.value)}
                                                                className="form-control"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <div className="mt-2">
                                                            <label className="form-label">Result Value</label>
                                                            <select
                                                                value={form.result_value}
                                                                onChange={(e) => handleChange(activeTab, index, "result_value", e.target.value)}
                                                                className="form-select"
                                                            >
                                                                <option >เลือกสถานะ</option>
                                                                <option value="ส่ง LAB">ส่ง LAB</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <div className="mt-2">
                                                            <label className="form-label">สถานะ LAB</label>
                                                            <select
                                                                value={form.status_sen}
                                                                onChange={(e) => handleChange(activeTab, index, "status_sen", e.target.value)}
                                                                className="form-select"
                                                            >
                                                                <option >เลือกสถานะ</option>
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

                                                <div className="mt-2">
                                                    <input
                                                        type="text"
                                                        value={form.rxay_id}
                                                        onChange={(e) => handleChange(activeTab, index, "rxay_id", e.target.value)}
                                                        className="form-control"
                                                        style={{ display: "none" }} // ใช้ CSS เพื่อซ่อน input
                                                    />
                                                </div>

                                                <div className="row">
                                                    <div className="col-md-8">
                                                        <div className="mt-2">
                                                            <label className="form-label">รายการ (Rxay)</label>
                                                            <input
                                                                type="text"
                                                                value={form.description}
                                                                onChange={(e) => handleChange(activeTab, index, "description", e.target.value)}
                                                                onBlur={() => handSearch(activeTab, index, form.description, "list_rxay")}
                                                                className="form-control"
                                                            />
                                                        </div>
                                                        {form.icdOptions && form.icdOptions.length > 0 && (
                                                            <ul className="list-group position-absolute w-100" style={{ zIndex: 1000 }}>
                                                                {form.icdOptions.map((Rxay) => (
                                                                    <li
                                                                        key={Rxay.id}
                                                                        className="list-group-item list-group-item-action"
                                                                        onClick={() => handRxayelect(activeTab, index, Rxay)}
                                                                    >
                                                                        {Rxay.xryname} - ราคา {Rxay.pricexry}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                    </div>
                                                    <div className="col-md-3">

                                                        <div className="mt-2">
                                                            <label className="form-label">ราคา (Rxay)</label>
                                                            <input
                                                                type="number"
                                                                value={form.price}
                                                                onChange={(e) => handleChange(activeTab, index, "price", e.target.value)}
                                                                className="form-control"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                            </>
                                        )}

                                    </div>

                                    {/* Delete Form Button with Icon */}
                                    <button
                                        type="button"
                                        className="btn btn-danger mt-3 d-flex align-items-center"
                                        onClick={() => handleDeleteForm(activeTab, index)}
                                    >
                                        <i className="bi bi-trash-fill me-2"></i> ลบรายการ
                                    </button>
                                </div>
                            </div>
                        ))}
                        <div className="row">

                            <button
                                type="button"
                                className=" mt-2 gap-2 col-6 mx-auto btn btn-primary mt-3 shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
                                onClick={() => handleAddForm(activeTab)}
                            >
                                <i className="bi bi-plus-circle me-2"></i> เพิ่มรายการใหม่
                            </button>
                            <button
                                type="button"
                                className=" gap-2 col-6 mx-auto btn btn-success mt-3 shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
                                onClick={() => handleSave()}
                            >
                                <i className="bi bi-plus-circle me-2"></i> ตรวจสอบข้อมูล
                            </button>


                            <div className="col-6"></div>
                        </div>

                    </div>
                </div>
            </div>



            {/* Display Saved Data */}
            {savedData && (
                <>
                    <button
                        type="button"
                        className=" gap-2 col-6 mx-auto btn btn-success mt-3 shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
                        onClick={() => Update(patientData.queue_id)}
                    >
                        <i className="bi bi-plus-circle me-2"></i> ยืนยันการส่งข้อมูล
                    </button>
                    <DisplayData savedData={savedData} />
                   
                    {/* <pre className="mt-3">{JSON.stringify(savedData, null, 2)}</pre> */}
                </>
 
            )}
        </div>
    );
};

export default Pat_checks_fordisease_create;


