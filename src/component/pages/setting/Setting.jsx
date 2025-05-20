import React, { useState, useEffect } from "react";
import { Link,useLocation, useNavigate } from 'react-router-dom';
import './setting.css';
import { APi_URL_UAT,APi_URL_UPLOAD,Location } from "../../auth/config";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear,faEllipsis,faMagnifyingGlass,faUserMinus,faListUl } from '@fortawesome/free-solid-svg-icons';
import Swal from "sweetalert2";
import { el } from "date-fns/locale";
import DialogAddUser from'./DialogAddUser';
import DataTable from "react-data-table-component";
const Setting = () => {
  const location = useLocation();
  const { state } = location;
  const clinic_id = localStorage.getItem('clinic_id');

  const apiKey = localStorage.getItem("token"); // ใส่ API Key ที่นี่

  useEffect(() => {
      window.scrollTo(0, 0);
  }, []);

  function refreshPage() {
    window.location.reload(false);
  }
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
        name: 'username',
        selector: (row) => row.username,
        cell: (row) => (
          <div className="">
            <p>{row.username}</p>
          </div>
        ),
        sortable: true,
    },
    {
        id: "2",
        name: 'phone',
        selector: (row) => row.phone,
        cell: (row) => (
          <div className="">
            <p>{row.phone}</p>
          </div>
        ),
        sortable: true,
    },
    {
        id: "3",
        name: 'Active',
        selector: (row) => row.active===1?"Active":"Non-Active",
        cell: (row) => (
          <div className="mx-auto">
            <p>{row.active===1?"Active":"Non-Active"}</p>
          </div>
        ),
        sortable: true,
    },
    {
        id: "4",
        name: 'บทบาท/หน้าที่',
        selector: (row) => row.role,
        cell: (row) => (
          <div className="mx-auto">
            <p>{row.role}</p>
          </div>
        ),
        sortable: true,
    },
    {
        id: "5",
        name: 'Action',
        cell: (row) => (
          <div className="mx-auto">
            {/* <Link to="/" className="btn me-1"
                state={{
                    user_id: row.id,
                }}>
                <FontAwesomeIcon className="fa-lg fa-icon text-titlepage" icon={faEllipsis} />
            </Link> */}
            <button type="button" className="btn" data-bs-toggle="modal" data-bs-target={"#Modal"+row.id}>
              <FontAwesomeIcon className="fa-lg fa-icon text-titlepage" icon={faEllipsis} />
            </button>
            <div className="modal fade" id={"Modal"+row.id} aria-labelledby="ModalLabel" aria-hidden="true">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="ModalLabel">User Account</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    <div className="text-center mt-3 mb-3">
                      <img src={APi_URL_UPLOAD+row.img} className="w-25"/>
                    </div>
                    <p className="mb-0">username : <span className="fw-light">{row.username}</span></p>
                    <p className="mb-0">phone : <span className="fw-light">{row.phone}</span></p>
                    <p className="mb-0">address : <span className="fw-light">{row.address}</span></p>
                    <p className="mb-0">active : <span className="fw-light">{row.active===1?"Active":"Non-Active"}</span></p>
                    <p className="mb-0">role : <span className="fw-light">{row.role}</span></p>
                    <div className="mt-3">
                      <p className="mb-0">Menu List</p>
                      {row.menus.map((menus) => (
                        <div key={menus.id}>
                          <p className="mb-0">- {menus.menu_id}
                            <span className="fw-light ms-2">{menus.details}</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="modal-footer">
                    <div data-bs-dismiss="modal" aria-label="Close">
                      <Link to="/permissioninfo" type="button" className="btn btn-primary" state={{user_id: row.id}}>
                        <FontAwesomeIcon className="me-2" icon={faListUl} />
                        Menu Permissions
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button className="btn "
                onClick={() =>
                  confirmDel(row.id)
                }>
                <FontAwesomeIcon className="fa-lg fa-icon text-danger" icon={faUserMinus} />
            </button>
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

  const apiUrl = `${APi_URL_UAT}list_user&clinic_id=${clinic_id}&user_id=`; // ใส่ API Key ที่นี่

  const handleLogout = () => {
    localStorage.clear(); // Clear data from localStorage
    window.location.href =Location; // Redirect to the main page
  };
  const listUser = () => {
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
        console.log(result.data);
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
      listUser();
  }, []);


  const filteredPatients = data.filter(
  (row) =>
      row.username.toLowerCase().includes(search.toLowerCase()) ||
      row.role.toLowerCase().includes(search.toLowerCase())
  );

  const apiUrl_del = `${APi_URL_UAT}del_user`; // ใส่ API Key ที่นี่

  const confirmDel = (id) => {
    Swal.fire({
      title: "ลบบัญชีผู้ใช้นี้?",
      text: "ยืนยันการลบบัญชีผู้ใช้นี้ หรือไม่!",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // api
        const myHeaders = new Headers();
        myHeaders.append("X-API-KEY", apiKey);

        const formdata = new FormData();
        formdata.append("action", "delete_user");
        formdata.append("id", id);

        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: formdata,
          redirect: "follow"
        };

        fetch(
          apiUrl_del,requestOptions
        )
          .then((response) => response.json())
          .then((result) => {
            if (result.success === true) {
              Swal.fire({
                title: "Deleted!",
                text: "ลบบัญชีผู้ใช้เรียบร้อยแล้ว",
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
              });
              listUser();
            } else {
              Swal.fire({
                title: "Error!",
                text: "เกินข้อผิดพลาด (" + result.response + ")",
                icon: "error",
                confirmButtonText: "OK",
              });
            }
          })
          .catch((error) => console.error(error));
      }
    });
  };

  
  return (
    <div>
      <div className="p-4 mb-5 ">
        <h2 className="text-start display-6 fw-semibold text-titlepage">การตั้งค่าระบบ</h2>
        <nav aria-label="breadcrumb" className="bg-light rounded-2 px-3 p-2">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item mb-0 active" aria-current="page"><FontAwesomeIcon className="me-1" icon={faGear} />การตั้งค่าระบบ</li>
          </ol>
        </nav>
        <div className="mt-3">
          <div className="mt-3">
            <div className="row d-flex flex-column flex-md-row justify-content-between mt-4 mb-3">
              <div className="col-12 col-md-6 col-lg-4 mb-2 mb-md-0">
                <DialogAddUser />
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
              <DataTable columns={columns} data={filteredPatients} 
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

export default Setting
