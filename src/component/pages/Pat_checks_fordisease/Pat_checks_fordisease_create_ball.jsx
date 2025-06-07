import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import DisplayDataxx from "./DisplayDataxx";
import { APi_URL_UAT } from "../../auth/config";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Modal } from "react-bootstrap";

const Pat_checks_fordisease_create_ball = ({ handleLogout }) => {
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
    const [isFormValid, setIsFormValid] = useState(false);

    const defaultFormData = {
        cc: { hn_patient_id: patientData.hn_patient_id, description: "", treatment_history_id: patientData.history_id, clinic_id: clinic_id },
        pi: { hn_patient_id: patientData.hn_patient_id, description: "", treatment_history_id: patientData.history_id, clinic_id: clinic_id },
        ph: { hn_patient_id: patientData.hn_patient_id, description: "", treatment_history_id: patientData.history_id, clinic_id: clinic_id },
        pe: { hn_patient_id: patientData.hn_patient_id, description: "", price: "80.00", treatment_history_id: patientData.history_id, clinic_id: clinic_id },
        prx: { hn_patient_id: patientData.hn_patient_id, procedure_name: "", quantity: "", price: "", prcd_id: "", treatment_history_id: patientData.history_id, clinic_id: clinic_id },
        fu: { hn_patient_id: patientData.hn_patient_id, appointment_date: getCurrentDateAndTime().date, details: "", date: "", time: "", treatment_history_id: patientData.history_id, clinic_id: clinic_id },
        dx: { hn_patient_id: patientData.hn_patient_id, code: "", description: "", icd_id: "", treatment_history_id: patientData.history_id, clinic_id: clinic_id },
        rx: { hn_patient_id: patientData.hn_patient_id, medicine_name: "", dosage: "", usage_instruction: "", quantity: "", price: "", meditem_id: "", treatment_history_id: patientData.history_id, clinic_id: clinic_id },
        lab_results: { hn_patient_id: patientData.hn_patient_id, test_name: "", result_value: "", price: "", status_sen: "", lab_data_id: "", treatment_history_id: patientData.history_id, clinic_id: clinic_id },
        xr_results: { hn_patient_id: patientData.hn_patient_id, description: "", price: "", rxay_id: "", treatment_history_id: patientData.history_id, clinic_id: clinic_id }
    };

    const [formData, setFormData] = useState({
        cc: [], pi: [], ph: [], pe: [], prx: [], fu: [], dx: [], rx: [], lab_results: [], xr_results: []
    });
    const [activeTab, setActiveTab] = useState("cc");

    useEffect(() => {
        DrugAllergies();
        treatment_information();
    }, []);

    useEffect(() => {
        const hasDataChanged = () => {
            return Object.entries(formData).some(([tab, entries]) => entries.length > 0);
        };
        setIsFormValid(hasDataChanged());
    }, [formData]);

    const DrugAllergies = () => {
        const myHeaders = new Headers();
        myHeaders.append("x-api-key", apiKey);
        const requestOptions = { method: "GET", headers: myHeaders, redirect: "follow" };
        fetch(APi_URL_UAT + "listdrug_allergies&hn_patient_id=" + patientData.hn_patient_id + "&clinic_id=" + clinic_id, requestOptions)
            .then((response) => {
                if (response.status === 401) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Token! หมดอายุ',
                        text: 'กรุณาเข้าสู่ระบบใหม่',
                        confirmButtonText: 'ออกจากระบบ'
                    }).then(() => handleLogout());
                }
                return response.json();
            })
            .then((result) => setActivePatient(result.data))
            .catch((error) => console.error(error));
    };

    const treatment_information = () => {
        const myHeaders = new Headers();
        myHeaders.append("x-api-key", apiKey);
        const requestOptions = { method: "GET", headers: myHeaders, redirect: "follow" };
        fetch(APi_URL_UAT + "treatment_information&history_id=" + patientData.history_id + '&clinic_id=' + clinic_id, requestOptions)
            .then((response) => {
                if (response.status === 401) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Token! หมดอายุ',
                        text: 'กรุณาเข้าสู่ระบบใหม่',
                        confirmButtonText: 'ออกจากระบบ'
                    }).then(() => handleLogout());
                }
                return response.json();
            })
            .then((result) => setPatientVitals(result.data))
            .catch((error) => console.error(error));
    };
    console.log("clinic_id =", clinic_id);
    console.log("patientData =", patientData);
    const Update = async (id) => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-API-KEY", apiKey);
        const raw = JSON.stringify({ "queue_id": id });
        const requestOptions = { method: "POST", headers: myHeaders, body: raw, redirect: "follow" };
        fetch(APi_URL_UAT + "update", requestOptions)
            .then((response) => {
                if (response.status === 401) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Token! หมดอายุ',
                        text: 'กรุณาเข้าสู่ระบบใหม่',
                        confirmButtonText: 'ออกจากระบบ'
                    }).then(() => handleLogout());
                }
                return response.json();
            })
            .then((result) => {
                if (result["success"] === true) Adddata();
                else Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด!', text: 'กรุณาติดต่อผู้พัฒนาระบบ', confirmButtonText: 'ลองอีกครั้ง' });
            })
            .catch((error) => {
                console.error(error);
                Swal.fire({ icon: 'error', title: 'ข้อผิดพลาด!', text: 'การเชื่อมต่อ API ล้มเหลว', confirmButtonText: 'ปิด' });
            });
    };

    const Adddata = () => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-API-KEY", apiKey);
        const raw = JSON.stringify(savedData);
        const requestOptions = { method: "POST", headers: myHeaders, body: raw, redirect: "follow" };
        fetch(APi_URL_UAT + "Pat_checks_fordisease", requestOptions)
            .then((response) => {
                if (response.status === 401) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Token! หมดอายุ',
                        text: 'กรุณาเข้าสู่ระบบใหม่',
                        confirmButtonText: 'ออกจากระบบ'
                    }).then(() => handleLogout());
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
                    }).then(() => navigate('/pat_checks_fordisease'));
                } else {
                    Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด!', text: 'ไม่สามารถดึงข้อมูลได้', confirmButtonText: 'ลองอีกครั้ง' });
                }
            })
            .catch((error) => {
                console.error(error);
                Swal.fire({ icon: 'error', title: 'ข้อผิดพลาด!', text: 'การเชื่อมต่อ API ล้มเหลว', confirmButtonText: 'ปิด' });
            });
    };

    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
        };
    };

    const handSearch = debounce(async (tab, index, searchCode, url) => {
        try {
            if (!searchCode || searchCode.trim() === "") {
                setFormData((prev) => {
                    const newFormData = { ...prev };
                    newFormData[tab][index].icdOptions = [];
                    return newFormData;
                });
                setText(null);
                return;
            }

            const myHeaders = new Headers();
            myHeaders.append("X-API-KEY", apiKey);
            const requestOptions = { method: "GET", headers: myHeaders, redirect: "follow" };
            const response = await fetch(
                `${APi_URL_UAT}${url}&search=${encodeURIComponent(searchCode)}${tab === "rx" ? `&clinic_id=${clinic_id}` : ""}`,
                requestOptions
            );
            const result = await response.json();

            if (result.success && result.data.length > 0) {
                const filteredData = result.data.filter(item => {
                    if (tab === "dx") {
                        return item.icd10.toLowerCase().includes(searchCode.toLowerCase()) ||
                            item.icd10name.toLowerCase().includes(searchCode.toLowerCase());
                    } else if (tab === "rx") {
                        return item.name.toLowerCase().includes(searchCode.toLowerCase()) ||
                            item.stdcode.toLowerCase().includes(searchCode.toLowerCase());
                    } else if (tab === "prx") {
                        return item.nameprcd.toLowerCase().includes(searchCode.toLowerCase());
                    } else if (tab === "lab_results") {
                        return item.labname.toLowerCase().includes(searchCode.toLowerCase());
                    } else if (tab === "xr_results") {
                        return item.xryname.toLowerCase().includes(searchCode.toLowerCase());
                    }
                    return false;
                });

                setFormData((prev) => {
                    const newFormData = { ...prev };
                    newFormData[tab][index].icdOptions = filteredData;
                    return newFormData;
                });
                setText(filteredData.length === 0 ? "ไม่พบข้อมูลที่ค้นหา" : null);
            } else {
                setFormData((prev) => {
                    const newFormData = { ...prev };
                    newFormData[tab][index].icdOptions = [];
                    return newFormData;
                });
                setText("ไม่พบข้อมูลที่ค้นหา");
            }
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการค้นหาข้อมูล:", error);
            setText("เกิดข้อผิดพลาดในการค้นหา");
        }
    }, 300);

    const handleICDSelect = (tab, index, icdData) => {
        const newFormData = { ...formData };
        newFormData[tab][index].code = icdData.icd10 || "";
        newFormData[tab][index].description = icdData.icd10name || "";
        newFormData[tab][index].icd_id = icdData.id || "";
        newFormData[tab][index].icdOptions = [];
        setFormData(newFormData);
    };

    const handleMeditemSelect = (tab, index, meditem) => {
        const newFormData = { ...formData };
        newFormData[tab][index] = {
            ...newFormData[tab][index],
            medicine_name: meditem.name || "",
            meditem_id: meditem.meditem_id || "",
            price: meditem.price || "",
            dosage: meditem.medusage || "",        // ←  auto-fill “รหัสวิธีใช้”
            stdcode: meditem.stdcode || "",        // ←  เก็บ Stdcode ถ้าต้องใช้แสดง/ส่งต่อ
            icdOptions: [],
        };
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
            (tab === "dx" && field === "code") ||
            (tab === "rx" && field === "medicine_name") ||
            (tab === "prx" && field === "procedure_name") ||
            (tab === "lab_results" && field === "test_name") ||
            (tab === "xr_results" && field === "description")
        ) {
            handSearch(tab, index, value,
                tab === "dx" ? "list_icd" :
                    tab === "rx" ? "meditem" :
                        tab === "prx" ? "list_prcd" :
                            tab === "lab_results" ? "list_lab" :
                                "list_rxay"
            );
        }
    };

    const handleAddForm = (tab) => {
        const newFormData = { ...formData };
        const newForm = tab === "fu" ? { ...defaultFormData.fu } :
            tab === "lab_results" ? { ...defaultFormData.lab_results } :
                tab === "xr_results" ? { ...defaultFormData.xr_results } :
                    tab === "cc" ? { ...defaultFormData.cc } :
                        tab === "pi" ? { ...defaultFormData.pi } :
                            tab === "ph" ? { ...defaultFormData.ph } :
                                tab === "pe" ? { ...defaultFormData.pe } :
                                    tab === "prx" ? { ...defaultFormData.prx } :
                                        tab === "dx" ? { ...defaultFormData.dx } :
                                            tab === "rx" ? { ...defaultFormData.rx } : {};
        newFormData[tab].push(newForm);
        setFormData(newFormData);
    };

    const handleDeleteForm = (tab, index) => {
        Swal.fire({
            icon: 'warning',
            title: 'ยืนยันการลบ',
            text: 'คุณต้องการลบรายการนี้หรือไม่?',
            showCancelButton: true,
            confirmButtonText: 'ลบ',
            cancelButtonText: 'ยกเลิก'
        }).then((result) => {
            if (result.isConfirmed) {
                const newFormData = { ...formData };
                newFormData[tab].splice(index, 1);
                setFormData(newFormData);
    
                // อย่าเซ็ต savedData ตรงนี้ เพราะจะให้ Modal สรุปผลแสดงก็ต่อเมื่อกด "ตรวจสอบข้อมูล" เท่านั้น
                // const cleanedData = { data: cleanEmptyArrays(newFormData) };
                // const isDataEmpty = Object.keys(cleanedData.data).length === 0;
                // setSavedData(isDataEmpty ? null : cleanedData);
            }
        });
    };
    

    const isEqual = (obj1, obj2) => {
        return JSON.stringify(obj1) === JSON.stringify(obj2);
    };

    const cleanEmptyArrays = (obj) => {
        if (Array.isArray(obj)) {
            const filteredArray = obj.map(cleanEmptyArrays).filter(item => item !== undefined && Object.keys(item).length > 0);
            return filteredArray.length > 0 ? filteredArray : undefined;
        } else if (typeof obj === "object" && obj !== null) {
            return Object.entries(obj).reduce((acc, [key, value]) => {
                const cleanedValue = cleanEmptyArrays(value);
                if (cleanedValue !== undefined) {
                    if (Array.isArray(cleanedValue) && cleanedValue.length === 1) {
                        const defaultValue = defaultFormData[key];
                        if (isEqual(cleanedValue[0], defaultValue)) {
                            return acc;
                        }
                    }
                    acc[key] = cleanedValue;
                }
                return acc;
            }, {});
        }
        return obj;
    };

    const validateFormData = (formData) => {
        for (const [tab, entries] of Object.entries(formData)) {
            for (const entry of entries) {
                if (tab === "cc" || tab === "pi" || tab === "ph") {
                    if (!entry.description) return { isValid: false, message: `กรุณากรอกข้อมูลในฟิลด์ รายละเอียด สำหรับ ${getTabName(tab)}` };
                } else if (tab === "pe") {
                    if (!entry.description || !entry.price) return { isValid: false, message: `กรุณากรอกข้อมูลในฟิลด์ รายละเอียด และ ราคา สำหรับ ${getTabName(tab)}` };
                } else if (tab === "prx") {
                    if (!entry.procedure_name || !entry.quantity || !entry.price || !entry.prcd_id)
                        return { isValid: false, message: `กรุณากรอกข้อมูลในฟิลด์ รายการหัตถการ, จำนวน, ราคา และเลือกหัตถการ สำหรับ ${getTabName(tab)}` };
                } else if (tab === "fu") {
                    if (!entry.date || !entry.time || !entry.details)
                        return { isValid: false, message: `กรุณากรอกข้อมูลในฟิลด์ วันที่นัด, เวลานัด และ รายละเอียด สำหรับ ${getTabName(tab)}` };
                } else if (tab === "dx") {
                    if (!entry.code || !entry.description || !entry.icd_id)
                        return { isValid: false, message: `กรุณากรอกข้อมูลในฟิลด์ รหัสโรค, ชื่อโรค และเลือก ICD-10 สำหรับ ${getTabName(tab)}` };
                } else if (tab === "rx") {
                    if (!entry.medicine_name || !entry.dosage || !entry.usage_instruction || !entry.quantity || !entry.price || !entry.meditem_id)
                        return { isValid: false, message: `กรุณากรอกข้อมูลในฟิลด์ ชื่อยา, รหัสวิธีใช้, วิธีการใช้ยา, จำนวน, ราคา และเลือกยา สำหรับ ${getTabName(tab)}` };
                } else if (tab === "lab_results") {
                    if (!entry.test_name || !entry.result_value || !entry.price || !entry.status_sen || !entry.lab_data_id)
                        return { isValid: false, message: `กรุณากรอกข้อมูลในฟิลด์ ชื่อการตรวจ, ผลการตรวจ, ราคา, สถานะ LAB และเลือกการตรวจ สำหรับ ${getTabName(tab)}` };
                } else if (tab === "xr_results") {
                    if (!entry.description || !entry.price || !entry.rxay_id)
                        return { isValid: false, message: `กรุณากรอกข้อมูลในฟิลด์ รายละเอียด, ราคา และเลือก X-Ray สำหรับ ${getTabName(tab)}` };
                }
            }
        }
        return { isValid: true };
    };

    const handleSave = () => {
        const isDataEmpty = Object.values(formData).every(entries => entries.length === 0);

        if (isDataEmpty) {
            Swal.fire({
                icon: 'warning',
                title: 'ไม่มีข้อมูล',
                text: 'กรุณาเพิ่มและกรอกข้อมูลอย่างน้อยหนึ่งรายการก่อนตรวจสอบ',
                confirmButtonText: 'ตกลง',
                showCancelButton: true,
                cancelButtonText: 'ยกเลิก'
            });
            setSavedData(null);
            return;
        }

        const validation = validateFormData(formData);
        if (!validation.isValid) {
            Swal.fire({
                icon: 'warning',
                title: 'ข้อมูลไม่ครบถ้วน',
                text: validation.message,
                confirmButtonText: 'ตกลง',
                showCancelButton: true,
                cancelButtonText: 'ยกเลิก'
            });
            setSavedData(null);
            return;
        }

        const cleanedData = { data: cleanEmptyArrays(formData) };
        setSavedData(cleanedData);
    };

    const getTabIcon = (tab) => {
        const icons = {
            cc: "bi-clipboard2-pulse",
            pi: "bi-file-medical",
            ph: "bi-journal-text",
            pe: "bi-heart-pulse",
            prx: "bi-scissors",
            fu: "bi-calendar-event",
            dx: "bi-file-earmark-medical",
            rx: "bi-capsule",
            lab_results: "bi-clipboard-data",
            xr_results: "bi bi-file-image"
        };
        return icons[tab] || "bi-file";
    };

    const getTabName = (tab) => {
        const names = {
            cc: "อาการสำคัญ(cc)",
            pi: "ประวัติปัจจุบัน(pi)",
            ph: "ประวัติอดีต(ph)",
            pe: "การตรวจร่างกาย(pe)",
            prx: "หัตถการ(prx)",
            fu: "นัดหมาย(fu)",
            dx: "การวินิจฉัย(dx)",
            rx: "สั่งยา(rx)",
            lab_results: "ผลแล็บ(lab_results)",
            xr_results: "ผล X-Ray(xr_results)"
        };
        return names[tab] || tab.toUpperCase();
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setFormData((prev) => {
            const newFormData = { ...prev };
            Object.keys(newFormData).forEach((key) => {
                newFormData[key] = newFormData[key].map((entry) => ({
                    ...entry,
                    icdOptions: []
                }));
            });
            return newFormData;
        });
        setText(null);
    };

    if (!patient_vitals) return <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div> <p>กำลังโหลดข้อมูล...</p></div>;

    return (
        <div className="container-fluid py-4">
            <style>
                {`
                    .diagnosis-tabs {
                        position: relative;
                        z-index: 100;
                    }
                    .diagnosis-tabs .nav-tabs {
                        border-bottom: none;
                        background: linear-gradient(180deg, #f8f9fa, #e9ecef);
                        padding: 0.5rem;
                        border-radius: 8px;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    }
                    .diagnosis-tabs .nav-link {
                        color: #6c757d;
                        padding: 1rem;
                        border: none;
                        border-radius: 6px;
                        transition: color 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
                        position: relative;
                    }
                    .diagnosis-tabs .nav-link:hover {
                        color: #0d6efd;
                        background-color: #f1f3f5;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        transform: translateY(-2px);
                    }
                    .diagnosis-tabs .nav-link.active {
                        color: #0d6efd !important;
                        background-color: #ffffff !important;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                        transform: translateY(-2px);
                        border-bottom: 3px solid #0d6efd;
                        animation: slideTab 0.3s ease-out;
                    }
                    .diagnosis-tabs .nav-link i {
                        transition: transform 0.3s ease;
                    }
                    .diagnosis-tabs .nav-link:hover i {
                        transform: scale(1.1);
                    }
                    @keyframes slideTab {
                        0% { opacity: 0.7; transform: translateY(10px); }
                        100% { opacity: 1; transform: translateY(-2px); }
                    }
                    .tab-content {
                        position: relative;
                        z-index: 200;
                        min-height: 100px;
                    }
                    .tab-pane {
                        width: 100%;
                        opacity: 0;
                        transform: translateX(-50px);
                        transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
                    }
                    .tab-pane.show.active {
                        position: relative;
                        opacity: 1;
                        transform: translateX(0);
                        animation: slideContent 0.5s ease-in-out;
                    }
                    @keyframes slideContent {
                        0% { opacity: 0; transform: translateX(-50px); }
                        100% { opacity: 1; transform: translateX(0); }
                    }
                    .dropdown-menu {
                        z-index: 10000 !important;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                        border: 1px solid #dee2e6;
                        border-radius: 4px;
                        background-color: #fff;
                        width: 100%;
                        max-width: 700px;
                        padding: 0;
                        position: absolute;
                        top: 100%;
                        left: 0;
                        max-height: 350px;
                        overflow-y: auto;
                        scrollbar-width: thin;
                        scrollbar-color: #6c757d #f8f9fa;
                    }
                    .dropdown-menu::-webkit-scrollbar {
                        width: 8px;
                    }
                    .dropdown-menu::-webkit-scrollbar-track {
                        background: #f8f9fa;
                        border-radius: 4px;
                    }
                    .dropdown-menu::-webkit-scrollbar-thumb {
                        background: #6c757d;
                        border-radius: 4px;
                    }
                    .dropdown-menu::-webkit-scrollbar-thumb:hover {
                        background: #5a6268;
                    }
                    .list-group-item-action {
                        padding: 8px 12px;
                        border-bottom: 1px solid #e9ecef;
                        cursor: pointer;
                    }
                    .list-group-item-action:last-child {
                        border-bottom: none;
                    }
                    .list-group-item-action:hover {
                        background-color: #f1f3f5;
                    }
                    .list-group-item-action.selected {
                        background-color: #e9ecef;
                        font-weight: bold;
                    }
                    .text-secondary {
                        color: #6c757d;
                    }
                    .saved-data-container {
                        position: relative;
                        z-index: 50;
                    }
                    .tab-badge {
                        position: absolute;
                        top: -5px;
                        right: -5px;
                        font-size: 0.75rem;
                        padding: 2px 6px;
                        border-radius: 10px;
                    }
                    .tab-count {
                        position: absolute;
                        top: -5px;
                        right: -5px;
                        font-size: 1.00rem;
                    }
                    .patient-info-section {
                        background: linear-gradient(180deg, #ffffff, #f8f9fa);
                        border-radius: 8px;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                        padding: 1.5rem;
                    }
                    .vital-signs-card, .other-info, .allergies-section {
                        background: #f8f9fa;
                        border-radius: 8px;
                        padding: 1.5rem;
                        margin-bottom: 1rem;
                    }
                    .allergy-card {
                        transition: transform 0.2s ease;
                    }
                    .allergy-card:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    }
 
                /* ในส่วน <style> ของโค้ด หรือในไฟล์ CSS แยก */
                .modal-extra-large {
                  max-width: 99% !important;
                  width: 1900px;
                  margin: 0.25rem auto;
                  height: 95vh;
                  display: flex;
                  flex-direction: column;
                }
                                
                /* ปรับสำหรับหน้าจอขนาดกลาง */
                @media (max-width: 1600px) {
                  .modal-extra-large {
                    max-width: 95% !important;
                    width: auto;
                    height: 85vh;
                  }
                }
                                
                /* ปรับสำหรับหน้าจอขนาดเล็ก (แท็บเล็ต/มือถือ) */
                @media (max-width: 1200px) {
                  .modal-extra-large {
                    max-width: 98% !important;
                    margin: 0.25rem auto;
                    height: 95vh; /* ใช้ความสูงเกือบเต็มหน้าจอในมือถือ */
                  }
                }
                                
                /* สไตล์ scrollbar */
                .modal-body {
                  scrollbar-width: thin;
                  scrollbar-color: #6c757d #f8f9fa;
                }
                                
                .modal-body::-webkit-scrollbar {
                  width: 10px; /* เพิ่มขนาด scrollbar เพื่อให้ใช้งานง่าย */
                }
                                
                .modal-body::-webkit-scrollbar-track {
                  background: #f8f9fa;
                  border-radius: 5px;
                }
                                
                .modal-body::-webkit-scrollbar-thumb {
                  background: #6c757d;
                  border-radius: 5px;
                }
                                
                .modal-body::-webkit-scrollbar-thumb:hover {
                  background: #5a6268;
                }
                  
                `}
            </style>

            <div className="row mb-1">
                <div className="col-12">
                    <div className="bg-white text-white border-bottom shadow-sm">
                        <div className="card-body position-relative ">
                            
                            <h2 className="text-start display-6 fw-semibold text-titlepage">แพทย์ตรวจโรค</h2>
                            <p className="mb-0">หน้าวินิจสัยโรค (ระบบแพทย์ตรวจโรค) หากรายไหนไม่มีการตรวจ หรือข้อมูล ให้ลบรายการออก แต่ถ้าหากมีมากกว่า 1 รายการ ให้กด ปุ่ม เพิ่มรายการใหม่</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row mb-4 g-3">
                <div className="col-12">
                    <div className="patient-info-section">
                        {/* Patient Header - Combined Info */}
                        <div className="row mb-4">
                            <div className="col-12">
                                <div className="card border border-1 shadow-sm">
                                    <div className="card-body">
                                        <div className="row align-items-center">
                                            <div className="col-md-8">
                                                <div className="d-flex align-items-center">
                                                    <div className="avatar-circle bg-primary text-white me-3 d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px', borderRadius: '50%' }}>
                                                        <i className="bi bi-person fs-4"></i>
                                                    </div>
                                                    <div>
                                                        <h3 className="mb-1 text-primary fw-bold">{patientData.thai_firstname} {patientData.thai_lastname}</h3>
                                                        <div className="d-flex align-items-center gap-3">
                                                            <span className="badge bg-primary fs-6 px-3 py-2">คิวที่: {patientData.queue_number}</span>
                                                            <div className="d-flex align-items-center text-muted">
                                                                <i className="bi bi-fingerprint me-1"></i>
                                                                <span className="fw-medium">{patientData.hn_patient_id}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-4 text-md-end">
                                                <div className="d-flex align-items-center justify-content-md-end">
                                                    <div className="avatar-circle bg-info text-white me-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', borderRadius: '50%' }}>
                                                        <i className="bi bi-calendar3"></i>
                                                    </div>
                                                    <div className="text-start">
                                                        <small className="text-muted d-block">วันที่เข้ารับบริการ</small>
                                                        <span className="fw-medium">{getCurrentDateAndTime().date}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* ข้อมูลผู้ป่วย - เรียบง่าย เบสิค อ่านง่าย */}
                        {activePatient && (
                            <div className="row g-3">
                                {/* Vital Signs Section */}
                                <div className="col-12  col-xl-4">
                                    <div className="card h-100 border-0 shadow-sm" style={{ maxHeight: '300px' }}>
                                        <div className="card-header" style={{ background: 'linear-gradient(180deg, #f8f9fa, #e9ecef)', padding: '1rem' }}>
                                            <h5 className="mb-0 text-dark d-flex align-items-center">
                                                <i className="bi bi-activity me-2"></i> สัญญาณชีพ
                                            </h5>
                                        </div>
                                        <div className="card-body p-3">
                                            {patient_vitals?.details?.patient_vitals?.map((vital, index) => (
                                                <div key={index} className="vital-grid">
                                                    <div className="row g-2">
                                                        {/* น้ำหนัก */}
                                                        <div className="col-6">
                                                            <div className="vital-item p-2 border rounded" style={{ backgroundColor: '#f8f9fa', borderColor: '#dee2e6 !important' }}>
                                                                <div className="d-flex align-items-center">
                                                                    <i className="bi bi-speedometer2 text-primary me-2"></i>
                                                                    <div className="flex-grow-1">
                                                                        <div className="small">
                                                                            <span className="text-muted">น้ำหนัก:</span> <span className="fw-bold">{vital.bw} kg</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* ส่วนสูง */}
                                                        <div className="col-6">
                                                            <div className="vital-item p-2 border rounded" style={{ backgroundColor: '#f8f9fa', borderColor: '#dee2e6 !important' }}>
                                                                <div className="d-flex align-items-center">
                                                                    <i className="bi bi-arrows-vertical text-primary me-2"></i>
                                                                    <div className="flex-grow-1">
                                                                        <div className="small">
                                                                            <span className="text-muted">ส่วนสูง:</span> <span className="fw-bold">{vital.height} cm</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* BMI */}
                                                        <div className="col-6">
                                                            <div className="vital-item p-2 border rounded" style={{ backgroundColor: '#f8f9fa', borderColor: '#dee2e6 !important' }}>
                                                                <div className="d-flex align-items-center">
                                                                    <i className="bi bi-calculator text-warning me-2"></i>
                                                                    <div className="flex-grow-1">
                                                                        <div className="small">
                                                                            <span className="text-muted">BMI:</span> <span className="fw-bold">{vital.bmi}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* อุณหภูมิ */}
                                                        <div className="col-6">
                                                            <div className="vital-item p-2 border rounded" style={{ backgroundColor: '#f8f9fa', borderColor: '#dee2e6 !important' }}>
                                                                <div className="d-flex align-items-center">
                                                                    <i className="bi bi-thermometer-half text-danger me-2"></i>
                                                                    <div className="flex-grow-1">
                                                                        <div className="small">
                                                                            <span className="text-muted">อุณหภูมิ:</span> <span className="fw-bold">{vital.temp}°C</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* ชีพจร */}
                                                        <div className="col-6">
                                                            <div className="vital-item p-2 border rounded" style={{ backgroundColor: '#f8f9fa', borderColor: '#dee2e6 !important' }}>
                                                                <div className="d-flex align-items-center">
                                                                    <i className="bi bi-heart-pulse text-success me-2"></i>
                                                                    <div className="flex-grow-1">
                                                                        <div className="small">
                                                                            <span className="text-muted">ชีพจร:</span> <span className="fw-bold">{vital.pulse} bpm</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* การหายใจ */}
                                                        <div className="col-6">
                                                            <div className="vital-item p-2 border rounded" style={{ backgroundColor: '#f8f9fa', borderColor: '#dee2e6 !important' }}>
                                                                <div className="d-flex align-items-center">
                                                                    <i className="bi bi-lungs text-info me-2"></i>
                                                                    <div className="flex-grow-1">
                                                                        <div className="small">
                                                                            <span className="text-muted">การหายใจ:</span> <span className="fw-bold">{vital.respiration} bpm</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* ความดันโลหิต */}
                                                        <div className="col-12">
                                                            <div className="vital-item p-2 border rounded" style={{ backgroundColor: '#f8f9fa', borderColor: '#dee2e6 !important' }}>
                                                                <div className="d-flex align-items-center">
                                                                    <i className="bi bi-droplet-fill text-danger me-2"></i>
                                                                    <div className="flex-grow-1">
                                                                        <div className="small">
                                                                            <span className="text-muted">ความดันโลหิต:</span> <span className="fw-bold fs-6">{vital.bp_systolic}/{vital.bp_diastolic} mmHg</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* ข้อมูลเพิ่มเติม */}
                                <div className="col-12  col-xl-4">
                                    <div className="card h-100 border-0 shadow-sm" style={{ maxHeight: '300px' }}>
                                        <div className="card-header" style={{ background: 'linear-gradient(180deg, #f8f9fa, #e9ecef)', padding: '1rem' }}>
                                            <h5 className="mb-0 text-dark d-flex align-items-center">
                                                <i className="bi bi-clipboard-data me-2"></i> ข้อมูลเพิ่มเติม
                                            </h5>
                                        </div>
                                        <div className="card-body p-3">
                                            {patient_vitals?.details?.patient_vitals?.map((vital, index) => (
                                                <div key={index} className="additional-info-grid">
                                                    <div className="row g-2">
                                                        {/* แถวที่ 1 */}
                                                        <div className="col-6">
                                                            <div className="info-item p-2 border rounded" style={{ backgroundColor: '#f8f9fa', borderColor: '#dee2e6 !important' }}>
                                                                <div className="d-flex align-items-center">
                                                                    <i className="bi bi-virus text-success me-2"></i>
                                                                    <div className="flex-grow-1">
                                                                        <div className="small">
                                                                            <span className="text-muted">สถานะ TB:</span> <span className="fw-bold">{vital.tb_status}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-6">
                                                            <div className="info-item p-2 border rounded" style={{ backgroundColor: '#f8f9fa', borderColor: '#dee2e6 !important' }}>
                                                                <div className="d-flex align-items-center">
                                                                    <i className="bi bi-eye text-primary me-2"></i>
                                                                    <div className="flex-grow-1">
                                                                        <div className="small">
                                                                            <span className="text-muted">สายตา:</span> <span className="fw-bold">{vital.eye_exam}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* แถวที่ 2 */}
                                                        <div className="col-6">
                                                            <div className="info-item p-2 border rounded" style={{ backgroundColor: '#f8f9fa', borderColor: '#dee2e6 !important' }}>
                                                                <div className="d-flex align-items-center">
                                                                    <i className="bi bi-search text-warning me-2"></i>
                                                                    <div className="flex-grow-1">
                                                                        <div className="small">
                                                                            <span className="text-muted">การคัดกรอง:</span> <span className="fw-bold">{vital.screening}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-6">
                                                            <div className="info-item p-2 border rounded" style={{ backgroundColor: '#f8f9fa', borderColor: '#dee2e6 !important' }}>
                                                                <div className="d-flex align-items-center">
                                                                    <i className="bi bi-cup-straw text-danger me-2"></i>
                                                                    <div className="flex-grow-1">
                                                                        <div className="small">
                                                                            <span className="text-muted">แอลกอฮอล์:</span> <span className="fw-bold">{vital.alcohol_status}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* แถวที่ 3 */}
                                                        <div className="col-6">
                                                            <div className="info-item p-2 border rounded" style={{ backgroundColor: '#f8f9fa', borderColor: '#dee2e6 !important' }}>
                                                                <div className="d-flex align-items-center">
                                                                    <i className="bi bi-fire text-secondary me-2"></i>
                                                                    <div className="flex-grow-1">
                                                                        <div className="small">
                                                                            <span className="text-muted">การสูบบุหรี่:</span> <span className="fw-bold">{vital.smoking_status}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-6">
                                                            <div className="info-item p-2 border rounded" style={{ backgroundColor: '#f8f9fa', borderColor: '#dee2e6 !important' }}>
                                                                <div className="d-flex align-items-center">
                                                                    <i className="bi bi-person-hearts text-info me-2"></i>
                                                                    <div className="flex-grow-1">
                                                                        <div className="small">
                                                                            <span className="text-muted">ตั้งครรภ์:</span> <span className="fw-bold">{vital.pregnancy_status}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* แถวที่ 4 */}
                                                        <div className="col-6">
                                                            <div className="info-item p-2 border rounded" style={{ backgroundColor: '#f8f9fa', borderColor: '#dee2e6 !important' }}>
                                                                <div className="d-flex align-items-center">
                                                                    <i className="bi bi-activity text-success me-2"></i>
                                                                    <div className="flex-grow-1">
                                                                        <div className="small">
                                                                            <span className="text-muted">GFR:</span> <span className="fw-bold">{vital.gfr_status}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-6">
                                                            <div className="info-item p-2 border rounded" style={{ backgroundColor: '#f8f9fa', borderColor: '#dee2e6 !important' }}>
                                                                <div className="d-flex align-items-center">
                                                                    <i className="bi bi-clipboard-heart text-info me-2"></i>
                                                                    <div className="flex-grow-1">
                                                                        <div className="small">
                                                                            <span className="text-muted">เหตุผลมาพบ:</span> <span className="fw-bold">{vital.visit_reason}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* ประวัติการแพ้ยา */}
                                <div className="col-12  col-xl-4">
                                    <div className="card h-100 border-0 shadow-sm" style={{ maxHeight: '280px' }}>
                                        <div className="card-header" style={{ background: 'linear-gradient(180deg, #f8f9fa, #e9ecef)', padding: '1rem' }}>
                                            <h5 className="mb-0 text-danger d-flex align-items-center">
                                                <i className="bi bi-exclamation-triangle me-2"></i> ประวัติการแพ้ยา
                                            </h5>
                                        </div>
                                        <div className="card-body p-0 overflow-auto" style={{ maxHeight: '500px' }}>

                                            <div className="p-3">
                                                {activePatient.drug_allergies.length > 0 ? (
                                                    activePatient.drug_allergies.map((allergy, index) => (
                                                        <>
                                                            <div key={index} className="mb-3 border border-danger rounded p-3" style={{ backgroundColor: '#fdf2f2' }}>
                                                                <div className="d-flex align-items-center mb-2">
                                                                    <div className="badge bg-danger me-2 p-1">
                                                                        <i className="bi bi-capsule"></i>
                                                                    </div>
                                                                    <div>
                                                                        <h6 className="mb-0 fw-bold text-danger">{allergy.med_name}</h6>
                                                                        <small className="text-muted">รหัส: {allergy.drug_code}</small>
                                                                    </div>
                                                                </div>

                                                                <div className="mb-2">
                                                                    <span className="badge bg-warning text-dark">
                                                                        ระดับ: {allergy.severity_description}
                                                                    </span>
                                                                </div>

                                                                <div className="mb-2">
                                                                    <div className="small">
                                                                        <span className="text-muted">รายละเอียด:</span> {allergy.details}
                                                                    </div>
                                                                </div>

                                                                <div className="mb-2">
                                                                    <div className="small">
                                                                        <span className="text-muted">ชื่อการแพ้:</span> {allergy.allergy_name}
                                                                    </div>
                                                                </div>

                                                                <div>
                                                                    <div className="small">
                                                                        <span className="text-muted">แหล่งที่มา:</span> {allergy.history_source_name}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div key={index} className="mb-3 border border-danger rounded p-3" style={{ backgroundColor: '#fdf2f2' }}>
                                                                <div className="d-flex align-items-center mb-2">
                                                                    <div className="badge bg-danger me-2 p-1">
                                                                        <i className="bi bi-capsule"></i>
                                                                    </div>
                                                                    <div>
                                                                        <h6 className="mb-0 fw-bold text-danger">{allergy.med_name}</h6>
                                                                        <small className="text-muted">รหัส: {allergy.drug_code}</small>
                                                                    </div>
                                                                </div>

                                                                <div className="mb-2">
                                                                    <span className="badge bg-warning text-dark">
                                                                        ระดับ: {allergy.severity_description}
                                                                    </span>
                                                                </div>

                                                                <div className="mb-2">
                                                                    <div className="small">
                                                                        <span className="text-muted">รายละเอียด:</span> {allergy.details}
                                                                    </div>
                                                                </div>

                                                                <div className="mb-2">
                                                                    <div className="small">
                                                                        <span className="text-muted">ชื่อการแพ้:</span> {allergy.allergy_name}
                                                                    </div>
                                                                </div>

                                                                <div>
                                                                    <div className="small">
                                                                        <span className="text-muted">แหล่งที่มา:</span> {allergy.history_source_name}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                    ))

                                                ) : (
                                                    <div className="alert alert-success border-success">
                                                        <div className="d-flex align-items-center">
                                                            <i className="bi bi-check-circle-fill me-2 fs-5"></i>
                                                            <div>
                                                                <h6 className="mb-0 fw-bold">ไม่พบประวัติการแพ้ยา</h6>
                                                                <small className="text-muted">ผู้ป่วยไม่มีประวัติการแพ้ยาที่บันทึกไว้</small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>



                                        </div>
                                    </div>

                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>


            <div className="card border-0 shadow-sm rounded-3 mb-4">
                <div className="card-body p-0">
                    <nav className="diagnosis-tabs">
                        <div className="nav nav-tabs nav-fill border-0" role="tablist">
                            {Object.keys(formData).map((tab, index) => (
                                <button
                                    key={index}
                                    className={`nav-link border-0 py-3 ${activeTab === tab ? "active" : ""}`}
                                    onClick={() => handleTabChange(tab)}
                                    id={`tab-${tab}`}
                                    data-bs-toggle="tab"
                                    data-bs-target={`#tab-pane-${tab}`}
                                    type="button"
                                    role="tab"
                                    aria-controls={`tab-pane-${tab}`}
                                    aria-selected={activeTab === tab}
                                >
                                    <div className="d-flex flex-column align-items-center position-relative">
                                        <i className={`bi ${getTabIcon(tab)} mb-1`} style={{ fontSize: '1.5rem' }}></i>
                                        <span>{getTabName(tab)}</span>
                                        {savedData && savedData.data[tab] && savedData.data[tab].length > 0 && (
                                            <span className="tab-count">
                                                {savedData.data[tab].length}
                                            </span>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </nav>
                </div>
            </div>

            <div className="tab-content">
                {Object.keys(formData).map((tab, index) => (
                    <div
                        key={index}
                        className={`tab-pane fade ${activeTab === tab ? "show active" : ""}`}
                        id={`tab-pane-${tab}`}
                        role="tabpanel"
                        aria-labelledby={`tab-${tab}`}
                    >
                        <div className="mb-3">
                            {Text && (
                                <div className="alert alert-danger d-flex align-items-center" role="alert">
                                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                    <div>{Text}</div>
                                </div>
                            )}
                            {formData[tab].length === 0 ? (
                                <div className="alert alert-info text-center">
                                    <i className="bi bi-info-circle me-2"></i>
                                    ยังไม่มีรายการใน {getTabName(tab)}. กรุณากด "เพิ่มรายการใหม่" เพื่อเริ่มกรอกข้อมูล
                                </div>
                            ) : (
                                formData[tab].map((form, formIndex) => (
                                    <div key={formIndex} className="card border-0 shadow-sm rounded-3 mb-4">
                                        <div className="card-header bg-transparent d-flex justify-content-between align-items-center py-3">
                                            <h5 className="mb-0 text-primary">
                                                <i className={`bi ${getTabIcon(tab)} me-2`}></i>
                                                {getTabName(tab)} <span className="text-secondary">รายการที่ {formIndex + 1}</span>
                                            </h5>
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => handleDeleteForm(tab, formIndex)}
                                            >
                                                <i className="bi bi-trash me-1"></i> ลบรายการ
                                            </button>
                                        </div>
                                        <div className="card-body p-4">
                                            <div className="row g-3">
                                                {tab === "cc" && (
                                                    <div className="col-12">
                                                        <div className="form-floating">
                                                            <input
                                                                type="text"
                                                                id={`cc-description-${formIndex}`}
                                                                value={form.description}
                                                                onChange={(e) => handleChange(tab, formIndex, "description", e.target.value)}
                                                                className="form-control"
                                                                placeholder="รายละเอียด"
                                                            />
                                                            <label htmlFor={`cc-description-${formIndex}`}>รายละเอียดอาการสำคัญ (CC)</label>
                                                        </div>
                                                    </div>
                                                )}
                                                {tab === "pi" && (
                                                    <div className="col-12">
                                                        <div className="form-floating">
                                                            <input
                                                                type="text"
                                                                id={`pi-description-${formIndex}`}
                                                                value={form.description}
                                                                onChange={(e) => handleChange(tab, formIndex, "description", e.target.value)}
                                                                className="form-control"
                                                                placeholder="รายละเอียด"
                                                            />
                                                            <label htmlFor={`pi-description-${formIndex}`}>รายละเอียดประวัติปัจจุบัน (PI)</label>
                                                        </div>
                                                    </div>
                                                )}
                                                {tab === "ph" && (
                                                    <div className="col-12">
                                                        <div className="form-floating">
                                                            <input
                                                                type="text"
                                                                id={`ph-description-${formIndex}`}
                                                                value={form.description}
                                                                onChange={(e) => handleChange(tab, formIndex, "description", e.target.value)}
                                                                className="form-control"
                                                                placeholder="รายละเอียด"
                                                            />
                                                            <label htmlFor={`ph-description-${formIndex}`}>รายละเอียดประวัติอดีต (PH)</label>
                                                        </div>
                                                    </div>
                                                )}
                                                {tab === "pe" && (
                                                    <>
                                                        <div className="col-md-8">
                                                            <div className="form-floating">
                                                                <input
                                                                    type="text"
                                                                    id={`pe-description-${formIndex}`}
                                                                    value={form.description}
                                                                    onChange={(e) => handleChange(tab, formIndex, "description", e.target.value)}
                                                                    className="form-control"
                                                                    placeholder="รายละเอียด"
                                                                />
                                                                <label htmlFor={`pe-description-${formIndex}`}>รายละเอียดการตรวจร่างกาย (PE)</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <div className="form-floating">
                                                                <input
                                                                    type="number"
                                                                    id={`pe-price-${formIndex}`}
                                                                    value={form.price}
                                                                    onChange={(e) => handleChange(tab, formIndex, "price", e.target.value)}
                                                                    className="form-control"
                                                                    placeholder="ราคา"
                                                                />
                                                                <label htmlFor={`pe-price-${formIndex}`}>ราคา (บาท)</label>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                                {tab === "prx" && (
                                                    <>
                                                        <input
                                                            type="hidden"
                                                            value={form.prcd_id}
                                                            onChange={(e) => handleChange(tab, formIndex, "prcd_id", e.target.value)}
                                                        />
                                                        <div className="col-md-6 position-relative">
                                                            <div className="form-floating">
                                                                <input
                                                                    type="text"
                                                                    id={`prx-name-${formIndex}`}
                                                                    value={form.procedure_name}
                                                                    onChange={(e) => handleChange(tab, formIndex, "procedure_name", e.target.value)}
                                                                    className="form-control"
                                                                    placeholder="รายละเอียด"
                                                                />
                                                                <label htmlFor={`prx-name-${formIndex}`}>รายการหัตถการ (PRX)</label>
                                                            </div>
                                                            {form.icdOptions && form.icdOptions.length > 0 && (
                                                                <ul
                                                                    className="list-group dropdown-menu show"
                                                                >
                                                                    {form.icdOptions.map((prx) => (
                                                                        <li
                                                                            key={prx.id}
                                                                            className="list-group-item list-group-item-action py-2"
                                                                            onClick={() => handPrxSelect(tab, formIndex, prx)}
                                                                            style={{
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                                padding: '10px 15px',
                                                                                borderLeft: '3px solid #0891b2',
                                                                                transition: 'all 0.2s ease',
                                                                                cursor: 'pointer'
                                                                            }}
                                                                        >
                                                                            <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                                                                <i className="bi bi-clipboard2-pulse" style={{ color: '#0891b2', marginRight: '10px', fontSize: '1.1rem' }}></i>
                                                                                <div>
                                                                                    <div style={{ fontWeight: '500', color: '#334155' }}>{prx.nameprcd}</div>
                                                                                    {prx.priceprcd && (
                                                                                        <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>
                                                                                            ราคา {prx.priceprcd} บาท
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            )}
                                                        </div>
                                                        <div className="col-md-3">
                                                            <div className="form-floating">
                                                                <input
                                                                    type="text"
                                                                    id={`prx-quantity-${formIndex}`}
                                                                    value={form.quantity}
                                                                    onChange={(e) => handleChange(tab, formIndex, "quantity", e.target.value)}
                                                                    className="form-control"
                                                                    placeholder="จำนวน"
                                                                />
                                                                <label htmlFor={`prx-quantity-${formIndex}`}>จำนวน</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <div className="form-floating">
                                                                <input
                                                                    type="number"
                                                                    id={`prx-price-${formIndex}`}
                                                                    value={form.price}
                                                                    onChange={(e) => handleChange(tab, formIndex, "price", e.target.value)}
                                                                    className="form-control"
                                                                    placeholder="ราคา"
                                                                />
                                                                <label htmlFor={`prx-price-${formIndex}`}>ราคาต่อหน่วย (บาท)</label>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                                {tab === "fu" && (
                                                    <>
                                                        <div className="col-md-4">
                                                            <div className="form-floating">
                                                                <input
                                                                    type="date"
                                                                    id={`fu-date-${formIndex}`}
                                                                    value={form.date}
                                                                    onChange={(e) => handleChange(tab, formIndex, "date", e.target.value)}
                                                                    className="form-control"
                                                                />
                                                                <label htmlFor={`fu-date-${formIndex}`}>วันที่นัด</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <div className="form-floating">
                                                                <input
                                                                    type="time"
                                                                    id={`fu-time-${formIndex}`}
                                                                    value={form.time}
                                                                    onChange={(e) => handleChange(tab, formIndex, "time", e.target.value)}
                                                                    className="form-control"
                                                                />
                                                                <label htmlFor={`fu-time-${formIndex}`}>เวลานัด</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <div className="form-floating">
                                                                <input
                                                                    type="text"
                                                                    id={`fu-details-${formIndex}`}
                                                                    value={form.details}
                                                                    onChange={(e) => handleChange(tab, formIndex, "details", e.target.value)}
                                                                    className="form-control"
                                                                    placeholder="รายละเอียด"
                                                                />
                                                                <label htmlFor={`fu-details-${formIndex}`}>รายละเอียดการนัด</label>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                                {tab === "dx" && (
                                                    <>
                                                        <input
                                                            type="hidden"
                                                            value={form.icd_id}
                                                            onChange={(e) => handleChange(tab, formIndex, "icd_id", e.target.value)}
                                                        />
                                                        <div className="col-md-3 position-relative">
                                                            <div className="form-floating">
                                                                <input
                                                                    type="text"
                                                                    id={`dx-code-${formIndex}`}
                                                                    value={form.code}
                                                                    onChange={(e) => handleChange(tab, formIndex, "code", e.target.value)}
                                                                    className="form-control"
                                                                    placeholder="รหัสโรค"
                                                                />
                                                                <label htmlFor={`dx-code-${formIndex}`}>รหัสโรค (ICD-10)</label>
                                                            </div>
                                                            {form.icdOptions && form.icdOptions.length > 0 && (
                                                                <ul
                                                                    className="list-group dropdown-menu show"
                                                                >
                                                                    {form.icdOptions.map((icd) => (
                                                                        <li
                                                                            key={icd.id}
                                                                            className="list-group-item list-group-item-action py-2"
                                                                            onClick={() => handleICDSelect(tab, formIndex, icd)}
                                                                            style={{
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                                padding: '10px 15px',
                                                                                borderLeft: '3px solid #0284c7',
                                                                                transition: 'all 0.2s ease',
                                                                                cursor: 'pointer'
                                                                            }}
                                                                        >
                                                                            <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                                                                <i className="bi bi-clipboard2-check" style={{ color: '#0284c7', marginRight: '10px', fontSize: '1.1rem' }}></i>
                                                                                <div>
                                                                                    <div style={{ fontWeight: '500', color: '#0f172a', fontSize: '1.05rem' }}>
                                                                                        {icd.icd10}
                                                                                    </div>
                                                                                    <div style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '2px' }}>
                                                                                        {icd.icd10name}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            )}
                                                        </div>
                                                        <div className="col-md-9">
                                                            <div className="form-floating">
                                                                <input
                                                                    type="text"
                                                                    id={`dx-desc-${formIndex}`}
                                                                    value={form.description}
                                                                    onChange={(e) => handleChange(tab, formIndex, "description", e.target.value)}
                                                                    className="form-control"
                                                                    placeholder="ชื่อโรค"
                                                                />
                                                                <label htmlFor={`dx-desc-${formIndex}`}>ชื่อโรค</label>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                                {tab === "rx" && (
                                                    <>
                                                        <input
                                                            type="hidden"
                                                            value={form.meditem_id}
                                                            onChange={(e) => handleChange(tab, formIndex, "meditem_id", e.target.value)}
                                                        />
                                                        <div className="col-md-4 position-relative">
                                                            <div className="form-floating">
                                                                <input
                                                                    type="text"
                                                                    id={`rx-name-${formIndex}`}
                                                                    value={form.medicine_name}
                                                                    onChange={(e) => handleChange(tab, formIndex, "medicine_name", e.target.value)}
                                                                    className="form-control"
                                                                    placeholder="ชื่อยา"
                                                                />
                                                                <label htmlFor={`rx-name-${formIndex}`}>ชื่อยา</label>
                                                            </div>
                                                            {form.icdOptions && form.icdOptions.length > 0 && (
                                                                <ul
                                                                    className="list-group dropdown-menu show"
                                                                >
                                                                    {form.icdOptions.map((meditem) => (
                                                                        <li
                                                                            key={meditem.id}
                                                                            className="list-group-item list-group-item-action py-2"
                                                                            onClick={() => handleMeditemSelect(tab, formIndex, meditem)}
                                                                        >
                                                                            <div>
                                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                                                    <i className="bi bi-capsule" style={{ color: '#2563eb' }} />
                                                                                    <span style={{
                                                                                        fontSize: '1.05rem',
                                                                                        fontWeight: '500',
                                                                                        color: '#1e40af',
                                                                                        backgroundColor: '#dbeafe',
                                                                                        padding: '2px 8px',
                                                                                        borderRadius: '4px'
                                                                                    }}>{meditem.name}</span>
                                                                                </div>
                                                                                <div className="d-flex gap-2 mt-1">
                                                                                    <span>รหัส: {meditem.stdcode}</span>
                                                                                    <span>ราคา: {meditem.price} บาท</span>
                                                                                </div>
                                                                            </div>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            )}
                                                        </div>
                                                        <div className="col-md-2">
                                                            <div className="form-floating">
                                                                <input
                                                                    type="text"
                                                                    id={`rx-dosage-${formIndex}`}
                                                                    value={form.dosage}
                                                                    onChange={(e) => handleChange(tab, formIndex, "dosage", e.target.value)}
                                                                    className="form-control"
                                                                    placeholder="รหัสวิธีใช้"
                                                                />
                                                                <label htmlFor={`rx-dosage-${formIndex}`}>รหัสวิธีใช้</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-2">
                                                            <div className="form-floating">
                                                                <input
                                                                    type="text"
                                                                    id={`rx-usage-${formIndex}`}
                                                                    value={form.usage_instruction}
                                                                    onChange={(e) => handleChange(tab, formIndex, "usage_instruction", e.target.value)}
                                                                    className="form-control"
                                                                    placeholder="วิธีใช้"
                                                                />
                                                                <label htmlFor={`rx-usage-${formIndex}`}>วิธีการใช้ยา</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-2">
                                                            <div className="form-floating">
                                                                <input
                                                                    type="number"
                                                                    id={`rx-quantity-${formIndex}`}
                                                                    value={form.quantity}
                                                                    onChange={(e) => handleChange(tab, formIndex, "quantity", e.target.value)}
                                                                    className="form-control"
                                                                    placeholder="จำนวน"
                                                                />
                                                                <label htmlFor={`rx-quantity-${formIndex}`}>จำนวน</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-2">
                                                            <div className="form-floating">
                                                                <input
                                                                    type="number"
                                                                    id={`rx-price-${formIndex}`}
                                                                    value={form.price}
                                                                    onChange={(e) => handleChange(tab, formIndex, "price", e.target.value)}
                                                                    className="form-control"
                                                                    placeholder="ราคา"
                                                                />
                                                                <label htmlFor={`rx-price-${formIndex}`}>ราคาต่อหน่วย (บาท)</label>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                                {tab === "lab_results" && (
                                                    <>
                                                        <input
                                                            type="hidden"
                                                            value={form.lab_data_id}
                                                            onChange={(e) => handleChange(tab, formIndex, "lab_data_id", e.target.value)}
                                                        />
                                                        <div className="col-md-3 position-relative">
                                                            <div className="form-floating">
                                                                <input
                                                                    type="text"
                                                                    id={`lab-name-${formIndex}`}
                                                                    value={form.test_name}
                                                                    onChange={(e) => handleChange(tab, formIndex, "test_name", e.target.value)}
                                                                    className="form-control"
                                                                    placeholder="ชื่อการตรวจ"
                                                                />
                                                                <label htmlFor={`lab-name-${formIndex}`}>ชื่อการตรวจ (LAB)</label>
                                                            </div>
                                                            {form.icdOptions && form.icdOptions.length > 0 && (
                                                                <ul
                                                                    className="list-group dropdown-menu show"
                                                                >
                                                                    {form.icdOptions.map((lab) => (
                                                                        <li
                                                                            key={lab.id}
                                                                            className="list-group-item list-group-item-action py-2"
                                                                            onClick={() => handLabelect(tab, formIndex, lab)}
                                                                            style={{ cursor: 'pointer' }}
                                                                        >
                                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                                <i className="bi bi-file-medical" style={{ color: '#0891b2' }} />
                                                                                <div>
                                                                                    <div style={{
                                                                                        color: '#0f172a',
                                                                                        fontSize: '1.05rem',
                                                                                        fontWeight: '500',
                                                                                        marginBottom: '2px'
                                                                                    }}>{lab.labname}</div>
                                                                                    <div style={{
                                                                                        color: '#64748b',
                                                                                        fontSize: '0.9rem'
                                                                                    }}>ราคา {lab.pricelab} บาท</div>
                                                                                </div>
                                                                            </div>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            )}
                                                        </div>
                                                        <div className="col-md-3">
                                                            <div className="form-floating">
                                                                <input
                                                                    type="number"
                                                                    id={`lab-price-${formIndex}`}
                                                                    value={form.price}
                                                                    onChange={(e) => handleChange(tab, formIndex, "price", e.target.value)}
                                                                    className="form-control"
                                                                    placeholder="ราคา"
                                                                />
                                                                <label htmlFor={`lab-price-${formIndex}`}>ราคา (บาท)</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <div className="form-floating">
                                                                <select
                                                                    id={`lab-result-${formIndex}`}
                                                                    value={form.result_value}
                                                                    onChange={(e) => handleChange(tab, formIndex, "result_value", e.target.value)}
                                                                    className="form-select"
                                                                >
                                                                    <option value="">เลือกสถานะ</option>
                                                                    <option value="ส่ง LAB">ส่ง LAB</option>
                                                                </select>
                                                                <label htmlFor={`lab-result-${formIndex}`}>ผลการตรวจ</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <div className="form-floating">
                                                                <select
                                                                    id={`lab-status-${formIndex}`}
                                                                    value={form.status_sen}
                                                                    onChange={(e) => handleChange(tab, formIndex, "status_sen", e.target.value)}
                                                                    className="form-select"
                                                                >
                                                                    <option value="">เลือกสถานะ</option>
                                                                    <option value="ส่งตรวจภายใน">ส่งตรวจภายใน</option>
                                                                    <option value="ส่งตรวจภายนอก">ส่งตรวจภายนอก</option>
                                                                </select>
                                                                <label htmlFor={`lab-status-${formIndex}`}>สถานะ LAB</label>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                                {tab === "xr_results" && (
                                                    <>
                                                        <input
                                                            type="hidden"
                                                            value={form.rxay_id}
                                                            onChange={(e) => handleChange(tab, formIndex, "rxay_id", e.target.value)}
                                                        />
                                                        <div className="col-md-8 position-relative">
                                                            <div className="form-floating">
                                                                <input
                                                                    type="text"
                                                                    id={`xr-desc-${formIndex}`}
                                                                    value={form.description}
                                                                    onChange={(e) => handleChange(tab, formIndex, "description", e.target.value)}
                                                                    className="form-control"
                                                                    placeholder="รายละเอียด"
                                                                />
                                                                <label htmlFor={`xr-desc-${formIndex}`}>รายละเอียด (X-Ray)</label>
                                                            </div>
                                                            {form.icdOptions && form.icdOptions.length > 0 && (
                                                                <ul
                                                                    className="list-group dropdown-menu show"
                                                                >
                                                                    {form.icdOptions.map((rxay) => (
                                                                        <li
                                                                            key={rxay.id}
                                                                            className="list-group-item p-0 mb-2 border-0"
                                                                            onClick={() => handRxayelect(tab, formIndex, rxay)}
                                                                        >
                                                                            <div style={{
                                                                                cursor: 'pointer',
                                                                                padding: '12px',
                                                                                borderRadius: '8px',
                                                                                border: '1px solid #e2e8f0',
                                                                                ':hover': {
                                                                                    borderColor: '#cbd5e1'
                                                                                }
                                                                            }}>
                                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                                    <i className="fas fa-x-ray fa-lg text-info me-1"></i>
                                                                                    <div>
                                                                                        <div style={{
                                                                                            color: '#0f172a',
                                                                                            fontSize: '1.05rem',
                                                                                            fontWeight: '500',
                                                                                            marginBottom: '2px'
                                                                                        }}>{rxay.xryname}</div>
                                                                                        <div style={{
                                                                                            color: '#64748b',
                                                                                            fontSize: '0.9rem'
                                                                                        }}>ราคา {rxay.pricexry} บาท</div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            )}
                                                        </div>
                                                        <div className="col-md-4">
                                                            <div className="form-floating">
                                                                <input
                                                                    type="number"
                                                                    id={`xr-price-${formIndex}`}
                                                                    value={form.price}
                                                                    onChange={(e) => handleChange(tab, formIndex, "price", e.target.value)}
                                                                    className="form-control"
                                                                    placeholder="ราคา"
                                                                />
                                                                <label htmlFor={`xr-price-${formIndex}`}>ราคา (บาท)</label>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <button
                                        type="button"
                                        className="btn btn-primary w-100 py-2"
                                        onClick={() => handleAddForm(tab)}
                                    >
                                        <i className="bi bi-plus-circle me-2"></i> เพิ่มรายการใหม่
                                    </button>
                                </div>
                                <div className="col-md-6">
                                    <button
                                        type="button"
                                        className="btn btn-success w-100 py-2"
                                        onClick={handleSave}
                                    >
                                        <i className="bi bi-check-circle me-2"></i> ตรวจสอบข้อมูล
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {savedData && Object.keys(savedData.data).length > 0 && (
                <div className="saved-data-container mt-4">
                    <Modal
                        show={savedData}
                        backdrop="static"
                        keyboard={false}
                        className="custom-modal"
                        style={{
                            '--bs-modal-border-radius': '20px', // เพิ่ม radius เพื่อความสวยงามใน Modal ขนาดใหญ่
                        }}
                        dialogClassName="modal-extra-large"
                    >
                        <Modal.Header
                            className="border-0 pb-2"
                            style={{
                                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                                borderRadius: '20px 20px 0 0',
                                padding: '1.5rem 2rem', // เพิ่ม padding เพื่อความสมดุล
                            }}
                        >
                            <Modal.Title className="w-100 text-center fw-bold " style={{ fontSize: '1.75rem' }}>
                                <h1 className="report-title">
                                    <i className="bi bi-file-earmark-medical me-3"></i>
                                    สรุปผลการตรวจ
                                </h1>

                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body
                            className=""
                            style={{
                                background: '#f8f9fa',
                                maxHeight: '80vh', // จำกัดความสูงเพื่อให้เลื่อนได้
                                overflowY: 'auto', // อนุญาตให้เลื่อน
                            }}
                        >
                            <div className="card border-0 shadow-sm rounded-3">
                                {/* <div className="card-body p-5"> */}
                                {/* <h4 className="text-primary text-center" style={{ fontSize: '1.5rem' }}>
                                        <i className="bi bi-clipboard-check me-2 "></i> ข้อมูลที่บันทึก
                                    </h4> */}
                                <DisplayDataxx savedData={savedData} />
                                {/* </div> */}
                            </div>
                        </Modal.Body>
                        <Modal.Footer
                            className="border-0 pt-0 "
                            style={{
                                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                                borderRadius: '0 0 20px 20px',
                                padding: '1.5rem 2rem',
                            }}
                        >
                            <button
                                type="button"
                                className="btn btn-outline-secondary px-5 py-2"
                                onClick={() => setSavedData(null)}
                            >
                                <i className="bi bi-x-circle me-2"></i> แก้ไขข้อมูล
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary px-5 py-2"
                                onClick={() => Update(patientData.queue_id)}
                            >
                                <i className="bi bi-save me-2"></i> บันทึกข้อมูล
                            </button>
                        </Modal.Footer>
                    </Modal>
                </div>
            )}
        </div>
    );
};

export default Pat_checks_fordisease_create_ball;