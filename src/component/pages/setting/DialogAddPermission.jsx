import  React , { useState, useEffect } from 'react';
import { Link,useLocation, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from '@mui/material/DialogTitle';
import { faXmark} from '@fortawesome/free-solid-svg-icons';
import { Divider } from "@mui/material";
import { APi_URL_UAT,Location } from "../../auth/config";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faListUl} from '@fortawesome/free-solid-svg-icons';
import Swal from "sweetalert2";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));


export default function DialogAddPermission() {
    const location = useLocation();
    const { state } = location;
    const user_id = state.user_id;
    const [open, setOpen] = React.useState(false);
    const [fullWidth, setFullWidth] = React.useState(true);
    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    const clinic_id = localStorage.getItem('clinic_id');

    const apiKey = localStorage.getItem("token"); // ใส่ API Key ที่นี่
    const apiUrl_list = `${APi_URL_UAT}menus`;
    const apiUrl = `${APi_URL_UAT}user_menu_permissions`;

    function refreshPage() {
      window.location.reload(false);
    }

    const handleLogout = () => {
      localStorage.clear(); // Clear data from localStorage
      window.location.href = Location; // Redirect to the main page
    };

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
            apiUrl_list,requestOptions
        )
        .then((response) => response.json())
        .then((result) => {
            console.log(result);
            if (result.success) {
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
    
    const [checkedItems, setCheckedItems] = useState({});
    const [items, setItems] = useState([]);

    const handleChange = (event) => {
        const { name, checked } = event.target;
        setCheckedItems({
            ...checkedItems,
            [name]: checked,
        });
    };

    const handleSave = () => {
        const selectedItems = Object.keys(checkedItems).filter(item => checkedItems[item]);
        const newItems = selectedItems.map(item => ({ menu_id: item }));
        setItems(newItems);
        console.log('Selected items:', newItems); 
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-API-KEY",apiKey);

        const raw = JSON.stringify({
            "user_id": user_id,
            "permissions": items
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch(apiUrl, requestOptions)
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
                handleClose()
                Swal.fire({
                    title: "Success!",
                    text: "เพิ่มเมนูเรียบร้อย",
                    icon: "success",
                    confirmButtonText: "OK",
                }).then((data) => {
                    if (data.isConfirmed) {
                    refreshPage();
                    }
                });
            } else {
                handleClose()
                Swal.fire({
                    title: "Error!",
                    text: "เกินข้อผิดพลาด (" + data.message + ")",
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
    
    return (
        <React.Fragment>
            <button className="px-5 btn btn-outline-primary" onClick={handleClickOpen}>
                <FontAwesomeIcon icon={faListUl} className="me-2"/>Add Menu
            </button>
            <BootstrapDialog
                fullWidth={fullWidth}
                open={open}
                aria-labelledby="customized-dialog-title"
                onClose={handleClose}
            >
                <DialogTitle className="d-flex justify-content-between">
                    <p className="mb-0">Add Menu</p>
                    <button type="button" className="btn-close" onClick={handleClose} aria-label="Close"></button>
                </DialogTitle>
                <Divider />
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <p className="mb-0 fw-normal col-form-label pt-0">Menus : </p>
                        {data.map((menu) => (
                        <div key={menu.id} className="mb-2">
                            <label className="form-check-label">
                                <input
                                type="checkbox"
                                name={`${menu.id}`}
                                checked={checkedItems[`${menu.id}`] || false}
                                onChange={handleChange}
                                className="form-check-input"
                                />
                                <span className="ms-2">{menu.id} -{menu.details}</span>
                            </label>
                        </div>
                        ))}
                        
                        <Divider />
                        <DialogActions>
                            <button type="submit" className="px-5 py-2 btn btn-primary mx-auto" onClick={handleSave}>
                                Add Menus
                            </button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </BootstrapDialog>
        </React.Fragment>
    );
}