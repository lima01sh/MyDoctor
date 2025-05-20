import React, { useState, useEffect } from "react";
import { Link,useLocation, useNavigate } from 'react-router-dom';
import { APi_URL_UAT,APi_URL_UPLOAD,Location } from "../../auth/config";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouseCircleExclamation,faEllipsis,faMagnifyingGlass,faUserMinus,faListUl } from '@fortawesome/free-solid-svg-icons';
import Swal from "sweetalert2";
import "./report.css";

import IncomeChart from "./IncomeChart";

const ReportIncome = () => {
  const location = useLocation();
  const { state } = location;
  const clinic_id = localStorage.getItem('clinic_id');

  const apiKey = localStorage.getItem("token"); // ใส่ API Key ที่นี่

  const date = new Date();
  const currentYear = date.getFullYear();
  const currentMonth = (date.getMonth() + 1).toString().padStart(2, '0');
  const defaultYear = `${currentYear}`;
  const defaultMonth = `${currentYear}-${currentMonth}`;
  const today = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear() + 543}`;

  const [year, setyear] = useState(currentYear);
  const [month, setmonth] = useState(currentMonth);
  const [monthN, setmonthN] = useState("");

  const [MonthInput, setMonthInput] = useState('');
  const [startDateInput, setStartDateInput] = useState('');
  const [endDateInput, setEndDateInput] = useState('');
  const [start_date, setstart_date] = useState("");
  const [end_date, setend_date] = useState("");

  const [data, setData] = useState({});
  const [incomeData, setIncomeData] = useState([]);

  const [isNone, setIsNone] = useState('d-none');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleMonthChange = (e) => {
    const month77 = e.target.value;
    const [yearC, monthC] = e.target.value.split("-");
    setMonthInput(month77)
    setyear(yearC);
    setmonth(monthC);
    setstart_date("");
    setend_date("");
    setStartDateInput('');
    setEndDateInput('');
    setIsNone('d-none');
  };
  
  const handleYearChange = (e) => {
    const Year1 = e.target.value;
    setyear(Year1);
    setmonth(currentMonth);
    setstart_date("");
    setend_date("");
    setStartDateInput('');
    setEndDateInput('');
    setIsNone('d-none');
  };

  const handleSearch = () => {
    setstart_date(startDateInput);
    setend_date(endDateInput);
    setyear(currentYear);
    setmonth(currentMonth);
    
    if (!startDateInput || !endDateInput) {
      setIsNone('d-none');
    } else {
      setIsNone(''); // ซ่อนข้อความ
      console.log('ค้นหาวันที่: ', startDateInput, 'ถึง', endDateInput);
    }

    setStartDateInput('');
    setEndDateInput('');
  };

  const getThaiMonth = (no) => {
    const thaiMonths = [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];

    const monthNum = parseInt(no, 10);
    if (!monthNum || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      return "ไม่มีข้อมูล";
    }

    return thaiMonths[monthNum - 1];
  };
  
  let apiUrl ='';
  if(!month){
    apiUrl = `${APi_URL_UAT}income_report&clinic_id=${clinic_id}&year=${year}&start_date=${start_date}&end_date=${end_date}`; // ใส่ API Key ที่นี่
  }else{
    apiUrl = `${APi_URL_UAT}income_report&clinic_id=${clinic_id}&year=${year}&month=${month}&start_date=${start_date}&end_date=${end_date}`; // ใส่ API Key ที่นี่
  }
    
  const reportincome = async (clinic_id,y, m,s,e) => {
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
        if(data["success"]===true){
          setData(data.data)

          const fillMissingMonths = (data) => {
            const months = [
              "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
              "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
            ];

            return months.map((month, index) => {
              const found = data.find((item) => item.month === index + 1); // เทียบเลขเดือน
              return found 
                ? { ...found,month_number: month, month_name: month }  // ถ้ามีข้อมูล เติมชื่อเดือนเพิ่ม
                : {  month_number: index + 1, month_name: month, total_income: 0, cash_income: 0, transfer_income: 0  }; // ถ้าไม่มีข้อมูล ให้ใส่ค่าเริ่มต้น
            });
          };
          setIncomeData(fillMissingMonths(data.data.monthly_income))
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
            text:
                "ไม่พบข้อมูล",
            icon: "error",
            confirmButtonText: "OK",
            });
          }
          
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  const [isDisabled, setIsDisabled] = useState('')

  useEffect(() => {
    if ((year && month)||(start_date&&end_date)) {
      reportincome(clinic_id,year, month,start_date,end_date);
      setmonthN(getThaiMonth(month));
    }
  }, [clinic_id,year, month,start_date,end_date]);

  useEffect(() => {
    if (!startDateInput || !endDateInput) {
      setIsDisabled('disabled');
    } else {
      setIsDisabled('');
    }
  }, [startDateInput, endDateInput]);

  const formatCurrency = (number, currency = 'THB') => {
      return new Intl.NumberFormat('th-TH', {
          style: 'currency',
          currency: currency
      }).format(number);
  };

  return (
    <div>
        <div className="row mt-2">
            <div className="col-md-6 mb-3 mb-md-0">
                <div className="card card-warm border-0">
                    <div className="card-body">
                        <p className="card-title h5 mb-0">ยอดรายได้รวม</p>
                        <p className="card-text">ทั้งหมด</p>
                        <p className="card-text text-center mb-0 h1 text-warning-dark">{formatCurrency(data.total_income?.total_income ?? "0")}</p>
                        <div className="mt-3 d-flex justify-content-between align-items-center">
                            <div>
                                <p className="card-text mb-0">เงินสด</p>
                                <p className="card-text mb-0 fs-5 text-dark">{formatCurrency(data.total_income?.cash_income ?? "0")}</p>
                            </div>
                            <span className="mx-2">|</span> {/* ขีดคั่นระหว่างข้อความ */}
                            <div>
                                <p className="card-text text-end mb-0">ยอดโอน</p>
                                <p className="card-text text-end mb-0 fs-5 text-dark">{formatCurrency(data.total_income?.transfer_income ?? "0")}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-6 mb-3 mb-md-0">
                <div className="card card-success border-0">
                    <div className="card-body">
                        <p className="card-title h5 mb-0">ยอดรายได้ประจำวัน</p>
                        <p className="card-text">{today}</p>
                        <p className="card-text text-center mb-0 h1 text-success">{formatCurrency(data.today_income?.total_income ?? "0")}</p>
                        <div className="mt-3 d-flex justify-content-between align-items-center">
                        <div>
                            <p className="card-text mb-0">เงินสด</p>
                            <p className="card-text mb-0 fs-5 text-dark">{formatCurrency(data.today_income?.cash_income ?? "0")}</p>
                        </div>
                        <span className="mx-2">|</span> {/* ขีดคั่นระหว่างข้อความ */}
                        <div>
                            <p className="card-text text-end mb-0">ยอดโอน</p>
                            <p className="card-text text-end mb-0 fs-5 text-dark">{formatCurrency(data.today_income?.transfer_income ?? "0")}</p>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>

            <p className="mt-5 fs-3 fw-bold">ค้นหายอดรายได้</p>
            <div className="text-center">
            <div className="d-flex justify-content-between">
                <div className="col-md-3">
                <div className="input-group mb-3">
                    <span className="input-group-text">ปี (พ.ศ.)</span>
                    <input type="number" className="form-control" value={year} onChange={handleYearChange} />
                </div>
                </div>
                <div className="col-md-3 ms-3">
                <div className="input-group mb-3">
                    <span className="input-group-text">เดือน</span>
                    <input type="month" className="form-control" value={MonthInput||defaultMonth} onChange={handleMonthChange} />
                </div>
                </div>
                <div className="col-md-5 ms-3">
                <div className="input-group mb-3">
                    <span className="input-group-text">ระหว่าง วันที่</span>
                    <input type="date" className="form-control" name="start_date" value={startDateInput} onChange={(e) => setStartDateInput(e.target.value)} />
                    <span className="input-group-text">ถึง</span>
                    <input type="date" className="form-control" name="end_date" value={endDateInput} onChange={(e) => setEndDateInput(e.target.value)} />
                    <button className={`btn btn-primary ${isDisabled}`} disabled={isDisabled === 'disabled'} onClick={handleSearch} >
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </button>
                </div>
                </div>
            </div>

            <div className={`mt-4 ${isNone?`d-none`:``}`}> 
                <div className="card card-Lavender border-0">
                <div className="card-body">
                    <p className="card-title h5 mb-0">ยอดรายได้ </p>
                    <p className="card-text">ระหว่างวันที่ {start_date || "------ --"} ถึง {end_date || "------ --"}</p>
                    <p className="card-text text-center mb-0 h1 text-RebeccaPurple">{formatCurrency(data.period_income?.total_income ?? "0")}</p>
                    <div className="mt-3 d-flex justify-content-between align-items-center">
                    <div className="mx-auto">
                        <p className="card-text text-center mb-0">เงินสด</p>
                        <p className="card-text text-center mb-0 fs-5 text-dark">{formatCurrency(data.period_income?.cash_income ?? "0")}</p>
                    </div>
                    <span className="mx-2">|</span> {/* ขีดคั่นระหว่างข้อความ */}
                    <div className="mx-auto">
                        <p className="card-text text-center mb-0">ยอดโอน</p>
                        <p className="card-text text-center mb-0 fs-5 text-dark">{formatCurrency(data.period_income?.transfer_income ?? "0")}</p>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            <div className="mt-4 row">
                <div className="col-md-6 mb-3 mb-md-0">
                    <div className="card card-primary border-0">
                        <div className="card-body">
                            <p className="card-title h5 mb-0">ยอดรายได้ของปี </p>
                            <p className="card-text">{data.yearly_income?.year ?? year}</p>
                            <p className="card-text text-center mb-0 h1 text-titlepage-drak">{formatCurrency(data.yearly_income?.total_income ?? "0")}</p>
                            <div className="mt-3 d-flex justify-content-between align-items-center">
                                <div>
                                <p className="card-text mb-0">เงินสด</p>
                                <p className="card-text mb-0 fs-5 text-dark">{formatCurrency(data.yearly_income?.cash_income ?? "0")}</p>
                                </div>
                                <span className="mx-2">|</span> {/* ขีดคั่นระหว่างข้อความ */}
                                <div>
                                <p className="card-text text-end mb-0">ยอดโอน</p>
                                <p className="card-text text-end mb-0 fs-5 text-dark">{formatCurrency(data.yearly_income?.transfer_income ?? "0")}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 mb-3 mb-md-0">
                <div className="card card-peach border-0">
                    <div className="card-body">
                    <p className="card-title h5 mb-0">ยอดรายได้ของเดือน </p>
                    <p className="card-text">{monthN || "ไม่มีข้อมูล"}</p>
                    <p className="card-text text-center mb-0 h1 text-peach-dark">{formatCurrency(data.monthly_filtered_income?.total_income ?? "0")}</p>
                    <div className="mt-3 d-flex justify-content-between align-items-center">
                        <div>
                        <p className="card-text mb-0">เงินสด</p>
                        <p className="card-text mb-0 fs-5 text-dark">{formatCurrency(data.monthly_filtered_income?.cash_income ?? "0")}</p>
                        </div>
                        <span className="mx-2">|</span> {/* ขีดคั่นระหว่างข้อความ */}
                        <div>
                        <p className="card-text text-end mb-0">ยอดโอน</p>
                        <p className="card-text text-end mb-0 fs-5 text-dark">{formatCurrency(data.monthly_filtered_income?.transfer_income ?? "0")}</p>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>

            <p className="mt-5 fs-4 fw-bold">ยอดรายเดือน</p>
            <div className="w-100">
                <div className="w-100 mx-auto">
                <IncomeChart incomeData={incomeData} />
                </div>
            </div>
        </div>
    </div>
  )
}

export default ReportIncome

