import React , { useState, useEffect }from 'react'
import { Link,useLocation ,useNavigate} from 'react-router-dom'
import "./registration.css";

import { APi_URL_UAT } from "../../auth/config";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAddressCard,faHospitalUser,faCalendarDay,faFileInvoice,faFilePrescription,faPrescription,faNoteSticky,faFileCircleExclamation,faBookMedical,faFileContract,faEye,faEyeSlash } from '@fortawesome/free-solid-svg-icons'

const TreatmenthistoryInfo = () => {
    const location = useLocation();
    const { state } = location; 
    const hn_patient_id = state.hn_patient_id; 
    const history_id = state.history_id; 
    const clinic_id = localStorage.getItem('clinic_id');

    const apiKey = localStorage.getItem("token"); // ใส่ API Key ที่นี่

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // check search
    const [data, setData] = useState([]);
    const [treatment, setTreatment] = useState({});
    const [patient_vitals, setPatient_vitals] = useState([]);
    const [cc, setCc] = useState([]);
    const [dx, setDx] = useState([]);
    const [fu, setFu] = useState([]);
    const [pe, setPe] = useState([]);
    const [ph, setPh] = useState([]);
    const [pi, setPi] = useState([]);
    const [prx, setPrx] = useState([]);
    const [rx, setRx] = useState([]);
    const [lab_results, setLab_results] = useState([]);
    const [xr_results, setXr_results] = useState([]);
    
    //  of Hooks 
    const apiUrl = `${APi_URL_UAT}treatment_information&history_id=${history_id}`;

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
            console.log(result.data.details)
            setData(result.data.details);
            setTreatment(result.data.treatment);
            setPatient_vitals(result.data.details.patient_vitals);
            setCc(result.data.details.cc);
            setDx(result.data.details.dx);
            setFu(result.data.details.fu);
            setPe(result.data.details.pe);
            setPh(result.data.details.ph);
            setPi(result.data.details.pi);
            setPrx(result.data.details.prx);
            setRx(result.data.details.rx);
            setLab_results(result.data.details.lab_results);
            setXr_results(result.data.details.xr_results);
        }
        })
        .catch((error) => console.error(error));
    };

    useEffect(() => {
        listmedicalrecord();
    }, []);

    // show/hide
    const [istreatment, setIstreatment] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [islab_results, setIslab_results] = useState(false);
    const [isxr_results, setIsxr_results] = useState(false);
    const [isrx, setIsrx] = useState(false);
    const [isfu, setIsfu] = useState(false);
    const [iscc, setIscc] = useState(false);
    const [isdx, setIsdx] = useState(false);
    const [ispe, setIspe] = useState(false);
    const [isph, setIsph] = useState(false);
    const [ispi, setIspi] = useState(false);
    const [isprx, setIsprx] = useState(false);
    const ShowAll =()=>{
        setIstreatment(true)
        setIsVisible(true)
        setIslab_results(true)
        setIsxr_results(true)
        setIsrx(true)
        setIsfu(true)
        setIscc(true)
        setIsdx(true)
        setIspe(true)
        setIsph(true)
        setIspi(true)
        setIsprx(true)
    }
    const HideAll =()=>{
        setIstreatment(false)
        setIsVisible(false)
        setIslab_results(false)
        setIsxr_results(false)
        setIsrx(false)
        setIsfu(false)
        setIscc(false)
        setIsdx(false)
        setIspe(false)
        setIsph(false)
        setIspi(false)
        setIsprx(false)
    }

    const handleReport = (history_id) => {
        const printUrl = ` https://www.addpay.co.th/service-ui/service-my-clinic/service-my-monitor/AppointmentCard/?history_id=${history_id}`;
        const printWindow = window.open(printUrl, '_blank', 'width=600,height=400');
    };
    const handleSTReport = (history_id) => {
        const printUrl = `https://www.addpay.co.th/service-ui/service-my-clinic/service-my-monitor/MedicineDetails/?history_id=${history_id}`;
        const printWindow = window.open(printUrl, '_blank', 'width=600,height=400');
    };
    const handleBCReport = () => {
        const printUrl = `https://www.addpay.co.th/service-ui/service-my-clinic/service-my-monitor/BlankCard/`;
        const printWindow = window.open(printUrl, '_blank', 'width=600,height=400');
    };
    const handlePPReport = (history_id) => {
        const printUrl = `https://www.addpay.co.th/service-ui/service-my-clinic/service-my-monitor/PrescriptionCard/?history_id=${history_id}`;
        const printWindow = window.open(printUrl, '_blank', 'width=600,height=400');
    };
    const handleOPDReport = (history_id) => {
        const printUrl = `https://www.addpay.co.th/service-ui/service-my-clinic/service-my-report/OPD_TO_PDF.php?history_id=${history_id}`;
        const printWindow = window.open(printUrl, '_blank', 'width=600,height=400');
    };
    const handleGReport = (history_id) => {
        const printUrl = `https://www.addpay.co.th/service-ui/service-my-clinic/service-my-report/generate_pdf.php?history_id=${history_id}`;
        const printWindow = window.open(printUrl, '_blank', 'width=600,height=400');
    };
    // 
    const handleMedicalForCar = (history_id) => {
        const printUrl = `https://www.addpay.co.th/service-ui/service-my-clinic/service-my-report/generate_pdf.php?history_id=${history_id}`;
        const printWindow = window.open(printUrl, '_blank', 'width=600,height=400');
    };
    const handleMedical = (history_id) => {
        const printUrl = `https://www.addpay.co.th/service-ui/service-my-clinic/service-my-report/generate_pdf.php?history_id=${history_id}`;
        const printWindow = window.open(printUrl, '_blank', 'width=600,height=400');
    };

    return (
        <div>
            <div className="p-4 mb-5 ">
                <h2 className="text-start display-6 fw-semibold text-titlepage">ประวัติการรักษา</h2>
                <nav aria-label="breadcrumb" className="bg-light rounded-2 px-3 p-2">
                    <ol className="breadcrumb mb-0">
                        <li className="breadcrumb-item"><Link to="/registration" className="breadcrumb-link"><FontAwesomeIcon className="me-1" icon={faAddressCard} />เวชระเบียน</Link></li>
                        <li className="breadcrumb-item"><Link to="/patientinfo" 
                        state={{hn_patient_id: hn_patient_id,
                            thai_prefix: state.thai_prefix,
                            thai_firstname: state.thai_firstname,
                            thai_lastname: state.thai_lastname,
                        }} className="breadcrumb-link"><FontAwesomeIcon className="me-1" icon={faHospitalUser} />ข้อมูลผู้ป่วย</Link></li>
                        <li className="breadcrumb-item"><Link to="/treatmenthistory" 
                        state={{hn_patient_id: hn_patient_id,
                            thai_prefix: state.thai_prefix,
                            thai_firstname: state.thai_firstname,
                            thai_lastname: state.thai_lastname,
                        }} className="breadcrumb-link"><FontAwesomeIcon className="me-1" icon={faHospitalUser} />ประวัติการรักษา</Link></li>
                        <li className="breadcrumb-item mb-0 active" aria-current="page"><FontAwesomeIcon className="me-1" icon={faBookMedical} />ข้อมูลการรักษา</li>
                    </ol>
                </nav>
                <div className="mt-5">
                    <div className="card">
                        <div className="card-header fs-5 fw-semibold">
                            รหัสผู้ป่วย : {hn_patient_id}
                        </div>
                        <div className="card-body">
                            <div className="">
                                <p className="mb-0 fs-5"><span className="fw-semibold">ชื่อ-นามสกุล : </span>{state.thai_prefix} {state.thai_firstname}  {state.thai_firstname}</p>
                            </div>
                            <div className="row d-flex flex-column-reverse flex-md-row mb-4">
                                <div className="col-xl-10 col-md-8 pt-3 mt-2 px-4 px-md-3 px-lg-4">
                                    <div className="d-flex flex-column text-center mb-2 mb-md-2 flex-md-row justify-content-md-between">
                                        <p className=" fs-4 text-titlepage">รายละเอียดการรักษา</p>
                                        <div>
                                            <button className="btn btn-nav me-2" onClick={ShowAll}>
                                                <FontAwesomeIcon className="me-1 d-block d-xl-none" icon={faEye} />
                                                <span className="d-none d-xl-block">ShowAll</span>
                                            </button>
                                            <button className="btn btn-nav" onClick={HideAll}>
                                                <FontAwesomeIcon className="me-1 d-block d-xl-none" icon={faEyeSlash} />
                                                <span className="d-none d-xl-block">HideAll</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-6 d-flex flex-column px-0 px-lg-1">
                                        {/* รายละเอียดการรักษา */}
                                        <div className="card mb-2">
                                            <button className="btn btn-nav card-header" onClick={() => setIstreatment(!istreatment)}>
                                                รายละเอียดการรักษา
                                            </button>
                                            {istreatment ? 
                                            <div className="card-body info-card">
                                                <p>เลขการรักษา : <span>{treatment.history_id} </span></p>
                                                <p>คิวการรักษา : <span>{treatment.queue_number}</span></p>
                                                <p>วันที่รับการรักษา : <span>{treatment.treatment_date}</span></p>
                                                <p>เวลา : <span>{treatment.time}</span></p>
                                                <p>แพ้ยา : <span>{treatment.drug_allergy}</span></p>
                                                <p>โรคประจำตัว : <span>{treatment.congenital_disease}</span></p>
                                                <p>แพทย์ที่รับผิดชอบ : <span>{treatment.doctor_name}</span></p>
                                            </div>
                                            :null}
                                        </div>
                                        {/* ซักประวัติ */}
                                        <div className="card mb-2">
                                            <button className="btn btn-nav card-header" onClick={() => setIsVisible(!isVisible)}>
                                                ซักประวัติ
                                            </button>
                                            {isVisible ? 
                                            patient_vitals.map((patient_vitals) => (
                                            <div key={patient_vitals.id} className="card-body info-card">
                                                <p>น้ำหนัก (BW) : <span>{patient_vitals.bw||"-"} </span>kg.</p>
                                                <p>ส่วนสูง (Height) : <span>{patient_vitals.height||"-"}</span>  cm.</p>
                                                <p>ดัชนีมวลกาย (BMI) : <span>{patient_vitals.bmi||"-"}</span> </p>
                                                <p>อุณหภูมิร่างกาย (Temp) : <span>{patient_vitals.temp||"-"}</span>  °C</p>
                                                <p>ชีพจร (Pulse) : <span>{patient_vitals.pulse||"-"}</span> </p>
                                                <p>การหายใจ (Respiration) : <span>{patient_vitals.respiration||"-"}</span> </p>
                                                <p>ความดันโลหิตซิสโตลิก (BP Systolic) : <span>{patient_vitals.bp_systolic||"-"}</span> </p>
                                                <p>ความดันโลหิตไดแอสโตลิก (BP Diastolic) : <span>{patient_vitals.bp_diastolic||"-"}</span> </p>
                                                <p>สถานะวัณโรค (TB Status) : <span>{patient_vitals.tb_status||"-"}</span> </p>
                                                <p>การตรวจตา (Eye Exam) : <span>{patient_vitals.eye_exam||"-"}</span> </p>
                                                <p>การคัดกรอง (Screening) : <span>{patient_vitals.screening||"-"}</span> </p>
                                                <p>สถานะการดื่มแอลกอฮอล์ (Alcohol Status) : <span>{patient_vitals.alcohol_status||"-"}</span> </p>
                                                <p>สถานะการสูบบุหรี่ (Smoking Status) : <span>{patient_vitals.smoking_status||"-"}</span> </p>
                                                <p>สถานะการตั้งครรภ์ (Pregnancy Status) : <span>{patient_vitals.pregnancy_status||"-"}</span> </p>
                                                <p>สถานะการกรองของไต (GFR Status) : <span>{patient_vitals.gfr_status||"-"}</span> </p>
                                                <p>สาเหตุที่ผู้ป่วยมาใช้บริการ (Visit Reason) : <span>{patient_vitals.visit_reason||"-"}</span> </p>
                                                <p>การแพ้ยา (Drug Allergy) : <span>{patient_vitals.drug_allergy||"-"}</span> </p>
                                            </div >
                                            
                                            ))
                                            
                                            
                                            : null}
                                            
                                        </div>
                                        {/* rx */}
                                        <div className="card mb-2">
                                            <button className="btn btn-nav card-header" onClick={() => setIsrx(!isrx)}>
                                                รายการยา / คำสั่งใช้ยา/วิธีใช้ยา / จำนวน (Rx.)
                                            </button>
                                            {isrx ? 
                                            rx.map((rx) => (
                                            <div  key={rx.rx_id} className="px-3 py-2 info-card">
                                                <p className="mb-0">รหัสยา :<span>{rx.meditem_id}</span></p>
                                                <p className="mb-0">ชื่อยา :<span>{rx.medicine_name}</span></p>
                                                <p className="mb-0">dosage :<span>{rx.dosage}</span></p>
                                                <p className="mb-0">usage_instruction :<span>{rx.usage_instruction}</span></p>
                                                <p className="mb-0">จำนวน :<span>{rx.quantity}</span></p>
                                                <p className="mb-0">ราคา :<span>{rx.price}</span></p>
                                                <hr className="mt-2"/>
                                            </div >
                                            ))
                                            : null}
                                        </div>
                                        {/* fu */}
                                        <div className="card mb-2">
                                            <button className="btn btn-nav card-header" onClick={() => setIsfu(!isfu)}>
                                                วัน เวลา นัดหมาย รายการนัดหมาย (FU.)
                                            </button>
                                            {isfu ? 
                                            fu.map((fu) => (
                                            <div  key={fu.fu_id} className="px-3 py-2 info-card">
                                                <p className="mb-0">วันนัดครั้งถัดไป :<span>{fu.date}</span></p>
                                                <p className="mb-0">เวลา :<span>{fu.time}</span></p>
                                                <p className="mb-0">รายละเอียด : <span>{dx.details}</span></p>
                                                <hr className="mt-2"/>
                                            </div >
                                            ))
                                            : null}
                                        </div>
                                        {/* lab */}
                                        <div className="card mb-2">
                                            <button className="btn btn-nav card-header" onClick={() => setIslab_results(!islab_results)}>
                                                 ผลตรวจเลือดต่างๆ(มีค่าบริการเพิ่ม) (Lab)
                                            </button>
                                            {islab_results ? 
                                            lab_results.map((lab_results) => (
                                            <div key={lab_results.lab_id} className="px-3 py-2 info-card">
                                                    <p className="mb-0">ชื่อ Lab :<span>{lab_results.test_name}</span></p>
                                                    <p className="mb-0">ส่ง Lab :<span>{lab_results.result_value}</span></p>
                                                    <p className="mb-0">unit :<span>{lab_results.unit}</span></p>
                                                    <p className="mb-0">สถานะ LAB :<span>{lab_results.status_sen}</span></p>
                                                    <p className="mb-0">lap_file :<span>{lab_results.lap_file}</span></p>
                                                    <p className="mb-0">ค่าใช้จ่าย :<span>{lab_results.price}</span></p>
                                                    <hr className="mt-2"/>
                                            </div >
                                            ))
                                            : null}
                                        </div>
                                        {/* xr */}
                                        <div className="card mb-2">
                                            <button className="btn btn-nav card-header" onClick={() => setIsxr_results(!isxr_results)}>
                                                ผล x-ray (มีค่าบริการเพิ่ม) (XR)
                                            </button>
                                            {isxr_results ? 
                                            xr_results.map((xr_results) => (
                                            <div key={xr_results.xr_id} className="px-3 py-2 info-card">
                                                    <p className="mb-0">รายละเอียด :<span>{xr_results.description}</span></p>
                                                    <p className="mb-0">ค่าใช้จ่าย :<span>{xr_results.price}</span></p>
                                                    <hr className="mt-2"/>
                                            </div >
                                            ))
                                            : null}
                                        </div>
                                        
                                    </div>
                                    <div className="col-lg-6 d-flex flex-column px-0 px-lg-1">
                                        {/* cc */}
                                        <div className="card mb-2">
                                            <button className="btn btn-nav card-header" onClick={() => setIscc(!iscc)}>
                                                อาการสำคัญที่มาพบแพทย์ (CC)
                                            </button>
                                            {iscc ? 
                                            cc.map((cc) => (
                                            <div key={cc.xr_id} className="px-3 py-2 info-card">
                                                <p key={cc.cc_id} className="mb-0">{cc.description}</p>
                                                <hr className="mt-2"/>
                                            </div>
                                            ))
                                            : null}
                                        </div>
                                        {/* dx */}
                                        <div className="card mb-2">
                                            <button className="btn btn-nav card-header" onClick={() => setIsdx(!isdx)}>
                                                รหัสวินิจฉัยโรค (Dx.)
                                            </button>
                                            {isdx ? 
                                            dx.map((dx) => (
                                            <div key={dx.xr_id} className="px-3 py-2 info-card">
                                                <p className="mb-0">{dx.code}</p>
                                                <p className="mb-0">{dx.description}</p>
                                                <p className="mb-0">รหัส ICD : <span>{dx.icd_id}</span></p>
                                                <hr className="mt-2"/>
                                            </div>
                                            ))
                                            : null}
                                        </div>
                                        {/* pe */}
                                        <div className="card mb-2">
                                            <button className="btn btn-nav card-header" onClick={() => setIspe(!ispe)}>
                                                การตรวจร่างกาย (PE)
                                            </button>
                                            {ispe ? 
                                            pe.map((pe) => (
                                            <div key={pe.pe_id} className="px-3 py-2 info-card">
                                                <p className="mb-0">รายละเอียด :<span>{pe.description}</span></p>
                                                <p className="mb-0">ค่าบริการ :<span>{pe.price}</span></p>
                                                <hr className="mt-2"/>
                                            </div>
                                            ))
                                            : null}
                                        </div>
                                        {/* ph */}
                                        <div className="card mb-2">
                                            <button className="btn btn-nav card-header" onClick={() => setIsph(!isph)}>
                                                ประวัติการรักษา โรคประจำตัว (PH)
                                            </button>
                                            {isph ? 
                                            ph.map((ph) => (
                                            <div key={ph.ph_id} className="px-3 py-2 info-card">
                                                <p className="mb-0">รายละเอียด :<span>{ph.description}</span></p>
                                                <hr className="mt-2"/>
                                            </div>
                                            ))
                                            : null}
                                        </div>
                                        {/* pi */}
                                        <div className="card mb-2">
                                            <button className="btn btn-nav card-header" onClick={() => setIspi(!ispi)}>
                                                ประวัติการเจ็บป่วย (PI)
                                            </button>
                                            {ispi ? 
                                            pi.map((pi) => (
                                            <div key={pi.pi_id} className="px-3 py-2 info-card">
                                                <p className="mb-0">รายละเอียด :<span>{pi.description}</span></p>
                                            </div>
                                            ))
                                            : null}
                                        </div>
                                        {/* prx */}
                                        <div className="card mb-2">
                                            <button className="btn btn-nav card-header" onClick={() => setIsprx(!isprx)}>
                                                 หัตถการที่รักษา เช่น U/S ,ล้างแผล,ฉีดยา (Prx)
                                            </button>
                                            {isprx ? 
                                            prx.map((prx) => (
                                            <div key={prx.prx_id} className="px-3 py-2 info-card">
                                                <p className="mb-0">รหัส :<span>{prx.prcd_id}</span></p>
                                                <p className="mb-0">รายละเอียด :<span>{prx.procedure_name}</span></p>
                                                <p className="mb-0">จำนวน :<span>{prx.quantity}</span></p>
                                                <p className="mb-0">ราคา :<span>{prx.price}</span></p>
                                                <hr className="mt-2"/>
                                            </div>
                                            ))
                                            : null}
                                        </div>
                                    </div>
                                    </div>
                                </div>

                                <div className="col-xl-2 col-md-4 mt-0 mt-xl-4">
                                    <div className="d-grid gap-2">
                                        {/* ผู้ป่วยเข้ารับการรักษา ส่งข้อมูล/ปริ้นคิว */}
                                        <p className="fw-light">บัตร/สติ๊กเกอร์sss</p>
                                        <button  onClick={()=>handleReport(history_id)} className="btn btn-outline-success py-2 me-2 me-xl-0 mb-2 mb-xl-2" type="button">
                                            <FontAwesomeIcon className="me-2 fa-lg fa-icon" icon={faCalendarDay} /> บัตรนัด
                                        </button>
                                        <button onClick={()=>handlePPReport(history_id)} className="btn btn-outline-success py-2 me-2 me-xl-0 mb-2 mb-xl-2" type="button">
                                            <FontAwesomeIcon className="me-2 fa-lg fa-icon" icon={faFilePrescription} /> ใบสั่งยา
                                        </button>
                                        <button onClick={()=>handleSTReport(history_id)} className="btn btn-outline-success py-2 me-2 me-xl-0 mb-2 mb-xl-2" type="button">
                                            <FontAwesomeIcon className="me-2 fa-lg fa-icon" icon={faPrescription} /> สติ๊กเกอร์ซองยา
                                        </button>
                                        <button onClick={()=>handleBCReport()} className="btn btn-outline-success py-2 me-2 me-xl-0 mb-2 mb-xl-2" type="button">
                                            <FontAwesomeIcon className="me-2 fa-lg fa-icon" icon={faNoteSticky} /> สติ๊กเกอร์เปล่า
                                        </button>
                                       
                                        <p className="fw-light mt-2">เอกสารเพิ่มเติม</p>
                                        <button onClick={()=>handleGReport(history_id)} className="btn btn-outline-secondary py-2 me-2 me-xl-0 mb-2 mb-xl-2" type="button">
                                            <FontAwesomeIcon className="me-2 fa-lg fa-icon" icon={faFileContract} />ใบรับรองแพทย์
                                        </button>
                                        <button onClick={()=>handleMedicalForCar(history_id)} className="btn btn-outline-secondary py-2 me-2 me-xl-0 mb-2 mb-xl-2" type="button">
                                            <FontAwesomeIcon className="me-2 fa-lg fa-icon" icon={faFileContract} />ใบรับรองแพทย์<br/>(สำหรับใบอนุญาตขับรถ)
                                        </button>
                                        <button onClick={()=>handleMedical(history_id)} className="btn btn-outline-secondary py-2 me-2 me-xl-0 mb-2 mb-xl-2" type="button">
                                            <FontAwesomeIcon className="me-2 fa-lg fa-icon" icon={faFileContract} />ใบรับรองการเจ็บป่วย
                                        </button>
                                        <button className="btn btn-outline-primary py-2 me-2 me-xl-0 mb-2 mb-xl-2" type="button">
                                            <FontAwesomeIcon className="me-2 fa-lg fa-icon" icon={faFileInvoice} />ใบเสร็จรับเงิน
                                        </button>
                                        <button onClick={()=>handleOPDReport(history_id)} className="btn btn-outline-primary py-2 me-2 me-xl-0 mb-2 mb-xl-2" type="button">
                                            <FontAwesomeIcon className="me-2 fa-lg fa-icon" icon={faFileCircleExclamation} />ใบ OPD Card
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TreatmenthistoryInfo
