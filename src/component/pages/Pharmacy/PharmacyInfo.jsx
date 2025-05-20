import React, { useState, useEffect } from "react";
import { Link,useLocation, useNavigate } from 'react-router-dom';
import { APi_URL_UAT,Location } from "../../auth/config";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPrescription,faFileInvoiceDollar,faCircleInfo,faCalendarDay,faFileInvoice,faNoteSticky  } from '@fortawesome/free-solid-svg-icons';
import "./pharmacy.css"
import Swal from "sweetalert2";
import { el } from "date-fns/locale";
import DialogWithdraw from "./DialogWithdraw";
import DialogCreateRec from "./DialogCreateRec";

const PharmacyInfo = () => {
  const location = useLocation();
  const { state } = location; 

  const queue_id = state.queue_id; 
  const hn_patient_id = state.hn_patient_id; 
  

  console.log(queue_id)
  console.log(hn_patient_id)

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  function refreshPage() {
    window.location.reload(false);
  }
  const handleLogout = () => {
    localStorage.clear(); // Clear data from localStorage
    window.location.href = Location; // Redirect to the main page
  };


  const apiKey = localStorage.getItem("token"); // ใส่ API Key ที่นี่
  const clinic_id = localStorage.getItem("clinic_id"); // ใส่ API Key ที่นี่

  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");
  const [treatmentData, setTreatmentData] = useState(null); // State to store treatment data
  const [history_id, sethistory_id] = useState('');
  const [receiptsData, setreceiptsData] = useState('');
  const [CertData, setCertData] = useState([]);
  const [CertforcartsData, setCertforcartsData] = useState([]);

  const formatter = new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB'});

  const apiUrl = `${APi_URL_UAT}treatment_items&queue_id=${queue_id}`; // ใส่ API Key ที่นี่
  const fetchTreatmentData = () => {
    const myHeaders = new Headers();
    myHeaders.append("X-API-KEY", apiKey);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if(data.success){
          setTreatmentData(data.data);
          sethistory_id(data.data.treatment.history_id);
          setStatus(data.data.treatment.status)
        }
      }
    ) // Store the treatment data
      .catch((error) => console.error("Error fetching treatment data:", error));
  };

  console.log("history_id : "+history_id)

  // INSERT CERT
  const apiUrl_CreCert = `${APi_URL_UAT}insert_medical_certificate`; // ใส่ API Key ที่นี่

  const handleCreCert = (certificate_type,hn,history_id) => {
    console.log(certificate_type);
    console.log(hn);
    console.log(history_id);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("X-API-KEY", apiKey);

    const raw = JSON.stringify({
      "certificate_type": certificate_type,
      "hn": hn,
      "history_id": history_id,
      "clinic_id": clinic_id
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch(apiUrl_CreCert, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        if(data["success"]===true){
          Swal.fire({
          title: "Success!",
          text: data.message,
          icon: "success",
          showCancelButton: false,
          confirmButtonText: "OK",
          }).then(() => {
            Cert(history_id);
            CertforCar(history_id);
          });
        }else{
          if(data.status === "error") {
            Swal.fire({
              icon: 'error',
              title: 'Token! หมดอายุ',
              text: 'กรุณาเข้าสู่ระบบใหม่',
              confirmButtonText: 'ออกจากระบบ'
            }).then(() => {
              handleLogout()
            });
            console.error("Unauthorized: กรุณาตรวจสอบ API Key หรือการเข้าสู่ระบบ");
          }else{
            Swal.fire({
            title: "Error!",
            text:data.message,
            icon: "error",
            confirmButtonText: "OK",
            });
          }
        }
      })
      .catch((error) => console.error(error));
  };

  // PAYMENT
  const handlePayment = (total_sum,queue_id) => {
    Swal.fire({
      title: "การชำระเงิน",
      text: "เลือกช่องทางการชำระเงิน",
      showCloseButton: true, // แสดงปุ่ม X ปิดที่มุมขวาบน
      allowOutsideClick: false, // ไม่ให้คลิกนอกกล่องแล้วปิด
      showDenyButton: true,
      confirmButtonText: "เงินสด",
      confirmButtonColor: "#198754",
      denyButtonText: "โอนจ่าย",
      denyButtonColor: "#1e88e5",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      let pagament = "";
      if (result.isConfirmed) {
        pagament = "เงินสด";
        handlePaymentAPI(total_sum,queue_id,pagament);
      } else if (result.isDenied) {
        pagament = "เงินโอน";
        handlePaymentAPI(total_sum,queue_id,pagament);
      } else if (result.dismiss === Swal.DismissReason.close) {
        pagament = "ยกเลิก"; // หรือจะไม่ต้องทำอะไรก็ได้
      }
    });
  };
  const apiUrl_Payment = `${APi_URL_UAT}pagament`; // ใส่ API Key ที่นี่
  const handlePaymentAPI = (total_sum,queue_id,pagament) => {
    const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("X-API-KEY", apiKey);

      const raw = JSON.stringify({
        "queue_id": queue_id,
        "total_treatment_cost": total_sum,
        "pagament": pagament
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      fetch(apiUrl_Payment, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        if(data["success"]===true){
          Swal.fire({
          title: "Success!",
          text: data.message,
          icon: "success",
          showCancelButton: false,
          confirmButtonText: "OK",
          }).then(() => {
            refreshPage();
          });
        }else{
          if(data.status === "error") {
            Swal.fire({
              icon: 'error',
              title: 'Token! หมดอายุ',
              text: 'กรุณาเข้าสู่ระบบใหม่',
              confirmButtonText: 'ออกจากระบบ'
            }).then(() => {
              handleLogout()
            });
            console.error("Unauthorized: กรุณาตรวจสอบ API Key หรือการเข้าสู่ระบบ");
          }else{
            Swal.fire({
            title: "Error!",
            text:data.message,
            icon: "error",
            confirmButtonText: "OK",
            });
          }
        }
      })
      .catch((error) => console.error(error));
  }

  // FATCH CERTIFICATE AND RECEIPT
  // const [DisabledRec, setDisabledRec] = useState(true);
  const [DisabledPay, setDisabledPay] = useState(false);

  const apiUrl_receipts = `${APi_URL_UAT}list_receipts&clinic_id=${clinic_id}&history_id=${history_id}`; // ใส่ API Key ที่นี่
  const apiUrl_Cert = `${APi_URL_UAT}get_certificate_detail&history_id=${history_id}&certificate_type=general&clinic_id=${clinic_id}`; // ใส่ API Key ที่นี่
  const apiUrl_Certforcar = `${APi_URL_UAT}get_certificate_detail&history_id=${history_id}&certificate_type=driving&clinic_id=${clinic_id}`; // ใส่ API Key ที่นี่

  const list_receipts = async(history_id) => {
    const myHeaders = new Headers();
    myHeaders.append("X-API-KEY", apiKey);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    fetch(`${APi_URL_UAT}list_receipts&clinic_id=${clinic_id}&history_id=${history_id}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if(data["success"]===true){
          setreceiptsData(data.data.receipt.total_price)
        }else{
          if(data.status === "error") {
            Swal.fire({
              icon: 'error',
              title: 'Token! หมดอายุ',
              text: 'กรุณาเข้าสู่ระบบใหม่',
              confirmButtonText: 'ออกจากระบบ'
            }).then(() => {
              handleLogout()
            });
            console.error("Unauthorized: กรุณาตรวจสอบ API Key หรือการเข้าสู่ระบบ");
          }else{
            setreceiptsData('');
          }
          
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  const Cert = async(history_id) => {
    const myHeaders = new Headers();
    myHeaders.append("X-API-KEY", apiKey);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    fetch(`${APi_URL_UAT}get_certificate_detail&history_id=${history_id}&certificate_type=general&clinic_id=${clinic_id}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if(data["success"]===true){
          setCertData(data.data)
          console.log(data.data)
        }else{
          if(data.status === "error") {
            Swal.fire({
              icon: 'error',
              title: 'Token! หมดอายุ',
              text: 'กรุณาเข้าสู่ระบบใหม่',
              confirmButtonText: 'ออกจากระบบ'
            }).then(() => {
              handleLogout()
            });
            console.error("Unauthorized: กรุณาตรวจสอบ API Key หรือการเข้าสู่ระบบ");
          }else{
            setCertData([])
          }
          
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  const CertforCar = async(history_id) => {
    const myHeaders = new Headers();
    myHeaders.append("X-API-KEY", apiKey);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    fetch(`${APi_URL_UAT}get_certificate_detail&history_id=${history_id}&certificate_type=driving&clinic_id=${clinic_id}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if(data["success"]===true){
          setCertforcartsData(data.data)
        }else{
          if(data.status === "error") {
            Swal.fire({
              icon: 'error',
              title: 'Token! หมดอายุ',
              text: 'กรุณาเข้าสู่ระบบใหม่',
              confirmButtonText: 'ออกจากระบบ'
            }).then(() => {
              handleLogout()
            });
            console.error("Unauthorized: กรุณาตรวจสอบ API Key หรือการเข้าสู่ระบบ");
          }else{
            setCertforcartsData([])
          }
          
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  };
  console.log(CertData)
  // LINK PAPER
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
  const handleRec = (history_id) => {
    const printUrl = `https://www.addpay.co.th/service-ui/service-my-clinic/service-my-monitor/report_receipts/${clinic_id}/${history_id}`;
    const printWindow = window.open(printUrl, '_blank', 'width=600,height=400');
  };
  const handleCert = (history_id) => {
    const printUrl = `https://www.addpay.co.th/service-ui/service-my-clinic/service-my-report/Medical_certificatePDF.php?history_id=${history_id}`;
    const printWindow = window.open(printUrl, '_blank', 'width=600,height=400');
  };
  const handleCertforcar = (history_id) => {
    const printUrl = `https://www.addpay.co.th/service-ui/service-my-clinic/service-my-report/Medical_certificate_for_carPDF.php?history_id=${history_id}`;
    const printWindow = window.open(printUrl, '_blank', 'width=600,height=400');
  };

  useEffect(() => {
    fetchTreatmentData();
    if(history_id){
      list_receipts(history_id);
      Cert(history_id);
      CertforCar(history_id);
    }

    if(status==="ทำรายการเสร็จสิ้น"){
      setDisabledPay(true)
    }else if(status==="รอรับยา"){
      setDisabledPay(false)
    }else{
      setDisabledPay(true)
    }

  }, [history_id,status]);

  return (
    <div>
      <div className="p-4 mb-5 ">
        <h2 className="text-start display-6 fw-semibold text-titlepage">ข้อมูลการรักษา <span className="fw-light fs-3">(เภสัชกรรม)</span></h2>
        <nav aria-label="breadcrumb" className="bg-light rounded-2 px-3 p-2">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <Link to="/pharmacy" className="breadcrumb-link">
                <FontAwesomeIcon className="me-1" icon={faPrescription} />เภสัชกรรม
              </Link>
            </li>
            <li className="breadcrumb-item mb-0 active" aria-current="page"><FontAwesomeIcon className="me-1" icon={faFileInvoiceDollar} />ข้อมูลการรักษา</li>
          </ol>
        </nav>
        <div className="mt-3">
            <div className="mt-3">
              {treatmentData && (
                <div className="card card-body">
                  <p className="fs-3 fw-semibold">ข้อมูลการรักษา</p>
                  <div className="row">
                    <div className="col-md-6">
                      <p className="mb-0"><strong>ชื่อผู้ป่วย:</strong> {treatmentData.treatment.name}</p>
                      <p className="mb-0"><strong>วันที่รักษา:</strong> {treatmentData.treatment.treatment_date}</p>
                      <p className=""><strong>อายุ:</strong> {treatmentData.patient.age}</p>
                      {treatmentData.fu&&
                          treatmentData.fu.map((fu) => (
                            <div key={fu.fu_id}>
                            <p className="mb-0"><strong>วันที่นัดหมาย:</strong> {new Date(fu.date).toLocaleDateString("th-TH", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })}</p>
                            <p className="mb-0"><strong>เวลา:</strong> {fu.time}</p>
                            <p className=""><strong>รายละเอียด:</strong> {fu.details}</p>
                            </div>
                        ))}
                      <p className=""><strong>สิทธิ์รักษา:</strong> {treatmentData.patient.insurance}</p>
                      <p className="mb-0"><strong>สถานะ:</strong> {treatmentData.treatment.status}</p>

                      <p className="mb-0"><strong>ยอดค่าใช้จ่ายรวม:</strong> {formatter.format(receiptsData)}</p>
                      <p className="mb-0"><strong>ช่องทางการชำระ:</strong> {treatmentData.treatment.pagament}</p>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex flex flex-wrap">
                        <div className="col-12 col-lg-6 p-1 d-grid gap-2">
                        {treatmentData.fu.length !== 0?
                          <button  onClick={()=>handleReport(treatmentData.treatment.history_id)} className="btn btn-outline-success text-start">
                            <FontAwesomeIcon className="me-2 fa-lg fa-icon" icon={faCalendarDay} /> บัตรนัด
                          </button>
                        :
                          <button  onClick={()=>handleReport(treatmentData.treatment.history_id)} className="btn btn-outline-success disabled  text-start">
                            <FontAwesomeIcon className="me-2 fa-lg fa-icon" icon={faCalendarDay} /> บัตรนัด
                          </button>
                        }
                        </div>
                        <div className="col-12 col-lg-6 p-1 d-grid gap-2">
                          <button onClick={()=>handleSTReport(treatmentData.treatment.history_id)} className="btn btn-outline-success  text-start">
                              <FontAwesomeIcon className="me-2 fa-lg fa-icon" icon={faPrescription} /> สติ๊กเกอร์ซองยา
                          </button>
                        </div>
                        <div className="col-12 col-lg-6 p-1 d-grid gap-2">
                          <button onClick={()=>handleBCReport()}  className="btn btn-outline-success  text-start">
                            <FontAwesomeIcon className="me-2 fa-lg fa-icon" icon={faNoteSticky} /> สติ๊กเกอร์เปล่า
                          </button>
                        </div>
                        <div className="col-12 col-lg-6 p-1 d-grid gap-2">
                        {receiptsData > 0 ? (
                          <button className={`btn btn-outline-success  text-start`} onClick={()=>handleRec(treatmentData.treatment.history_id)} >
                            <FontAwesomeIcon className="me-2 fa-lg fa-icon" icon={faFileInvoice} /> ใบเสร็จ
                          </button>
                        ) : (
                          <DialogCreateRec treatmentData={treatmentData} />
                        )}
                        </div>
                        <div className="col-12 col-lg-6 p-1 d-grid gap-2">
                        {CertData.length !== 0 ? (
                            <button className={`btn btn-outline-success  text-start`} onClick={()=>handleCert(treatmentData.treatment.history_id)} >
                            <FontAwesomeIcon className="me-2 fa-lg fa-icon" icon={faFileInvoice} /> ใบรับรองแพทย์
                          </button>
                        ) : (
                          <button className={`btn btn-outline-success  text-start`} onClick={()=>handleCreCert("general",treatmentData.treatment.hn_patient_id,treatmentData.treatment.history_id)} >
                          <FontAwesomeIcon className="me-2 fa-lg fa-icon" icon={faFileInvoice} /> สร้างใบรับรองแพทย์
                        </button>
                        )}
                        </div>
                        <div className="col-12 col-lg-6 p-1 d-grid gap-2">
                        {CertforcartsData.length !== 0 ? (
                          <button className={`btn btn-outline-success text-start`} onClick={()=>handleCertforcar(treatmentData.treatment.history_id)} >
                          <FontAwesomeIcon className="me-2 fa-lg fa-icon" icon={faFileInvoice} /> ใบรับรองแพทย์<br/>(สำหรับใบอนุญาตขับรถ)
                          </button>
                        ) : (
                          <button className={`btn btn-outline-success text-start`} onClick={()=>handleCreCert("driving",treatmentData.treatment.hn_patient_id,treatmentData.treatment.history_id)} >
                          <FontAwesomeIcon className="me-2 fa-lg fa-icon" icon={faFileInvoice} /> สร้างใบรับรองแพทย์<br/>(สำหรับใบอนุญาตขับรถ)
                        </button>
                        )}
                        </div>
                        <div className="mt-4 col-12 p-1 d-grid gap-2">
                        {receiptsData ? (
                          DisabledPay ? (
                            <button className={`btn btn-primary`} disabled={DisabledPay}>
                              <FontAwesomeIcon className="me-2 fa-lg fa-icon" icon={faFileInvoice} /> ชำระเงินเรียบร้อย
                            </button>
                          ):(
                            <button onClick={()=>handlePayment(receiptsData,queue_id)} className={`btn btn-primary`}>
                              <FontAwesomeIcon className="me-2 fa-lg fa-icon" icon={faFileInvoice} /> ชำระเงิน
                            </button>
                          )
                        ) : (
                          <button className={`btn btn-outline-danger disabled`} >
                            <FontAwesomeIcon className="me-2 fa-lg fa-icon" icon={faFileInvoice} /> ชำระเงิน (สร้างใบเสร็จก่อน)
                          </button>
                        )}
                          
                        </div>
                        <div className="mt-4 col-12 p-1 d-grid gap-2">
                          <DialogWithdraw />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="mt-4 fs-4">รายการวินิจฉัย (Dx)</p>
                    <div className="table-responsive ">
                      <table className="table">
                        <thead className="table-primary">
                          <tr>
                            <th>#</th>
                            <th>รายละเอียดการวินิจฉัย</th>
                          </tr>
                        </thead>
                        <tbody>
                          {treatmentData.dx&&
                          treatmentData.dx.map((dx, index) => (
                            <tr key={dx.dx_id}>
                              <td>{index + 1}</td>
                              <td>{dx.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="mt-4 fs-4">รายการยา (Rx)</p>
                    <div className="table-responsive">
                      <table className="table">
                        <thead className="table-primary">
                          <tr>
                            <th>#</th>
                            <th>ชื่อยา</th>
                            <th>ขนาดยา</th>
                            <th>คำแนะนำการใช้</th>
                            <th className="text-center">จำนวน</th>
                            <th className="text-center">ราคารวม</th>
                            <th>วันที่สั่งยา</th>
                          </tr>
                        </thead>
                        <tbody>
                          {treatmentData.rx&&
                          treatmentData.rx.map((rx, index) => (
                            <tr key={rx.rx_id}>
                              <td>{index + 1}</td>
                              <td>{rx.medicine_name}</td>
                              <td>{rx.dosage}</td>
                              <td>{rx.usage_instruction}</td>
                              <td className="text-center">{rx.quantity}</td>
                              <td className="text-center">{rx.total_price}</td>
                              <td>{new Date(rx.created_at).toLocaleDateString("th-TH", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {/* ตาราง Prx (หัตถการ) */}
                    <p className="mt-4 fs-4">รายการหัตถการ (Prx)</p>
                    <div className="table-responsive">
                      <table className="table">
                        <thead className="table-primary">
                          <tr>
                            <th>#</th>
                            <th>ชื่อหัตถการ</th>
                            <th className="text-center">ราคารวม</th>
                            <th>วันที่ดำเนินการ</th>
                          </tr>
                        </thead>
                        <tbody>
                          {treatmentData.prx&&
                          treatmentData.prx.map((prx, index) => (
                            <tr key={prx.prx_id}>
                              <td>{index + 1}</td>
                              <td>{prx.procedure_name}</td>
                              <td className="text-center">{prx.total_price}</td>
                              <td>
                                {new Date(prx.created_at).toLocaleDateString("th-TH", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {/* ตาราง Lab Results (ผลการตรวจแลป) */}
                    <p className="mt-4 fs-4">รายการตรวจแลป (Lab Results)</p>
                    <div className="table-responsive">
                      <table className="table">
                        <thead className="table-primary">
                          <tr>
                            <th>#</th>
                            <th>ชื่อการทดสอบ</th>
                            <th>ผลลัพธ์</th>
                            <th>สถานะ</th>
                            <th className="text-center">ราคารวม</th>
                            <th>วันที่ตรวจ</th>
                          </tr>
                        </thead>
                        <tbody>
                          {treatmentData.lab_results&&
                          treatmentData.lab_results.map((lab, index) => (
                            <tr key={lab.lab_id}>
                              <td>{index + 1}</td>
                              <td>{lab.test_name}</td>
                              <td>{lab.result_value}</td>
                              <td>{lab.status_sen}</td>
                              <td className="text-center">{lab.total_price}</td>
                              <td>
                                {new Date(lab.created_at).toLocaleDateString("th-TH", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {/* ตาราง X-ray Results (ผลการตรวจเอกซเรย์) */}
                    <p className="mt-4 fs-4">รายการตรวจเอกซเรย์ (X-ray Results)</p>
                    <div className="table-responsive">
                      <table className="table">
                        <thead className="table-primary">
                          <tr>
                            <th>#</th>
                            <th>รายละเอียด</th>
                            <th  className="text-center">ราคารวม</th>
                            <th>วันที่ตรวจ</th>
                          </tr>
                        </thead>
                        <tbody>
                          {treatmentData.xr_results&&
                          treatmentData.xr_results.map((xr, index) => (
                            <tr key={xr.xr_id}>
                              <td>{index + 1}</td>
                              <td>{xr.description}</td>
                              <td  className="text-center">{xr.total_price}</td>
                              <td>
                                {new Date(xr.created_at).toLocaleDateString("th-TH", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {/* ตาราง PE (การตรวจร่างกาย) */}
                    <p className="mt-4 fs-4">การตรวจร่างกาย (PE)</p>
                    <div className="table-responsive">
                      <table className="table">
                        <thead className="table-primary">
                          <tr>
                            <th>#</th>
                            <th>รายละเอียดการตรวจ</th>
                            <th className="text-center">ราคารวม</th>
                            <th>วันที่ตรวจ</th>
                          </tr>
                        </thead>
                        <tbody>
                          {treatmentData.pe&&
                          treatmentData.pe.map((pe, index) => (
                            <tr key={pe.pe_id}>
                              <td>{index + 1}</td>
                              <td>{pe.description}</td>
                              <td className="text-center">{pe.total_price}</td>
                              <td>
                                {new Date(pe.created_at).toLocaleDateString("th-TH")}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {/* Add more treatment details as needed */}
                </div>
              )}
              
            </div>
        </div>
      </div>
    </div>
  )
}

export default PharmacyInfo
