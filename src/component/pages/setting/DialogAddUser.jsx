import  React , { useState, useEffect } from 'react';
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
import { faUserPlus} from '@fortawesome/free-solid-svg-icons';
import Swal from "sweetalert2";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));


export default function DialogAddUser() {
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
    const apiUrl = `${APi_URL_UAT}add_users`;

    const [formData, setFormData] = useState({});
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const [picture, setPicture] = useState(null);
    const [File, setFile] = useState(null);
    const onChangePicture = (e) => {
      setFile(e.target.files[0]);
      setPicture(URL.createObjectURL(e.target.files[0]));
    };

    function refreshPage() {
      window.location.reload(false);
    }

    const handleLogout = () => {
      localStorage.clear(); // Clear data from localStorage
      window.location.href = Location ; // Redirect to the main page
    };

    const rolenames = [
      'doctor',
      'nurse',
      'pharmacist',
      'Officer',
      'ADMIN',
      'sp_admin',
    ];

    const handleSubmit = (e) => {
      e.preventDefault();
      // console.log(formData);
      // console.log(File);

      const myHeaders = new Headers();
      myHeaders.append("X-API-KEY",apiKey);

      const formdata = new FormData();
      formdata.append("username", formData.username);
      formdata.append("password", formData.password);
      formdata.append("phone", formData.phone);
      formdata.append("address", formData.address);
      formdata.append("active", formData.active);
      formdata.append("role", formData.role);
      formdata.append("clinic_id", clinic_id);
      formdata.append("img",File);

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formdata,
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
            text: "เพิ่มบัญชีผู้ใช้เรียบร้อย",
            icon: "success",
            confirmButtonText: "OK",
          }).then((data) => {
            if (data.isConfirmed) {
              refreshPage();
            }
          });
          //
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
        <FontAwesomeIcon icon={faUserPlus} className="me-2"/>Add User
      </button>
      <BootstrapDialog
        fullWidth={fullWidth}
        open={open}
        aria-labelledby="customized-dialog-title"
        onClose={handleClose}
      >
        <DialogTitle className="d-flex justify-content-between">
          <p className="mb-0">เพิ่มข้อมูลผู้ใช้งาน</p>
          <button type="button" className="btn-close" onClick={handleClose} aria-label="Close"></button>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-12 col-md-6">
                <p className="mb-0 fw-normal col-form-label">username : </p>
                <input type="text" className="form-control" name="username" value={formData.username||""} onChange={handleChange} required />
              </div>
              <div className="col-12 col-md-6">
                <p className="mb-0 fw-normal col-form-label">password : </p>
                <input type="text" className="form-control" name="password" value={formData.password||""} onChange={handleChange} required />
              </div>
            </div>
            <p className="mb-0 fw-normal col-form-label">โทรศัพท์ : </p>
            <input type="text" className="form-control" name="phone" value={formData.phone||""} onChange={handleChange} required />
            <p className="mb-0 fw-normal col-form-label">ที่อยู่ : </p>
            <input type="text" className="form-control" name="address" value={formData.address||""} onChange={handleChange} required />
            <p className="mb-0 fw-normal col-form-label">สถานะใช้งาน : </p>
            <select
            className="form-select"
            value={formData.active}
            onChange={handleChange} required
            name="active"
            >
              <option value="">สถานะใช้งาน</option>
              <option value="1">active</option>
              <option value="0">Non-active</option>
            </select>
            <p className="mb-0 fw-normal col-form-label">บทบาท/หน้าที่ : </p>
            <select
            className="form-select"
            value={formData.role}
            onChange={handleChange} required
            name="role"
            >
              <option value="">บทบาท/หน้าที่</option>
              {rolenames.map((rolename,index) => (
              <option key={index} value={rolename}>{rolename}</option>
              ))}
            </select>
            <p className="mb-0 fw-normal col-form-label">รูปภาพ : </p>
            <div className="input-group mb-3">
              <input
                type="file"
                className="form-control"
                required
                onChange={onChangePicture}
                name="img"
              />
            </div>
            <div className="text-center mt-3 mb-3">
              <img src={picture && picture} className="w-25"/>
            </div>
            <Divider />
            <DialogActions>
              <button type="submit" className="px-5 py-2 btn btn-primary" onClick={handleClickOpen}>
                Save
              </button>
            </DialogActions>
          </form>
        </DialogContent>
      </BootstrapDialog>
      
    </React.Fragment>
  );
}