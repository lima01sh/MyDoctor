import React , { useState, useEffect }from 'react'
import { Link,useLocation ,useNavigate} from 'react-router-dom'
import "./registration.css";

import { APi_URL_UAT } from "../../auth/config";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAddressCard,faHospitalUser,faFileWaveform,faHandHoldingMedical,faPrint,faPills } from '@fortawesome/free-solid-svg-icons'

import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { el } from 'date-fns/locale';


import Swal from "sweetalert2";

const PatienHistoryTake = () => {
    const location = useLocation();
    const { state } = location; 
    const hn_patient_id = state.hn_patient_id; 
    const clinic_id = localStorage.getItem('clinic_id');

    const apiKey = localStorage.getItem("token"); // ใส่ API Key ที่นี่
    // steps
    const steps = [
    {
        label: 'ซักประวัติ',
        description: `ข้อมูลผู้ป่วย`,
    },
    {
        label: 'บล็อกยา/กรณีแพ้ยา',
        description:
        'บล็อกยา/กรณีแพ้ยาของผู้ป่วย',
    },
    {
        label: 'ขึ้นทะเบียนรักษา',
        description: `รับคิวรักษา`,
    },
    ];
    const [activeStep, setActiveStep] = React.useState(0);
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };
    // steps

    // case Submit
    const navigate = useNavigate('');

    const apiUrl = `${APi_URL_UAT}Pat_checks_fordisease`;
    const apiUrlQ = `${APi_URL_UAT}add_queue`;
    const apiUrlBlockmedi = `${APi_URL_UAT}drug_allergy`;


    function refreshPage() {
        window.location.reload(false);
    }

    const [isChecked, setIsChecked] = useState('active');
    const [selectedOption, setSelectedOption] = useState('ไม่แพ้ยา');

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
        setIsChecked(!isChecked)
    };

    const [formData, setFormData] = useState({
        temp: "", 
        pulse: "",
        respiration: "",
        bpSystolic: "",
        bpDiastolic: "",
        tbStatus: "",
        eyeExam: "",
        screening: "",
        alcoholStatus: "",
        smokingStatus: "",
        pregnancyStatus: "",
        gfrStatus: "",
        visitReason: "",
    });

    const [isActive, setIsActive] = useState('');
    // console.log("Active"+isActive);
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value || ""  });
    };

    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [bmi, setBmi] = useState(null);

    const calculateBmi = () => {
        console.log(weight);
        console.log(height);
        if (!weight || !height) {
            Swal.fire({
                title: "คำแนะนำ!",
                text: "เพิ่มข้อมูลน้ำหนักส่วนสูง เพื่อคำนวนค่า BMI!",
                icon: "info",
                showCancelButton: false,
                confirmButtonText: "เข้าใจแล้ว",
                });
            return;
        }

        const heightInMeters = parseFloat(height) / 100;
        const bmiValue = (parseFloat(weight) / (heightInMeters * heightInMeters)).toFixed(2);
        setBmi(bmiValue);
    };

    const name = state.thai_prefix+" "+state.thai_firstname+" "+state.thai_lastname; 
    const type = "ผู้ป่วย";
    const [dataQ, setdataQ] = useState({});
    const [time, settime] = useState('');
    const [date, setdate] = useState('');
    const handleQReport = () => {
        const printUrl = `https://www.addpay.co.th/service-ui/service-my-clinic/service-my-monitor/QueueCard/?queue_no=${dataQ.queue_number}&hn=${hn_patient_id}&name=${name}&type=${type}&date=${date}&time=${time}`;
        const printWindow = window.open(printUrl, '_blank', 'width=600,height=400');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const myHeadersQ = new Headers();
        myHeadersQ.append("Content-Type", "application/json");
        myHeadersQ.append("X-API-KEY", apiKey);

        const date = new Date();
        var mm = ("0" + (date.getMonth() + 1)).slice(-2);
        var dd =("0" + (date.getDate())).slice(-2);
        var yy = date.getFullYear();
        var dateString = yy + '-' + mm + '-' + dd;

        const time = date.toLocaleTimeString();
        console.log(dateString+" time "+time);
    
        const rawQ = JSON.stringify({
            "hn_patient_id": hn_patient_id,
            "appointment_time": dateString,
            "time": time,
            "name": name,
            "clinic_id": clinic_id,
        });

        const requestOptionsQ = {
            method: "POST",
            headers: myHeadersQ,
            body: rawQ,
            redirect: "follow"
        };

        fetch(apiUrlQ, requestOptionsQ)
        .then((response) => response.json())
        .then((result) =>  {
            if (result.success=== true) {
                console.log(result)
                setdataQ(result.data)
                settime(time)
                setdate(dateString)
                localStorage.setItem("queue_id",result.data.queue_id)
                historyTakeSave(result.data.history_id)
            }else{
            Swal.fire({
                title: "Error!",
                text:
                    "เกิดข้อผิดพลาด Add Queue (" + result.message + ")",
                icon: "error",
                confirmButtonText: "OK",
                });
            }})
        .catch((error) => console.error(error));

    };
    const historyTakeSave =(id)=>{
        console.log("บันทึกข้อมูล:", { 
        temp: formData.temp || "", 
        pulse: formData.pulse || "", 
        respiration: formData.respiration || "", 
        bpSystolic: formData.bpSystolic || "", 
        bpDiastolic: formData.bpDiastolic || "", 
        tbStatus: formData.tbStatus || "", 
        eyeExam: formData.eyeExam || "", 
        alcoholStatus: formData.alcoholStatus || "",
        smokingStatus: formData.smokingStatus || "",
        pregnancyStatus: formData.pregnancyStatus || "",
        screening: formData.screening || "",
        gfrStatus: formData.gfrStatus || "",
        visitReason: formData.visitReason || "",
        });

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-API-KEY", apiKey);

        const raw = JSON.stringify({
        "data": {
            "patient_vitals": [
            {
                "hn_patient_id": hn_patient_id,
                "bw": weight,
                "height": height,
                "bmi": bmi,
                "temp": formData.temp || "",
                "pulse": formData.pulse || "",
                "respiration": formData.respiration || "",
                "bp_systolic": formData.bpSystolic || "",
                "bp_diastolic": formData.bpDiastolic || "",
                "tb_status": formData.tbStatus || "",
                "eye_exam": formData.eyeExam || "",
                "screening": formData.screening || "",
                "alcohol_status": formData.alcoholStatus || "",
                "smoking_status": formData.smokingStatus || "",
                "pregnancy_status": formData.pregnancyStatus || "",
                "gfr_status": formData.gfrStatus || "",
                "visit_reason": formData.visitReason || "",
                "drug_allergy": selectedOption||"ไม่แพ้ยา" || "",
                "treatment_history_id": id,
                "clinic_id": clinic_id,
            }
            ]
        }
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch(apiUrl, requestOptions)
        .then((response) => response.json())
        .then((result) => {
        if (result.success=== true) {
            const hn_patient_id_send=hn_patient_id;
            Swal.fire({
            title: "Success!",
            text: "ขึ้นทะเบียนรักษาสำเร็จ "+hn_patient_id_send,
            icon: "success",
            showCancelButton: false,
            confirmButtonText: "OK",
            }).then((result) => {
            if (result.isConfirmed) {
                setIsActive('d-none');
                // setQueue_id(queue_id)
            }});
        } else {
            Swal.fire({
            title: "Error!",
            text:
                "เกิดข้อผิดพลาด (" + result.message + ")",
            icon: "error",
            confirmButtonText: "OK",
            });
        }
        })
        .catch((error) => console.error(error));

        // รีเซ็ตค่า form หลังบันทึก
        setFormData({ 
            temp: "", 
            pulse: "",
            respiration: "",
            bpSystolic: "",
            bpDiastolic: "",
            tbStatus: "",
            eyeExam: "",
            screening: "",
            alcoholStatus: "",
            smokingStatus: "",
            pregnancyStatus: "",
            gfrStatus: "",
            visitReason: "",
        });
    }


    // Block
    // fatch
    const apiUrl_optdrug = APi_URL_UAT+"opt_drug_allergies";
    const [drug_allergies, setDrug_allergies] = useState([]);
    const apiUrl_drug = APi_URL_UAT+"listdrug_allergies&hn_patient_id="+hn_patient_id+"&clinic_id="+clinic_id;
    const [drug_allergieslist, setDrug_allergieslist] = useState({});


    const listopt_drug_allergies = () => {
        const myHeaders = new Headers();
        myHeaders.append("X-API-KEY", apiKey);

        const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
        };

        fetch(
        apiUrl_optdrug,requestOptions
        )
        .then((response) => response.json())
        .then((result) => {
            console.log(result)
            if (result.success) {
                setDrug_allergies(result.data);
            }
        })
        .catch((error) => console.error(error));
    };

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
        listdrug_allergies();
        listopt_drug_allergies();
    }, []);

    const [formDrugData, setFormDrugData] = useState({
        drug_code: "", 
        med_name: "",
        allergy_types: "",
        severity_levels: "",
        detail: "",
        history_sources: "",
    });
    const handleDrugChange = (e) => {
    setFormDrugData({ ...formDrugData, [e.target.name]: e.target.value });
    };

    const handleDrugSubmit = (e) => {
        e.preventDefault();
        console.log(formDrugData);

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-API-KEY", apiKey);

        const raw = JSON.stringify({
        "hn_patient_id": hn_patient_id,
        "drug_code": formDrugData.drug_code,
        "med_name": formDrugData.med_name,
        "allergy_type_id": formDrugData.allergy_types,
        "severity_level": formDrugData.severity_levels||"",
        "clinic_id": clinic_id,
        "details": formDrugData.detail||"",
        "history_sources": formDrugData.history_sources||"",
        });

        const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
        };

        fetch(apiUrlBlockmedi, requestOptions)
        .then((response) => response.json())
        .then((result) => {
        if (result.success=== true) {
            const hn_patient_id_send=hn_patient_id;
            Swal.fire({
            title: "Success!",
            text: "บล็อกยาเพิ่มเติมสำเร็จ "+hn_patient_id_send,
            icon: "success",
            showCancelButton: false,
            confirmButtonText: "OK",
            }).then((result) => {
            if (result.isConfirmed) {
                listdrug_allergies();
                setFormDrugData({ 
                    drug_code: "", 
                    med_name: "",
                    allergy_types: "",
                    severity_levels: "",
                    detail: "",
                    history_sources: "",
                });
            }});
        } else {
            Swal.fire({
            title: "Error!",
            text:
                "เกิดข้อผิดพลาด (" + result.message + ")",
            icon: "error",
            confirmButtonText: "OK",
            });
        }
        })
        .catch((error) => console.error(error));
    };

    return (
        <div>
            <div className="p-4 mb-5 ">
                <h2 className="text-start display-6 fw-semibold text-titlepage">ซักประวัติ</h2>
                <nav aria-label="breadcrumb" className="bg-light rounded-2 px-3 p-2">
                    <ol className="breadcrumb mb-0">
                        <li className="breadcrumb-item"><Link to="/registration" className="breadcrumb-link"><FontAwesomeIcon className="me-1" icon={faAddressCard} />เวชระเบียน</Link></li>
                        <li className="breadcrumb-item"><Link to="/patientinfo" 
                        state={{hn_patient_id: hn_patient_id,
                            thai_prefix: state.thai_prefix,
                            thai_firstname: state.thai_firstname,
                            thai_lastname: state.thai_lastname,
                        }} className="breadcrumb-link"><FontAwesomeIcon className="me-1" icon={faHospitalUser} />ข้อมูลผู้ป่วย</Link></li>
                        <li className="breadcrumb-item mb-0 active" aria-current="page"><FontAwesomeIcon className="me-1" icon={faFileWaveform} />ซักประวัติ</li>
                    </ol>
                </nav>
                <div className="mt-5">
                    <div className="card">
                        <div className="card-header fs-5 fw-semibold">
                            รหัสผู้ป่วย : {hn_patient_id}
                        </div>
                        <div className="card-body pt-5">
                            <Box sx={{ width: '100%' }}>
                                <Stepper activeStep={activeStep} alternativeLabel>
                                    {steps.map((step, index) => {
                                    const stepProps = {};
                                    const labelProps = {};
                                    return (
                                        <Step key={step.label} {...stepProps}>
                                        <StepLabel {...labelProps}>
                                            <p className="mb-0 fs-6">{step.label}</p>
                                            </StepLabel>
                                        </Step>
                                    );
                                    })}
                                </Stepper>
                                 
                                {activeStep === steps.length ? (
                                    <React.Fragment>
                                        <p sx={{ mt: 2, mb: 1 }}>
                                            All steps completed - you&apos;re finished
                                        </p>
                                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                            <Box sx={{ flex: '1 1 auto' }} />
                                            <Link to="/registration" onClick={handleReset} className="btn btn-nav">กลับเวชระเบียน</Link>
                                        </Box>
                                    </React.Fragment>
                                ) : (
                                    <React.Fragment>
                                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 1 }}>
                                            <Button
                                            color="inherit"
                                            disabled={activeStep === 0}
                                            onClick={handleBack}
                                            sx={{ mr: 1 }}
                                            className="btn btn-nav"
                                            >
                                            Back
                                            </Button>
                                            <Box sx={{ flex: '1 1 auto' }} />
                                            
                                            {activeStep === steps.length - 1 ? 
                                            ""
                                            : <Button onClick={handleNext} className="btn btn-nav">Next</Button>
                                            }
                                            
                                        </Box>
                                        <hr className="mt-12 mb-5"/>
                                        <Box> 
                                           
                                            {activeStep === 0?(
                                                <div className="mb-3">
                                                    <div className={`${isActive}`}>
                                                        <form onSubmit={handleSubmit}>
                                                            <div className="row g-3">
                                                                <div className="row d-flex flex-column flex-md-row-reverse">
                                                                    <div className="col-12">
                                                                        <p className="text-center fs-4 text-titlepage">ข้อมูลผู้ป่วย</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="row">
                                                                <div className="col-lg-3">
                                                                    <p className="mb-0 fw-normal col-form-label">น้ำหนัก (BW) :</p>
                                                                    <div className="input-group">
                                                                        <input type="number" className="form-control" name="bw" step="any" min="0"
                                                                        value={weight||""} 
                                                                        onChange={(e) => setWeight(e.target.value)} required />
                                                                        <span className="input-group-text">kg</span>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-3">
                                                                    <p className="mb-0 fw-normal col-form-label">ส่วนสูง (Height) :</p>
                                                                    <div className="input-group">
                                                                        <input type="number" className="form-control" name="height" min="0"
                                                                        value={height||""} 
                                                                        onChange={(e) => setHeight(e.target.value)} required />
                                                                        <span className="input-group-text">cm</span>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-3">
                                                                    <p className="mb-0 fw-normal col-form-label ">ดัชนีมวลกาย (BMI) : </p>
                                                                    <div className="input-group mb-3">
                                                                        <button className="btn btn-primary" type="button" onClick={calculateBmi}>คำนวน</button>
                                                                        <input type="number" className="form-control text-end" name="bmi" step="any" disabled
                                                                            value={bmi||""} onChange={handleChange} required />
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-3">
                                                                    <p className="mb-0 fw-normal col-form-label">อุณหภูมิร่างกาย (Temp) : </p>
                                                                    <div className="input-group">
                                                                        <input type="number" className="form-control ms-auto" name="temp" step="any" 
                                                                        value={formData.temp} onChange={handleChange} required />
                                                                        <span className="input-group-text">°C</span>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-3">
                                                                    <p className="mb-0 fw-normal col-form-label">ชีพจร (Pulse) : </p>
                                                                    <div className="input-group">
                                                                        <input type="number" className="form-control" name="pulse" step="any"
                                                                        value={formData.pulse} onChange={handleChange} required />
                                                                        <span className="input-group-text">ครั้งต่อนาที</span>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-3">
                                                                    <p className="mb-0 fw-normal col-form-label">การหายใจ (Respiration) : </p>
                                                                    <div className="input-group">
                                                                        <input type="number" className="form-control" name="respiration" step="any"
                                                                        value={formData.respiration} onChange={handleChange} required />
                                                                        <span className="input-group-text">ครั้งต่อนาที</span>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-3">
                                                                    <p className="mb-0 fw-normal col-form-label">ความดันโลหิตซิสโตลิก (BP Systolic) : </p>
                                                                    <div className="input-group">
                                                                        <input type="number" className="form-control" name="bpSystolic" step="any"
                                                                        value={formData.bpSystolic} onChange={handleChange} required />
                                                                        <span className="input-group-text">มิลลิเมตรปรอท</span>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-3">
                                                                    <p className="mb-0 fw-normal col-form-label">ความดันโลหิตไดแอสโตลิก (BP Diastolic) : </p>
                                                                    <div className="input-group">
                                                                        <input type="number" className="form-control" name="bpDiastolic" step="any"
                                                                        value={formData.bpDiastolic} onChange={handleChange} required />
                                                                        <span className="input-group-text">มิลลิเมตรปรอท</span>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-4">
                                                                    <p className="mb-0 fw-normal col-form-label ">สถานะวัณโรค (TB Status) : </p>
                                                                    <select
                                                                    className="form-select"
                                                                    required
                                                                    name="tbStatus"
                                                                    value={formData.tbStatus}
                                                                    onChange={handleChange}
                                                                    >
                                                                        <option  value="" selected disabled>
                                                                            เลือก
                                                                        </option>
                                                                        <option value="ไม่เป็นวัณโรค">ไม่เป็นวัณโรค</option>
                                                                        <option value="เป็นวัณโรค">เป็นวัณโรค</option>
                                                                    </select>
                                                                </div>
                                                                <div className="col-lg-4">
                                                                    <p className="mb-0 fw-normal col-form-label ">การตรวจตา (Eye Exam) : </p>
                                                                    <input type="text" className="form-control" name="eyeExam"
                                                                    value={formData.eyeExam} onChange={handleChange} required />
                                                                </div>
                                                                <div className="col-lg-4">
                                                                    <p className="mb-0 fw-normal col-form-label ">การคัดกรอง (Screening) : </p>
                                                                    {/* <input type="text" className="form-control" name="screening"
                                                                    value={formData.screening||""} onChange={handleChange} required /> */}
                                                                    <select
                                                                    className="form-select"
                                                                    required
                                                                    name="screening"
                                                                    value={formData.screening}
                                                                    onChange={handleChange}
                                                                    >
                                                                        <option  value="" selected disabled>
                                                                            เลือก
                                                                        </option>
                                                                        <option value="ไม่ผ่าน">ไม่ผ่าน</option>
                                                                        <option value="ผ่าน">ผ่าน</option>
                                                                    </select>
                                                                </div>
                                                                <div className="col-lg-4">
                                                                    <p className="mb-0 fw-normal col-form-label ">สถานะการดื่มแอลกอฮอล์ (Alcohol Status) : </p>
                                                                    <select
                                                                    className="form-select"
                                                                    required
                                                                    name="alcoholStatus"
                                                                    value={formData.alcoholStatus}
                                                                    onChange={handleChange}
                                                                    >
                                                                        <option  value="" selected disabled>
                                                                            เลือก
                                                                        </option>
                                                                        <option value="ไม่ดื่ม">ไม่ดื่ม</option>
                                                                        <option value="ดื่ม">ดื่ม</option>
                                                                    </select>
                                                                </div>
                                                                <div className="col-lg-4">
                                                                    <p className="mb-0 fw-normal col-form-label ">สถานะการสูบบุหรี่ (Smoking Status) : </p>
                                                                    <select
                                                                    className="form-select"
                                                                    required
                                                                    name="smokingStatus"
                                                                    value={formData.smokingStatus}
                                                                    onChange={handleChange}
                                                                    >
                                                                        <option  value="" selected disabled>
                                                                            เลือก
                                                                        </option>
                                                                        <option value="ไม่สูบบุหรี่">ไม่สูบบุหรี่</option>
                                                                        <option value="สูบบุหรี่">สูบบุหรี่</option>
                                                                    </select>
                                                                </div>
                                                                <div className="col-lg-4">
                                                                    <p className="mb-0 fw-normal col-form-label ">สถานะการตั้งครรภ์ (Pregnancy Status) : </p>
                                                                    <select
                                                                    className="form-select"
                                                                    required
                                                                    name="pregnancyStatus"
                                                                    value={formData.pregnancyStatus}
                                                                    onChange={handleChange}
                                                                    >
                                                                        <option  value="" selected disabled>
                                                                            เลือก
                                                                        </option>
                                                                        <option value="ไม่ตั้งครรภ์">ไม่ตั้งครรภ์</option>
                                                                        <option value="ตั้งครรภ์">ตั้งครรภ์</option>
                                                                    </select>
                                                                </div>
                                                                <div className="col-lg-4">
                                                                    <p className="mb-0 fw-normal col-form-label ">สถานะการกรองของไต (GFR Status) : </p>
                                                                    <input type="text" className="form-control" name="gfrStatus"
                                                                    value={formData.gfrStatus} onChange={handleChange} required />
                                                                </div>
                                                                <div className="col-lg-8">
                                                                    <p className="mb-0 fw-normal col-form-label ">สาเหตุที่ผู้ป่วยมาใช้บริการ (Visit Reason) : </p>
                                                                    <input type="text" className="form-control" name="visitReason"
                                                                    value={formData.visitReason} onChange={handleChange} required />
                                                                </div>
                                                                <div className="col-lg-8">
                                                                    <p className="mb-0 fw-normal col-form-label ">การแพ้ยา (Drug Allergy) : </p>
                                                                    {selectedOption === 'ไม่แพ้ยา' && (
                                                                    <div className="btn-group mt-3">
                                                                        <label className="btn btn-primary px-5" >
                                                                            <input className="btn-check active"  type="radio" 
                                                                            value="ไม่แพ้ยา"
                                                                            checked={selectedOption === 'ไม่แพ้ยา'}
                                                                            onChange={handleOptionChange} /> 
                                                                            ไม่แพ้ยา
                                                                        </label>
                                                                        <label className="btn btn-outline-primary px-5" >
                                                                            <input className="btn-check" type="radio" 
                                                                            value="แพ้ยา"
                                                                            checked={selectedOption === 'แพ้ยา'}
                                                                            onChange={handleOptionChange}  />
                                                                            แพ้ยา
                                                                        </label>
                                                                    </div>
                                                                    )}

                                                                    {selectedOption === 'แพ้ยา' && (
                                                                    <div className="btn-group mt-3">
                                                                        <label className="btn btn-outline-primary px-5" >
                                                                            <input className="btn-check active"  type="radio" 
                                                                            value="ไม่แพ้ยา"
                                                                            checked={selectedOption === 'ไม่แพ้ยา'}
                                                                            onChange={handleOptionChange} /> 
                                                                            ไม่แพ้ยา
                                                                        </label>
                                                                        <label className="btn btn-primary px-5" >
                                                                            <input className="btn-check" type="radio" 
                                                                            value="แพ้ยา"
                                                                            checked={selectedOption === 'แพ้ยา'}
                                                                            onChange={handleOptionChange}  />
                                                                            แพ้ยา
                                                                        </label>
                                                                    </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="mt-4">
                                                                <div className="text-center">
                                                                    <p>กรุณาตรวจสอบความถูกต้องของข้อมูล</p>
                                                                    <p>หากข้อมูลครบถ้วน <span className="text-primary">กรุณาคลิกที่ปุ่ม "ขึ้นทะเบียนรักษา"</span></p>
                                                                </div>
                                                                <div className="mb-3">
                                                                    <div className="col-12 text-center mt-5">
                                                                        <div className="d-grid gap-2 col-6 mx-auto">
                                                                            <button type="submit" className="btn btn-primary py-2"><FontAwesomeIcon icon={faHospitalUser} className="me-2" />ขึ้นทะเบียนรักษา</button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>
                                                       
                                                    <div className={`${isActive?`d-block`:`d-none`}`}>
                                                        <div className="text-center">
                                                            <p>ขึ้นทะเบียนรักษาสำเร็จ ดำเนินการขั้นตอนถัดไป</p>
                                                        </div>
                                                    </div>
                                                </div>
 
                                            ) : activeStep === 1?(
                                                <div className="mb-3 text-center">
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

                                                    <p className="text-center fs-5 mt-5">ผู้ป่วยมีอาการแพ้ยาเพิ่มเติมหรือไม่</p>
                                                    <div className="d-flex justify-content-center mb-5">
                                                        <div className="">
                                                            {selectedOption === 'ไม่แพ้ยา' && (
                                                            <div className="btn-group">
                                                                <label className="btn btn-primary px-5" >
                                                                    <input className="btn-check active"  type="radio" 
                                                                    value="ไม่แพ้ยา"
                                                                    checked={selectedOption === 'ไม่แพ้ยา'}
                                                                    onChange={handleOptionChange} /> 
                                                                    ไม่แพ้ยา
                                                                </label>
                                                                <label className="btn btn-outline-primary px-5" >
                                                                    <input className="btn-check" type="radio" 
                                                                    value="แพ้ยา"
                                                                    checked={selectedOption === 'แพ้ยา'}
                                                                    onChange={handleOptionChange}  />
                                                                    แพ้ยา
                                                                </label>
                                                            </div>
                                                            )}
                                                            {selectedOption === 'แพ้ยา' && (
                                                            <div className="btn-group">
                                                                <label className="btn btn-outline-primary px-5" >
                                                                    <input className="btn-check active"  type="radio" 
                                                                    value="ไม่แพ้ยา"
                                                                    checked={selectedOption === 'ไม่แพ้ยา'}
                                                                    onChange={handleOptionChange} /> 
                                                                    ไม่แพ้ยา
                                                                </label>
                                                                <label className="btn btn-primary px-5" >
                                                                    <input className="btn-check" type="radio" 
                                                                    value="แพ้ยา"
                                                                    checked={selectedOption === 'แพ้ยา'}
                                                                    onChange={handleOptionChange}  />
                                                                    แพ้ยา
                                                                </label>
                                                            </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {/*  */}
                                                    {selectedOption === 'แพ้ยา' && (
                                                    <div>
                                                        <form onSubmit={handleDrugSubmit}>
                                                            <div className="text-start">
                                                                <div className="row g-3">
                                                                    <div className="row d-flex flex-column flex-md-row-reverse">
                                                                        <div className="col-12">
                                                                            <p className="fs-4 text-titlepage">บล็อกยา/กรณีแพ้ยา</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="row">
                                                                    <div className="col-lg-4">
                                                                        <p className="mb-0 fw-normal col-form-label ">รหัสยา : </p>
                                                                        <input type="text" className="form-control" name="drug_code"
                                                                            value={formDrugData.drug_code} onChange={handleDrugChange} required />
                                                                    </div>
                                                                    <div className="col-lg-8">
                                                                        <p className="mb-0 fw-normal col-form-label ">ชื่อยา :</p>
                                                                        <input type="text" className="form-control" name="med_name"
                                                                        value={formDrugData.med_name} onChange={handleDrugChange} required />
                                                                    </div>
                                                                    <div className="col-lg-4">
                                                                        <p className="mb-0 fw-normal col-form-label ">การแพ้ยา : </p>
                                                                        <select
                                                                        className="form-select"
                                                                        required
                                                                        name="allergy_types"
                                                                        value={formDrugData.allergy_types}
                                                                        onChange={handleDrugChange}
                                                                        >
                                                                            <option  value="" selected disabled>
                                                                                เลือก
                                                                            </option>
                                                                            {drug_allergies.allergy_types.map((item) => (
                                                                                <option key={item.id} value={item.id}>
                                                                                ({item.id}) {item.allergy_name}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                    </div>
                                                                    <div className="col-lg-4">
                                                                        <p className="mb-0 fw-normal col-form-label ">ระดับการแพ้ยา : </p>
                                                                        <select
                                                                        className="form-select"
                                                                        required
                                                                        name="severity_levels"
                                                                        value={formDrugData.severity_levels}
                                                                        onChange={handleDrugChange}
                                                                        >
                                                                            <option  value="" selected disabled>
                                                                                เลือก
                                                                            </option>
                                                                            {drug_allergies.severity_levels.map((item) => (
                                                                                <option key={item.severity_level} value={item.severity_level}>
                                                                                ({item.severity_level}) {item.severity_description}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                    </div>
                                                                    <div className="col-lg-4">
                                                                        <p className="mb-0 fw-normal col-form-label ">ที่มาของข้อมูล : </p>
                                                                        <select
                                                                        className="form-select"
                                                                        required
                                                                        name="history_sources"
                                                                        value={formDrugData.history_sources}
                                                                        onChange={handleDrugChange}
                                                                        >
                                                                            <option  value="" selected disabled>
                                                                                เลือก
                                                                            </option>
                                                                            {drug_allergies.history_sources.map((item) => (
                                                                                <option key={item.history_source_id} value={item.history_source_id}>
                                                                                ({item.history_source_id}) {item.history_source_name}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                    </div>
                                                                    <div className="col-lg-12">
                                                                        <p className="mb-0 fw-normal col-form-label ">รายละเอียดเพิ่มเติม : </p>
                                                                        <input type="text" className="form-control" name="detail"
                                                                            value={formDrugData.detail} onChange={handleDrugChange} required />
                                                                    </div>
                                                                </div>
                                                                <div className="mb-3">
                                                                    <div className="col-12 text-center mt-4">
                                                                        <div className="d-grid gap-2 col-6 mx-auto">
                                                                            <button type="submit" className="btn btn-outline-danger py-2"><FontAwesomeIcon icon={faPills} className="me-2" />บล็อกยา</button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>
                                                    
                                                    )}

                                                    {selectedOption === 'ไม่แพ้ยา' && (
                                                        <div>
                                                            <p className="text-center fs-5">ผู้ป่วย -ไม่แพ้ยา- <span className="text-titlepage">กรุณาคลิกที่ปุ่ม "NEXT"</span></p>
                                                        </div>
                                                    )}
                                                </div>
                                            ) :  activeStep === 2?(
                                                <div className="mt-4">
                                                    <div className="text-center">
                                                        <p>ขึ้นทะเบียนเรียบร้อย ดำเนินการ<span className="text-primary"> พิมพ์คิวรักษา </span>ให้ผู้ป่วย</p>
                                                    </div>
                                                    <div className="mb-3">
                                                        <div className="col-12 text-center mt-5">
                                                            <div className="d-grid gap-2 col-6 mx-auto">
                                                                <button type="button" onClick={()=>handleQReport()} className="btn btn-primary py-2"><FontAwesomeIcon icon={faPrint} className="me-2" />พิมพ์คิวรักษา</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : ""}
                                        </Box>
                                    </React.Fragment>
                                )}
                            </Box>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PatienHistoryTake
