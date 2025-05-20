import React, { useState, useEffect } from "react";
import { Link,useLocation, useNavigate } from 'react-router-dom';
import { APi_URL_UAT,APi_URL_UPLOAD,Location } from "../../auth/config";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWarehouse,faEllipsis,faMagnifyingGlass,faBook,faListUl } from '@fortawesome/free-solid-svg-icons';
import Swal from "sweetalert2";

import './Medicine_warehouse.css'
import DataTable from "react-data-table-component";
const Withdraw_history = () => {
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
          name: 'รหัสล็อตยา',
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
          name: 'จำนวนยาที่เบิก',
          selector: (row) => row.withdraw_quantity,
          cell: (row) => (
            <div className="mx-auto">
              <p>{row.withdraw_quantity}</p>
            </div>
          ),
          sortable: true,
      },
      {
          id: "4",
          name: 'วัน/เวลาเบิก',
          selector: (row) => row.withdraw_date,
          cell: (row) => (
            <div className="mx-auto">
              <p>{row.withdraw_date}</p>
            </div>
          ),
          sortable: true,
      },
      {
          id: "5",
          name: 'เบิกโดย',
          selector: (row) => row.withdrawn_by,
          cell: (row) => (
            <div className="mx-auto">
              <p>{row.withdrawn_by}</p>
            </div>
          ),
          sortable: true,
      },
      {
          id: "6",
          name: 'โน๊ต',
          selector: (row) => row.note,
          cell: (row) => (
            <div className="mx-auto">
              <p>{row.note}</p>
            </div>
          ),
          sortable: true,
      }
    ];

    // Table
    const [search, setSearch] = useState("");
  
    const handleChangeSearch = (event) => {
      setSearch(event.target.value);
    };
    // check search
    const [data, setData] = useState([]);

    const apiUrl = `${APi_URL_UAT}get_withdraw_history&clinic_id=${clinic_id}`; // ใส่ API Key ที่นี่
  
    const handleLogout = () => {
      localStorage.clear(); // Clear data from localStorage
      window.location.href =Location; // Redirect to the main page
    };

    const listStockHIS = () => {
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

    useEffect(() => {
        listStockHIS();
    }, []);

    const filteredStockHis = data.filter(
        (row) =>
            row.med_name.toLowerCase().includes(search.toLowerCase()) ||
            row.lot_number.toLowerCase().includes(search.toLowerCase()) ||
            row.withdraw_date.toLowerCase().includes(search.toLowerCase()) ||
            row.withdrawn_by.toLowerCase().includes(search.toLowerCase()) ||
            row.note.toLowerCase().includes(search.toLowerCase())
    );


  return (
    <div>
      <div className="p-4 mb-5 ">
        <h2 className="text-start display-6 fw-semibold text-titlepage">ประวัติการเบิกยา</h2>
        <nav aria-label="breadcrumb" className="bg-light rounded-2 px-3 p-2">
            <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                    <Link to="/medicine_warehouse" state={{}} className="breadcrumb-link">
                        <FontAwesomeIcon className="me-1" icon={faWarehouse} />คลังยา
                    </Link>
                </li>
                <li className="breadcrumb-item mb-0 active" aria-current="page"><FontAwesomeIcon className="me-1" icon={faBook} />ประวัติการเบิกยา</li>
            </ol>
        </nav>
        <div className="mt-5">
          <div className="row d-flex flex-column flex-md-row justify-content-between mb-3">
              <div className="col-12 col-md-6 col-lg-4 mb-2 mb-md-0">
                  {/* <DialogAddStock /> */}
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
              <DataTable columns={columns} data={filteredStockHis} 
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
  )
}

export default Withdraw_history
