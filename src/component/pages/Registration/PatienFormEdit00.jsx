
import React , { useState, useEffect }from 'react'
import { Link,useLocation ,useNavigate} from 'react-router-dom'
import "./registration.css";

import { APi_URL_UAT } from "../../auth/config";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHospitalUser,faPhone,faIdCard} from '@fortawesome/free-solid-svg-icons'
import profileDef from"../../img/ProfileDef.png";

import { differenceInYears,differenceInMonths } from "date-fns";

import Swal from "sweetalert2";

const PatienFormEdit00 = () => {
    const location = useLocation();
    const { state } = location; 

    const clinic_id = localStorage.getItem('clinic_id');
    const hn_patient_id = state.hn_patient_id;
    // case Submit
    const navigate = useNavigate('');
    const apiKey = localStorage.getItem("token"); // ใส่ API Key ที่นี่

    const apiUrl = `${APi_URL_UAT}personal_information&hn_patient_id=${hn_patient_id}&clinic_id=${clinic_id}`;
    const apiUrlupdate = `${APi_URL_UAT}Patient_registration`;
    
    const [data, setData] = useState({});

    const personalInformation = () => {
        const myHeaders = new Headers();
        myHeaders.append("X-API-KEY", apiKey);

        const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
        };

        fetch(
        apiUrl,requestOptions
        )
        .then((response) => response.json())
        .then((result) => {
            if (result.success) {
                console.log(result.data.patients[0])
                setData(result.data.patients[0]);
            }
        })
        .catch((error) => console.error(error));
    };
    useEffect(() => {
       personalInformation();
        
    }, []);

    function refreshPage() {
    window.location.reload(false);
    }

    // birthDate age
    const maxtoday = new Date().toISOString().split('T')[0];
    const [birthDate, setBirthDate] = useState('');
    const [age, setAge] = useState(null);

    const calculateAge = (date) => {
        const today = new Date();
        const dateObject = new Date(date);
        const ageYears = differenceInYears(today, dateObject);
        const ageMonths = differenceInMonths(today, dateObject);
        const ageMonthsY = ageMonths-(ageYears*12);

    if(ageYears>0){
        return ageYears+" ปี"+ageMonthsY+" เดือน";
    }if(ageYears<=0){
        return ageMonthsY+" เดือน";
    }else{
        return ageYears+" ปี"+ageMonthsY+" เดือน";
    }
    };

    const handleDateChange = (e) => {
        const date = e.target.value;
        setBirthDate(date);
        setAge(calculateAge(date));
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // check emergency_contact_nameaddress
    const [isChecked, setIsChecked] = useState(false);
    const [emgAddress, setemgAddress] = useState(false);

    const emgAddressall = () => {
        const address =formData.address||data.address;
        const sub_district =formData.sub_district||data.sub_district;
        const district =formData.district||data.district;
        const province =formData.province||data.province;
        const zip_code =formData.zip_code||data.zip_code;
        if(address && sub_district&& district && province &&zip_code){
            return address+" "+sub_district+" "+district+" "+province+" "+zip_code;
        }else{
            return "";
        }
    };

    const handleCheckboxChange = () => {
    setemgAddress(emgAddressall);
    setIsChecked(!isChecked);
    };

    const [formData, setFormData] = useState({
        clinic_id: clinic_id,
        profile_image:data.profile_image|| '',
        thai_prefix:data.thai_prefix|| '',
        thai_firstname: data.thai_firstname|| '',
        thai_lastname: data.thai_lastname|| '',
        eng_prefix: data.eng_prefix|| '',
        eng_firstname: data.eng_firstname|| '',
        eng_lastname: data.eng_lastname|| '',
        id_card_number: data.id_card_number|| '',
        phone_number: data.phone_number|| '',
        birth_date: data.birth_date|| '',
        age: data.age|| '',
        blood_type: data.blood_type|| '',
        marital_status: data.marital_status|| '',
        gender: data.gender|| '',
        nationality: data.nationality|| '',
        ethnicity:data.ethnicity|| '',
        religion: data.religion|| '',
        address:data.address|| '',
        district: data.district|| '',
        province: data.province|| '',
        zip_code: data.zip_code|| '',
        occupation: data.occupation|| '',
        insurance: data.insurance|| '',
        emergency_contact_name: data.emergency_contact_name|| '',
        emergency_contact_phone: data.emergency_contact_phone|| '',
        date_of_death: data.date_of_death|| '',
        father_name: data.father_name|| '',
        mother_name: data.mother_name|| '',
        residence_type: data.residence_type|| '',
        drug_allergy: data.drug_allergy|| '',
        treatment_right: data.treatment_right|| '',
        sub_district: data.sub_district|| '',
        gender_th: data.gender_th|| '',
        related_to: data.related_to|| '',
        house_code: data.house_code|| '',
        contact_address: data.contact_address|| '',
        data_source: data.data_source|| '',
        congenital_disease: data.congenital_disease|| '',
    });
    console.log(formData);

    const [isActive, setIsActive] = useState('disabled');

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value});
      setIsActive('');
    };

    
    const handleSubmit = (e) => {
        e.preventDefault();
        const myHeaders = new Headers();
        myHeaders.append("X-API-KEY", apiKey);

        const formdata = new FormData();
        formdata.append("clinic_id", clinic_id);
        formdata.append("profile_image",formData.profile_image||data.profile_image|| '');
        formdata.append("thai_prefix",data.thai_prefix|| '');
        formdata.append("thai_firstname", formData.thai_firstname||data.thai_firstname|| '');
        formdata.append("thai_lastname", formData.thai_lastname||data.thai_lastname|| '');
        formdata.append("eng_prefix", formData.eng_prefix||data.eng_prefix|| '');
        formdata.append("eng_firstname", formData.eng_firstname||data.eng_firstname|| '');
        formdata.append("eng_lastname", formData.eng_lastname||data.eng_lastname|| '');
        formdata.append("id_card_number", formData.id_card_number||data.id_card_number|| '');
        formdata.append("phone_number", formData.phone_number||data.phone_number|| '');
        formdata.append("birth_date", formData.birth_date||data.birth_date|| '');
        formdata.append("age", age||data.age|| '');
        formdata.append("blood_type", formData.blood_type||data.blood_type|| '');
        formdata.append("marital_status", formData.marital_status||data.marital_status|| '');
        formdata.append("gender", formData.gender||data.gender|| '');
        formdata.append("nationality", formData.nationality||data.nationality|| '');
        formdata.append("ethnicity", formData.ethnicity||data.ethnicity|| '');
        formdata.append("religion", formData.religion||data.religion|| '');
        formdata.append("address",formData.address||data.address|| '');
        formdata.append("district", formData.district||data.district|| '');
        formdata.append("province", formData.province||data.province|| '');
        formdata.append("zip_code", formData.zip_code||data.zip_code|| '');
        formdata.append("occupation", formData.occupation||data.occupation|| '');
        formdata.append("insurance", formData.insurance||data.insurance|| '');
        formdata.append("emergency_contact_name", formData.emergency_contact_name||data.emergency_contact_name|| '');
        formdata.append("emergency_contact_phone", formData.emergency_contact_phone||data.emergency_contact_phone|| '');
        formdata.append("date_of_death", "0000-00-00"||data.date_of_death|| '');
        formdata.append("father_name", formData.father_name||data.father_name|| '');
        formdata.append("mother_name", formData.mother_name||data.mother_name|| '');
        formdata.append("residence_type", formData.residence_type||data.residence_type|| '');
        formdata.append("drug_allergy", formData.drug_allergy||data.drug_allergy|| '');
        formdata.append("treatment_right", formData.treatment_right||data.treatment_right|| '');
        formdata.append("hn_patient_id", hn_patient_id|| '');
        formdata.append("sub_district", formData.sub_district||data.sub_district|| '');
        formdata.append("gender_th", formData.gender_th||data.gender_th|| '');
        formdata.append("related_to", formData.related_to||data.related_to|| '');
        formdata.append("house_code", formData.house_code||data.house_code|| '');
        formdata.append("contact_address", emgAddress||data.contact_address|| '');
        formdata.append("data_source", formData.data_source||data.data_source|| '');
        formdata.append("congenital_disease", formData.congenital_disease||data.congenital_disease|| '');
       
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formdata,
            redirect: "follow"
        };

        fetch(apiUrlupdate, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            console.log(result);
            if (result.success===true) {
                const hn_patient_id_send=result.data.hn_patient_id;
                Swal.fire({
                title: "Success!",
                text: "อัพเดตผู้ป่วย "+hn_patient_id_send+" สำเร็จ",
                icon: "success",
                confirmButtonText: "OK",
                }).then((result) => {
                    if (result.isConfirmed) {
                    refreshPage();
                    }
                });
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
        <form onSubmit={handleSubmit}>
            <div className="row g-3">
                <div className="row d-flex flex-column flex-md-row-reverse">
                    <div className="col-12">
                        <p className="text-center h3 mb-5 bgSide rounded-2 p-2 mt-3">ข้อมูลผู้ป่วย</p>
                    </div>
                    <div className="col-lg-6">
                        <div className="profileDef">
                        <img src={hn_patient_id?data.profile_image:profileDef} alt="profileDef" />
                        </div>
                    </div>
                    <div className="mb-5 col-lg-6 d-grid gap-2">
                        <p className="mb-0 fw-normal col-form-label fw-semibold">อ่านข้อมูลจากบัตรประชาชน </p>
                        <button type="button" className="btn btn-outline-primary p-1">
                        <FontAwesomeIcon className="fa-2x me-3" icon={faIdCard} />
                        <span className="h2 fw-light">อ่านข้อมูลบัตร</span>
                        </button>
                        <input type="hidden" className="form-control" placeholder="รูปภาพ" name="profile_image" accept="image/*"
                        value={formData.profile_image|| data.profile_image||""}  onChange={handleChange}/>
                    </div>
                </div>
                <div className="row">
                    <p className="mb-2 fw-bold">ชื่อ-สกุล (ภาษาไทย)</p>
                    <div className="mb-2 col-lg-2">
                        <select
                        className="form-select"
                        required
                        name="thai_prefix"
                        value={formData.thai_prefix} 
                        onChange={handleChange}
                        >
                        <option  value={data.thai_prefix} >
                            {data.thai_prefix}
                        </option>
                        <option value="นาย">นาย</option>
                        <option value="นาง">นาง</option>
                        <option value="นางสาว">นางสาว</option>
                        </select>
                    </div>
                    <div className="mb-2 col-lg-4">
                        <input type="text" className="form-control" placeholder="ชื่อ" name="thai_firstname" 
                        value={formData.thai_firstname} onChange={handleChange} required />
                    </div>
                    <div className="mb-2 col-lg-4">
                        <input type="text" className="form-control" placeholder="นามสกุล" name="thai_lastname" 
                        value={formData.thai_lastname} onChange={handleChange} required />
                    </div>
                    <div className="col-lg-2">
                        <select
                        className="form-select"
                        required
                        name="gender_th"
                        value={formData.gender_th}
                        onChange={handleChange}
                        >
                            
                        <option value={data.gender_th}>
                            {data.gender_th}
                        </option>
                        <option value="ชาย">ชาย</option>
                        <option value="หญิง">หญิง</option>
                        </select>
                    </div>
                    <p className="mb-2 fw-bold">ชื่อ-สกุล (ภาษาอังกฤษ)</p>
                    <div className="mb-2 col-lg-2">
                        <select
                        className="form-select"
                        required
                        name="eng_prefix"
                        value={formData.eng_prefix}
                        onChange={handleChange}
                        >
                        <option value={data.eng_prefix}>
                            {data.eng_prefix}
                        </option>
                        <option value="Mr.">Mr.</option>
                        <option value="Mrs.">Mrs.</option>
                        <option value="Miss">Miss</option>
                        </select>
                    </div>
                    <div className="mb-2 col-lg-4">
                        <input type="text" className="form-control" placeholder="ชื่อ" name="eng_firstname" 
                        value={formData.eng_firstname}
                        onChange={handleChange} required />
                    </div>
                    <div className="mb-2 col-lg-4">
                        <input type="text" className="form-control" placeholder="นามสกุล" name="eng_lastname" 
                        value={formData.eng_lastname} 
                        onChange={handleChange} required />
                    </div>
                    <div className="col-lg-2">
                        <select
                        className="form-select"
                        required
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        >
                        <option value={data.gender}>
                            {data.gender}
                        </option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        </select>
                    </div>

                    <div className="col-lg-3">
                        <p className="mb-0 fw-normal col-form-label">วัน/เดือน/ปี เกิด (ค.ศ.) : </p>
                        <input type="date" className="form-control" name="birth_date" 
                        value={birthDate} onChange={handleDateChange} max={maxtoday} required />
                    </div>
                    <div className="col-lg-2">
                        <p className="mb-0 fw-normal col-form-label">อายุปัจจุบัน : </p>
                        <input type="text" className="form-control" placeholder="อายุ" name="age" value={age || data.age||""} onChange={handleChange} disabled required />
                    </div>

                    <div className="col-lg-3">
                        <p className="mb-0 fw-normal col-form-label">ที่มาของข้อมูล : </p>
                        <select
                        className="form-select"
                        required
                        name="data_source" 
                        value={formData.data_source} 
                        onChange={handleChange}
                        >
                        <option value={data.data_source}>
                            {data.data_source}
                        </option>
                        <option value="บัตรประชาชน">บัตรประชาชน</option>
                        <option value="หนังสือเดินทาง(พาสปอร์ต)">หนังสือเดินทาง(พาสปอร์ต)</option>
                        <option value="บัตรผู้ซึ่งไม่มีสัญชาติ(ต่างด้าว)">บัตรผู้ซึ่งไม่มีสัญชาติ(ต่างด้าว)</option>
                        <option value="อื่นๆ">อื่นๆ</option>
                        </select>
                    </div>
                    {(() => {
                        switch (formData.data_source) {
                        case 'บัตรประชาชน':
                            return (
                            <div className="col-lg-4">
                                <p className="mb-0 fw-normal col-form-label">เลขบัตรประชาชน : </p>
                                <input type="text" className="form-control" placeholder="เลขบัตรประชาชน" name="id_card_number" plattern="[0-9]{13}" 
                                value={formData.id_card_number} 
                                onChange={handleChange} required />
                            </div>
                            );
                        case 'หนังสือเดินทาง(พาสปอร์ต)':
                            return (
                            <div className="col-lg-4">
                                <p className="mb-0 fw-normal col-form-label">เลขหนังสือเดินทาง(พาสปอร์ต) : </p>
                                <input type="text" className="form-control" placeholder="เลขพาสปอร์ต" name="id_card_number"
                                value={formData.id_card_number} onChange={handleChange} required />
                            </div>
                            );
                        case 'บัตรผู้ซึ่งไม่มีสัญชาติ(ต่างด้าว)':
                            return (
                            <div className="col-lg-4">
                                <p className="mb-0 fw-normal col-form-label">บัตรผู้ซึ่งไม่มีสัญชาติ(ต่างด้าว) : </p>
                                <input type="text" className="form-control" placeholder="เลขทะเบียนต่างด้าว" name="id_card_number" 
                                value={formData.id_card_number}  onChange={handleChange} required />
                            </div>
                            );
                        case 'อื่นๆ':
                            return (
                            <div className="col-lg-4">
                                <p className="mb-0 fw-normal col-form-label">เลขอ้างอิง : </p>
                                <input type="text" className="form-control" placeholder="เลขอ้างอิง" name="id_card_number" 
                                value={formData.id_card_number} onChange={handleChange} required />
                            </div>
                            );
                        default:
                            return (
                            <div className="col-lg-4">
                                <p className="mb-0 fw-normal col-form-label">เลขบัตรประชาชน : </p>
                                <input type="text" className="form-control" placeholder="เลขบัตรประชาชน" name="id_card_number" plattern="[0-9]{13}" 
                                value={formData.id_card_number} onChange={handleChange} required />
                            </div>
                            );
                        }
                    })()}

                    <div className="col-lg-4">
                        <p className="mb-0 fw-normal col-form-label">สัญชาติ : </p>
                        <input type="text" className="form-control" placeholder="สัญชาติ" name="nationality"
                        value={formData.nationality} onChange={handleChange} required />
                    </div>
                    <div className="col-lg-4">
                        <p className="mb-0 fw-normal col-form-label">เชื้อชาติ : </p>
                        <input type="text" className="form-control" placeholder="เชื้อชาติ" name="ethnicity" 
                        value={formData.ethnicity} onChange={handleChange} required />
                    </div>
                    <div className="col-lg-4">
                        <p className="mb-0 fw-normal col-form-label">ศาสนา : </p>
                        <input type="text" className="form-control" placeholder="ศาสนา" name="religion" 
                        value={formData.religion} onChange={handleChange} required />
                    </div> 

                    <div className="col-lg-4">
                        <p className="mb-0 fw-normal col-form-label">บ้านเลขที่ ซอย/ถนน หมู่ที่ : </p>
                        <input type="text" className="form-control" placeholder="บ้านเลขที่ ซอย/ถนน หมู่ที่" name="address" 
                        value={formData.address} onChange={handleChange} required />
                    </div>
                    <div className="col-lg-2">
                        <p className="mb-0 fw-normal col-form-label">ตำบล : </p>
                        <input type="text" className="form-control" placeholder="ตำบล" name="sub_district" 
                        value={formData.sub_district} onChange={handleChange} required />
                    </div>
                    <div className="col-lg-2">
                        <p className="mb-0 fw-normal col-form-label">อำเภอ : </p>
                        <input type="text" className="form-control" placeholder="อำเภอ" name="district" 
                        value={formData.district} onChange={handleChange} required />
                    </div>
                    <div className="col-lg-2">
                        <p className="mb-0 fw-normal col-form-label">จังหวัด : </p>
                        <input type="text" className="form-control" placeholder="จังหวัด" name="province" 
                        value={formData.province} onChange={handleChange} required />
                    </div>
                    <div className="col-lg-2">
                        <p className="mb-0 fw-normal col-form-label">รหัสไปรษณีย์ : </p>
                        <input type="text" className="form-control" placeholder="รหัสไปรษณีย์" name="zip_code" 
                        value={formData.zip_code} onChange={handleChange} required />
                    </div>
                    
                    <div className="col-lg-3">
                        <p className="mb-0 fw-normal col-form-label">เบอร์โทร : </p>
                        <div className="input-group">
                            <span className="input-group-text"><FontAwesomeIcon icon={faPhone} /></span>
                            <input type="text" className="form-control" placeholder="เบอร์โทร" name="phone_number" 
                            value={formData.phone_number} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="col-lg-3">
                        <p className="mb-0 fw-normal col-form-label">กรุ๊ปเลือด : </p>
                        <select
                        className="form-select"
                        required
                        name="blood_type"
                        value={formData.blood_type} 
                        onChange={handleChange}
                        >
                        <option value={data.blood_type}>
                            {data.blood_type}
                        </option>
                        <option value="AB">AB</option>
                        <option value="A">A </option>
                        <option value="B">B</option>
                        <option value="O">O</option>
                        </select>
                    </div>
                    <div className="col-lg-3">
                        <p className="mb-0 fw-normal col-form-label">อาชีพ : </p>
                        <input type="text" className="form-control" placeholder="อาชีพ" name="occupation" 
                        value={formData.occupation} onChange={handleChange} required />
                    </div>
                    <div className="col-lg-3">
                        <p className="mb-0 fw-normal col-form-label">สถานะสมรถ : </p>
                        <select
                        className="form-select"
                        required
                        name="marital_status"
                        value={formData.marital_status} 
                        onChange={handleChange}
                        >
                        <option value={data.marital_status}>
                            {data.marital_status}
                        </option>
                        <option value="โสด/single">โสด/single</option>
                        <option value="สมรส/married">สมรส/married</option>
                        <option value="หม้าย/widowed">หม้าย/widowed</option>
                        <option value="หย่า/divorced">หย่า/divorced</option>
                        <option value="แยกกันอยู่/separated">แยกกันอยู่/separated</option>
                        </select>
                    </div>
                    
                    <div className="col-lg-6">
                        <p className="mb-0 fw-normal col-form-label">ชื่อ-สกุล (บิดา) : </p>
                        <input type="text" className="form-control" placeholder="ชื่อ-สกุล (บิดา)" name="father_name" 
                        value={formData.father_name} onChange={handleChange} required />
                    </div>
                    <div className="col-lg-6">
                        <p className="mb-0 fw-normal col-form-label">ชื่อ-สกุล (มารดา) : </p>
                        <input type="text" className="form-control" placeholder="ชื่อ-สกุล (มารดา)" name="mother_name" 
                        value={formData.mother_name} onChange={handleChange} required />
                    </div>
                    <div className="col-lg-4">
                        <p className="mb-0 fw-normal col-form-label">ชื่อ-สกุล (ผู้ติดต่อได้) : </p>
                        <input type="text" className="form-control" placeholder="ชื่อ-สกุล (ผู้ติดต่อได้)" name="emergency_contact_name" 
                        value={formData.emergency_contact_name} onChange={handleChange} required />
                    </div>
                    <div className="col-lg-4">
                        <p className="mb-0 fw-normal col-form-label">เกี่ยวข้องเป็น : </p>
                        <input type="text" className="form-control" placeholder="เกี่ยวข้องเป็น" name="related_to" 
                        value={formData.related_to} onChange={handleChange} required />
                    </div>
                    <div className="col-lg-4">
                        <p className="mb-0 fw-normal col-form-label">รหัสบ้านตามกรมปกครอง : </p>
                        <input type="text" className="form-control" placeholder="รหัสบ้านตามกรมปกครอง" name="house_code" 
                        value={formData.house_code} onChange={handleChange} required />
                    </div>
                    <div className="col-lg-3">
                        <p className="mb-0 fw-normal col-form-label">ลักษณะที่อยู่อาศัย : </p>
                        <input type="text" className="form-control" placeholder="ลักษณะที่อยู่อาศัย" name="residence_type" 
                        value={formData.residence_type} onChange={handleChange} required />
                    </div>
                    <div className="col-lg-6">
                        <p className="mb-0 fw-normal col-form-label">ที่อยู่ผู้ติดต่อได้ : </p>
                        <div className="row d-flex">
                            <div className="col-12 col-md-3 mb-2 mb-md-0">
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" checked={isChecked} onChange={handleCheckboxChange}  />
                                <label className="form-check-label">
                                    {hn_patient_id?"ดึงที่อยู่ใหม่":"บดก."}
                                </label>
                            </div>
                            </div>
                            <div className="col-12 col-md-9 mb-2 mb-md-0">
                            <input type="text" className="form-control" placeholder="ที่อยู่ผู้ติดต่อได้" name="contact_address" value={isChecked ? emgAddress:data.contact_address||data.contact_address} 
                            onChange={handleChange} required />
                            </div>
                            {/* <p>{isChecked ? 'Checkbox is checked!' : 'Checkbox is unchecked!'}</p> */}
                        </div>
                    </div>
                    <div className="col-lg-3">
                        <p className="mb-0 fw-normal col-form-label">เบอร์โทรผู้ติดต่อได้ : </p>
                        <div className="input-group mb-3">
                            <span className="input-group-text"><FontAwesomeIcon icon={faPhone} /></span>
                                <input type="text" className="form-control" placeholder="เบอร์โทรผู้ติดต่อได้" name="emergency_contact_phone" 
                                value={formData.emergency_contact_phone} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="col-lg-6 mt-2">
                        <p className="mb-0 fw-normal col-form-label fw-semibold">โรคประจำตัว : </p>
                        <input type="text" className="form-control" placeholder="โรคประจำตัว" name="congenital_disease" 
                        value={formData.congenital_disease} onChange={handleChange} required />
                    </div>
                    <div className="col-lg-6 mt-2">
                        <p className="mb-0 fw-normal col-form-label fw-semibold">ประวัติการแพ้ยา : </p>
                        <input type="text" className="form-control" placeholder="แพ้ยา" name="drug_allergy" 
                        value={formData.drug_allergy} onChange={handleChange} required />
                    </div>
                    <div className="col-lg-9 mt-2">
                        <p className="mb-0 fw-normal col-form-label fw-semibold">สิทธิการรักษา : </p>
                        <div className="row d-flex">
                            <div className="col-12 col-md-3 mb-2 mb-md-0">
                            <input type="text" className="form-control" placeholder="Code" name="treatment_right" 
                            value={formData.treatment_right} onChange={handleChange} required />
                            </div>
                            <div className="col-12 col-md-9 mb-2 mb-md-0">
                            <input type="text" className="form-control" placeholder="ชื่อสิทธิการรักษา" name="insurance" 
                            value={formData.insurance} onChange={handleChange} required />
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3">
                        <p className="mb-0 fw-normal col-form-label">วัน/เดือน/ปี เสียชีวิต (ค.ศ.) : </p>
                        <input type="date" className="form-control" name="date_of_death" 
                        value={formData.date_of_death}  onChange={handleChange} max={maxtoday}  />
                    </div>

                </div>

                <div className="col-12 text-center mt-5">
                    <div className="d-grid gap-2 col-6 mx-auto">
                        <button type="submit" className="btn btn-primary py-2">
                        {/* className={`btn btn-primary py-2 ${isActive}`} */}
                            <FontAwesomeIcon icon={faHospitalUser} className="me-2" />อัพเดตข้อมูล</button>
                    </div>
                </div>

            </div>
        </form>
    </div>
  )
}

export default PatienFormEdit00
