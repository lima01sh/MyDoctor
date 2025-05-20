import React, { useState, useEffect } from "react";
import { Link,useLocation, useNavigate } from 'react-router-dom';
import { APi_URL_UAT,APi_URL_UPLOAD,Location } from "../../auth/config";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWarehouse,faTrashCan,faMagnifyingGlass,faBook,faFilePrescription,faEye,faBitcoinSign } from '@fortawesome/free-solid-svg-icons';
import Swal from "sweetalert2";
import DialogAddStock from "./DialogAddStock";

import './Medicine_warehouse.css'
import DataTable from "react-data-table-component";
const Medicine_warehouse = () => {
    const location = useLocation();
    const { state } = location;
    const clinic_id = localStorage.getItem('clinic_id');

    const apiKey = localStorage.getItem("token"); // ใส่ API Key ที่นี่

    function refreshPage() {
      window.location.reload(false);
    }
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // tABLE
    const customStyles = {
      rows: {
        style: {
          minHeight: '60px', // override the row height
        },
      },
      headCells: {
        style: {
          fontSize: '16px',
          fontWeight: 'bold',
          backgroundColor: '#CCE5FF',
        },
      },
      cells: {
        style: {
          fontSize: '16px',
        },
      },
    };
    const paginationComponentOptions = {
        selectAllRowsItem: true,
        selectAllRowsItemText: 'Alls',
    };
    const columns = [
      {
          id: "1",
          name: 'เลขที่รอบนำเข้า',
          selector: (row) => row.lot_number,
          cell: (row) => (
            <div className="">
              <p>{row.lot_number}</p>
            </div>
          ),
          sortable: true,
      },
      {
          id: "2",
          name: 'ชื่อยา',
          selector: (row) => row.med_name,
          cell: (row) => (
            <div className="">
              <p>{row.med_name}</p>
            </div>
          ),
          sortable: true,
      },
      {
          id: "3",
          name: 'จำนวนยา',
          selector: (row) => row.quantity,
          cell: (row) => (
            <div className="mx-auto">
              <p>{row.quantity}</p>
            </div>
          ),
          sortable: true,
      },
      {
          id: "4",
          name: 'วันหมดอายุ',
          selector: (row) => row.expire_date,
          cell: (row) => (
            <div className="mx-auto">
              <p>{row.expire_date}</p>
            </div>
          ),
          sortable: true,
      },
      {
          id: "5",
          name: 'เพิ่มเติม',
          cell: (row) => (
            <div className="dropdown">
              <button className="btn btn-outline-dark dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                เพิ่มเติม
              </button>
              <ul className="dropdown-menu">
                <li>
                  <a className="dropdown-item " data-bs-toggle="modal" data-bs-target={"#Modalinfo"+row.id}>
                  <FontAwesomeIcon className="me-1" icon={faEye} /> ดูข้อมูลเพิ่มเติม
                  </a>
                </li>
                <li>
                  <a className="dropdown-item text-titlepage" data-bs-toggle="modal" data-bs-target={"#Modalupprice"+row.id}>
                  <FontAwesomeIcon className="me-1" icon={faBitcoinSign} /> อัพเดตราคา
                  </a>
                </li>
                <li>
                  <a className="dropdown-item text-success" data-bs-toggle="modal" data-bs-target={"#Modal"+row.id}>
                  <FontAwesomeIcon className="me-1" icon={faFilePrescription} /> บันทึกเบิกยา
                  </a>
                </li>
                <li>
                  <a className="dropdown-item text-danger" onClick={() =>confirmClear(row.id)}>
                    <FontAwesomeIcon className="me-1" icon={faTrashCan} /> ล้างสต็อก
                  </a>
                </li>
              </ul>
              <div className="modal fade" id={"Modalupprice"+row.id} aria-labelledby="ModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h1 className="modal-title fs-5" id="ModalLabel">อัพเดตราคา</h1>
                      <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                      <div className="modal-body">
                        <form onSubmit={handleSubmitprice}>
                          <p className="mb-0 fw-normal col-form-label">ราคาทุน : </p>
                          <input type="number" className="form-control" min="0" step="any" name="cost" value={(formDataup.cost ?? row?.cost ?? "")} onChange={handleChangeup} required />
                          <p className="mb-0 fw-normal col-form-label">ราคาขาย : </p>
                          <input type="number" className="form-control" min="0" step="any" name="price" value={(formDataup.price ?? row?.price ?? "")} onChange={handleChangeup} required />

                          <input type="hidden" name="meditem_id" value={(formDataup.meditem_id || row.meditem_id )} onChange={handleChangeup} required />

                          <button type="submit" className="px-5 py-2 btn btn-primary mt-3">
                            บันทึก
                          </button>
                        </form>
                      </div>
                  </div>
                </div>
              </div>
              <div className="modal fade" id={"Modalinfo"+row.id} aria-labelledby="ModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h1 className="modal-title fs-5" id="ModalLabel">ข้อมูลคลังยา เลขที่ {row.lot_number}</h1>
                      <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                      <div className="modal-body">
                        <p className="">เลขที่รอบนำเข้า : <span className="fw-light">{row.lot_number}</span></p>
                        <p className="">ชื่อยา : <span className="fw-light">{row.med_name}</span></p>
                        <p className="">หน่วยนับ : <span className="fw-light">{row.pres_unt}</span></p>
                        <p className="">ราคาขาย : <span className="fw-light">{row.price}</span></p>
                        <p className="">ราคาทุน : <span className="fw-light">{row.cost}</span></p>
                        <p className="">อัตราคิดเงิน : <span className="fw-light">{row.chrg_rat}</span></p>
                        <p className="">ค่าบรรจุภัณฑ์ : <span className="fw-light">{row.pack_chrg}</span></p>
                        <p className="">รหัสวิธีใช้ยา : <span className="fw-light">{row.medusage}</span></p>
                      </div>
                  </div>
                </div>
              </div>
              <div className="modal fade" id={"Modal"+row.id} aria-labelledby="ModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h1 className="modal-title fs-5" id="ModalLabel">บันทึกข้อมูลเบิกยา</h1>
                      <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                      <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                          <p className="mb-0 fw-normal col-form-label">รหัสล็อต : </p>
                          <input type="text" className="form-control" min="1"  value={row.lot_number} disabled />
                          <p className="mb-0 fw-normal col-form-label">ชื่อยา : </p>
                          <input type="text" className="form-control" min="1"  value={row.med_name} disabled />
                          <p className="mb-0 fw-normal col-form-label">จำนวนยาที่เบิก : </p>
                          <input type="number" className="form-control" min="1" name="quantity" value={formData.quantity||""} onChange={handleChange} required />
                          <p className="mb-0 fw-normal col-form-label">เบิกโดย : </p>
                          <input type="text" className="form-control" name="withdrawn_by" value={formData.withdrawn_by||""} onChange={handleChange} required />
                          <p className="mb-0 fw-normal col-form-label">โน๊ต : </p>
                          <input type="text" className="form-control" name="note" value={formData.note||""} onChange={handleChange} required />

                          <input type="hidden" name="stock_id" value={formData.id || row.id } onChange={handleChange} required />

                          <button type="submit" className="px-5 py-2 btn btn-primary"  data-bs-dismiss="modal" aria-label="Close">
                            บันทึก
                          </button>
                        </form>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          ),
      },
    ];

    // Table
    const [search, setSearch] = useState("");
  
    const handleChangeSearch = (event) => {
      setSearch(event.target.value);
    };
    // check search
    const [data, setData] = useState([]);

    const apiUrl = `${APi_URL_UAT}list_stock&clinic_id=${clinic_id}`; // ใส่ API Key ที่นี่
  
    const handleLogout = () => {
      localStorage.clear(); // Clear data from localStorage
      window.location.href =Location; // Redirect to the main page
    };

    const listStock = () => {
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
        console.log(result);
        if (result.success) {
          // console.log(result.data);
          setData(result.data);
        }else{
          if(result.status === "error") {
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
      .catch((error) => console.error(error));
    };

    const [expire_soon, setExpire_soon] = useState([]);

    const apiUrlExpire_soon = `${APi_URL_UAT}expire_soon&clinic_id=${clinic_id}`; // ใส่ API Key ที่นี่

    const listExpire_soon = () => {
      const myHeaders = new Headers();
      myHeaders.append("x-api-key", apiKey);
  
      const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
      };
  
      fetch(
        apiUrlExpire_soon,requestOptions
      )

      .then((response) => response.json())
      //  .then((result) => console.log(result))
      .then((result) => {
        console.log(result);
        if (result.success) {
          // console.log(result.data);
          setExpire_soon(result.data);
        }else{
          if(result.status === "error") {
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
      .catch((error) => console.error(error));
    };

    const [low_stock_lot, setLow_stock_lot] = useState([]);

    const apiUrlLow_stock_lot = `${APi_URL_UAT}low_stock_lot&clinic_id=${clinic_id}`; // ใส่ API Key ที่นี่

    const listLow_stock_lot = () => {
      const myHeaders = new Headers();
      myHeaders.append("x-api-key", apiKey);
  
      const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
      };
  
      fetch(
        apiUrlLow_stock_lot,requestOptions
      )

      .then((response) => response.json())
      //  .then((result) => console.log(result))
      .then((result) => {
        console.log(result);
        if (result.success) {
          // console.log(result.data);
          setLow_stock_lot(result.data);
        }else{
          if(result.status === "error") {
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
      .catch((error) => console.error(error));
    };

    const [formData, setFormData] = useState({});
    const [formDataup, setFormDataup] = useState({
      cost: "",
      print:"",
      meditem_id:""
    });
    const handleChangeup = (e) => {
      const { name, value } = e.target;
    
      setFormDataup((prev) => ({
        ...prev,
        [name]: value === "" ? "" : parseFloat(value), // รองรับการลบจนว่าง
      }));
    };

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const apiUrlSUbmit = `${APi_URL_UAT}withdraw_stock`; // ใส่ API Key ที่นี่
    const handleSubmit = (e) => {
      e.preventDefault();
      const stock_id = e.target.stock_id.value;
      console.log(formData);
      console.log(stock_id);

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("X-API-KEY",apiKey);

      const raw = JSON.stringify({
        "stock_id": stock_id,
        "quantity": formData.quantity,
        "withdrawn_by": formData.withdrawn_by,
        "note": formData.note
      });
      
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      fetch(apiUrlSUbmit, requestOptions)
      .then(response => {
        if (!response.ok) {
          if (response.status === 401) {
              Swal.fire({
              icon: 'error',
              title: 'Token! หมดอายุ',
              text: 'กรุณาเข้าสู่ระบบใหม่',
              confirmButtonText: 'ออกจากระบบ'
              }).then(() => {
              handleLogout()
              });
              console.error("Unauthorized: กรุณาตรวจสอบ API Key หรือการเข้าสู่ระบบ");
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.success === true) {
          Swal.fire({
            title: "Success!",
            text: data.message,
            icon: "success",
            confirmButtonText: "OK",
          }).then((data) => {
            if (data.isConfirmed) {
              refreshPage();
            }
          });
          //
        } else {
          Swal.fire({
            title: "Error!",
            text: data.message,
            icon: "error",
            confirmButtonText: "OK",
          }).then((data) => {
            if (data.isConfirmed) {
              refreshPage();
            }
          });
        }
      })
      .catch((error) => console.error(error));
    }
    const apiUrlSUbmitprice = `${APi_URL_UAT}update_meditem`; // ใส่ API Key ที่นี่
    const handleSubmitprice = (e) => {
      e.preventDefault();
      const meditem_id = e.target.meditem_id.value;
      const cost = e.target.cost.value;
      const price = e.target.price.value;
      console.log(formDataup);
      console.log(meditem_id);
      console.log(cost);
      console.log(price);

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("X-API-KEY",apiKey);

      const raw = JSON.stringify({
        "meditem_id": meditem_id,
        "cost": cost,
        "price": price
      });
      
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      fetch(apiUrlSUbmitprice, requestOptions)
      .then(response => {
        if (!response.ok) {
          if (response.status === 401) {
              Swal.fire({
              icon: 'error',
              title: 'Token! หมดอายุ',
              text: 'กรุณาเข้าสู่ระบบใหม่',
              confirmButtonText: 'ออกจากระบบ'
              }).then(() => {
              handleLogout()
              });
              console.error("Unauthorized: กรุณาตรวจสอบ API Key หรือการเข้าสู่ระบบ");
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.success === true) {
          Swal.fire({
            title: "Success!",
            text: data.message,
            icon: "success",
            confirmButtonText: "OK",
          }).then((data) => {
            if (data.isConfirmed) {
              refreshPage();
            }
          });
          //
        } else {
          Swal.fire({
            title: "Error!",
            text: data.message||data.statusCode,
            icon: "error",
            confirmButtonText: "OK",
          }).then((data) => {
            if (data.isConfirmed) {
              refreshPage();
            }
          });
        }
      })
      .catch((error) => console.error(error));
    }

    const apiUrl_Clear = `${APi_URL_UAT}cleared_stock&clinic_id=${clinic_id}`; // ใส่ API Key ที่นี่
    const confirmClear = (id) => {
      Swal.fire({
        title: "ต้องการล้างสต็อกยา?",
        text: "ยืนยันการล้างสต็อกยานี้ หรือไม่!",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Clear it!",
      }).then((result) => {
        if (result.isConfirmed) {
          // api
          const myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");
          myHeaders.append("X-API-KEY", apiKey);
  
          const raw = JSON.stringify({
            "id": id,
            "clinic_id": clinic_id
          });
  
          const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
          };
  
          fetch(
            apiUrl_Clear,requestOptions
          )
            .then((response) => response.json())
            .then((result) => {
              if (result.success === true) {
                Swal.fire({
                  title: "Deleted!",
                  text: data.message,
                  icon: "success",
                  showConfirmButton: false,
                  timer: 1500,
                });
                listStock();
              } else {
                Swal.fire({
                  title: "Error!",
                  text: data.message,
                  icon: "error",
                  confirmButtonText: "OK",
                });
              }
            })
            .catch((error) => console.error(error));
        }
      });
    };
  
  
    useEffect(() => {
        listStock();
        listExpire_soon();
        listLow_stock_lot();
    }, []);
  
  
    const filteredStock = data.filter(
    (row) =>
        row.med_name.toLowerCase().includes(search.toLowerCase()) ||
        row.lot_number.toLowerCase().includes(search.toLowerCase())
    );
    
  return (
    <div>
      <div className="p-4 mb-5 ">
        <h2 className="text-start display-6 fw-semibold text-titlepage">คลังยา</h2>
        <nav aria-label="breadcrumb" className="bg-light rounded-2 px-3 p-2">
        <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item mb-0 active" aria-current="page"><FontAwesomeIcon className="me-1" icon={faWarehouse} />คลังยา</li>
        </ol>
        </nav>
        
        <div className="row d-flex flex-column flex-md-row-reverse mt-4">
            <div className="col-12 col-md-4 d-flex flex-column mb-2">
                <div className="d-grid gap-2">
                  <Link to="/withdraw_history" className="py-2 btn btn-primary mb-3" type="button"
                      state={{
                          stock_id: "",
                      }}>
                      <FontAwesomeIcon className="me-1" icon={faBook} />ประวัติการเบิกยา
                  </Link>
                </div>
                <div className="card card-warm border-0 p-3 h6">
                    <p className="text-warning-dark">ยาที่กำลังจะหมด</p>
                    <ul className="list-group list-group-flush">
                      {low_stock_lot.map((row)=>(
                        <li key={row.id} className="list-group-item">
                          <p className="mb-0 fw-light"><span className="fw-normal">ชื่อยา:</span> {row.med_name}</p>
                          <p className="mb-0 fw-light"><span className="fw-normal">เลขล็อต:</span> {row.lot_number}</p>
                          <p className="mb-0 fw-light"><span className="fw-normal">จำนวนปัจจุบัน:</span> {row.quantity}</p>
                          <p className="mb-0 fw-light"><span className="fw-normal">จำนวนขั้นต่ำ:</span> {row.minimum_quantity}</p>
                        </li>
                      ))}  
                    </ul> 
                </div>
                <div className="card card-peach border-0 p-3 mt-3 ">
                    <p className="mb-0 text-peach-dark h6">ยาที่จะหมดอายุ</p>
                    <p className="fs-6 fw-light">(ภายใน 60 วัน)</p>
                    <ul className="list-group list-group-flush">
                      {expire_soon.map((row)=>(
                        <li key={row.id} className="list-group-item">
                          <p className="mb-0 fw-light"><span className="fw-normal">ชื่อยา:</span> {row.med_name}</p>
                          <p className="mb-0 fw-light"><span className="fw-normal">เลขล็อต:</span> {row.lot_number}</p>
                          <p className="mb-0 fw-light"><span className="fw-normal">จำนวน/เม็ด:</span> {row.quantity}</p>
                          <p className="mb-0 fw-light"><span className="fw-normal">หมดอายุ:</span> {row.expire_date}</p>
                        </li>
                      ))}  
                    </ul> 
                </div>
            </div>
            <div className="col-12 col-md-8">
                <div className="row d-flex flex-column flex-md-row justify-content-between mb-3">
                    <div className="col-12 col-md-6 col-lg-4 mb-2 mb-md-0">
                      <DialogAddStock />
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <div className="input-group">
                            <span className="input-group-text">
                                <FontAwesomeIcon icon={faMagnifyingGlass} />
                            </span>
                            <input type="text" className="form-control" placeholder="Search" value={search} onChange={handleChangeSearch} aria-label="Username" />
                        </div>
                    </div>
                </div>
                <div className="card">
                    <DataTable columns={columns} data={filteredStock} 
                        customStyles={customStyles}
                        pagination
                        paginationComponentOptions={paginationComponentOptions}
                        highlightOnHover
                        pointerOnHover
                    />
                </div>
            </div>
            
        </div>
      </div>
    </div>
  )
}

export default Medicine_warehouse
