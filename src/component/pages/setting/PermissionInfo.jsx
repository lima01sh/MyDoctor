import React, { useState, useEffect } from "react";
import { Link,useLocation, useNavigate } from 'react-router-dom';
import './setting.css';
import { APi_URL_UAT,APi_URL_UPLOAD ,Location} from "../../auth/config";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear,faListUl,faEllipsis,faCircleMinus } from '@fortawesome/free-solid-svg-icons';
import Swal from "sweetalert2";
import { el } from "date-fns/locale";
import DialogAddUser from'./DialogAddUser';
import DataTable from "react-data-table-component";
import DialogAddPermission from "./DialogAddPermission";


const PermissionInfo = () => {
    const location = useLocation();
    const { state } = location;
    const clinic_id = localStorage.getItem('clinic_id');
    const user_id = state.user_id;

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
                backgroundColor: '#CCE5FF'
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
            name: 'รหัสเมนู',
            selector: (row) => row.menu_id,
            cell: (row) => (
                <div className="">
                <p>{row.menu_id}</p>
                </div>
            ),
            sortable: true,
        },
        {
            id: "2",
            name: 'รายละเอียด',
            selector: (row) => row.details,
            cell: (row) => (
                <div className="">
                <p>{row.details}</p>
                </div>
            ),
            sortable: true,
        },
        {
            id: "3",
            name: 'Action',
            cell: (row) => (
                <div className="mx-auto">
                    <button className="btn"
                        onClick={() =>
                        confirmDel(row.id)
                        }>
                        <FontAwesomeIcon className="fa-lg fa-icon text-danger" icon={faCircleMinus} />
                    </button>
                </div>
            ),
            sortable: true,
        },
    ];
    // Table

    const apiKey = localStorage.getItem("token"); // ใส่ API Key ที่นี่
    const apiUrl = `${APi_URL_UAT}list_user&clinic_id=${clinic_id}&user_id=${user_id}`; // ใส่ API Key ที่นี่

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleLogout = () => {
        localStorage.clear(); // Clear data from localStorage
        window.location.href = Location; // Redirect to the main page
    };

    const [search, setSearch] = useState("");
    const [data, setData] = useState([]);
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
        .then((result) => {
            console.log(result);
            if (result.success) {
                setData(result.data[0].menus);
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

    const filterData = data.filter(
    (row) =>
        row.details.toLowerCase().includes(search.toLowerCase()) 
    );

    const apiUrl_del = `${APi_URL_UAT}del_user`; // ใส่ API Key ที่นี่

    const confirmDel = (id) => {
        Swal.fire({
            title: "ลบเมนูนี้?",
            text: "ยืนยันการลบเมนูนี้ หรือไม่!",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            const menu_per_id=id;
            if (result.isConfirmed) {
            // api
            const myHeaders = new Headers();
            myHeaders.append("X-API-KEY", apiKey);

            const formdata = new FormData();
            formdata.append("action", "delete_menu");
            formdata.append("id", menu_per_id);

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
                    text: "ลบเมนูเรียบร้อยแล้ว",
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
                    <li className="breadcrumb-item">
                        <Link to="/setting" className="breadcrumb-link"><FontAwesomeIcon className="me-1" icon={faGear} />การตั้งค่าระบบ</Link>
                    </li>
                    <li className="breadcrumb-item mb-0 active" aria-current="page"><FontAwesomeIcon className="me-1" icon={faListUl} />Menu Permissions</li>
                </ol>
            </nav>
            <div className="mt-3">
                <DialogAddPermission />
                <div className="mt-3 card">
                    <DataTable columns={columns} data={filterData} 
                        customStyles={customStyles}
                        pagination
                        paginationComponentOptions={paginationComponentOptions}
                        highlightOnHover
		                pointerOnHover
                        keyField="id"
                        />
                </div>
            </div>
        </div>
    </div>
  )
}

export default PermissionInfo
