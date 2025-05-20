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
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import Swal from "sweetalert2";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));


export default function DialogAddStock() {
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
    const apiUrl = `${APi_URL_UAT}add_stock_entry`;

    const [formData, setFormData] = useState({});
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    function refreshPage() {
      window.location.reload(false);
    }

    const handleLogout = () => {
      localStorage.clear(); // Clear data from localStorage
      window.location.href = Location ; // Redirect to the main page
    };
    
   
    const [selected, setSelected] = useState(null);
    const [showOptions, setShowOptions] = useState(false);

    const [meditem_id, setMeditem_id] = useState('');

    const handleSelect = (option) => {
        setSelected(option);
        setMeditem_id(option.meditem_id)
        setSearch(option.name);
        setShowOptions(false);
    };
  
    const [search, setSearch] = useState("");
    
    const handleChangesearch = (e) => {
        const medname = e.target.value;
        setSearch(medname);
        setShowOptions(true);
    };

    const [meditem, setMeditem] = useState([]);
    
    const apiUrlMeditem = `${APi_URL_UAT}list_meditem&search=${search}`; // ใส่ API Key ที่นี่
    const listExpire_soon = async (search) => {
        const myHeaders = new Headers();
        myHeaders.append("x-api-key", apiKey);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(
            apiUrlMeditem,requestOptions
        )

        .then((response) => response.json())
        //  .then((result) => console.log(result))
        .then((result) => {
            console.log(result);
            if (result.success) {
            // console.log(result.data);
            setMeditem(result.data);
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
                // Swal.fire({
                // title: "Error!",
                // text:
                //     "ไม่พบข้อมูล",
                // icon: "error",
                // confirmButtonText: "OK",
                // });
            }
            }
        })
        .catch((error) => console.error(error));
    };

    useEffect(() => {
        if ((search)) {
            listExpire_soon(search);
        }
    }, [search]);

    const handleSubmit = (e) => {
      e.preventDefault();
      console.log(formData);
      console.log(meditem_id);
      console.log(clinic_id);

      const myHeaders = new Headers();
      myHeaders.append("X-API-KEY",apiKey);

      const formdata = new FormData();
        formdata.append("meditem_id", meditem_id);
        formdata.append("lot_number", formData.lot_number);
        formdata.append("quantity", formData.quantity);
        formdata.append("expire_date", formData.expire_date);
        formdata.append("clinic_id", clinic_id);

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
          handleClose()
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
    
    return (
      <div>
        <React.Fragment>
          <div className="d-grid gap-2"> 
            <button className="mt-5 mt-md-0 px-2 btn btn-outline-primary" onClick={handleClickOpen}>
              <FontAwesomeIcon icon={faCirclePlus} className="me-2"/>Add Stock
            </button>
          </div>
          <BootstrapDialog
            fullWidth={fullWidth}
            open={open}
            aria-labelledby="customized-dialog-title"
            onClose={handleClose}
          >
            <DialogTitle className="d-flex justify-content-between">
              <p className="mb-0">เพิ่มตัวยาลงคลัง</p>
              <button type="button" className="btn-close" onClick={handleClose} aria-label="Close"></button>
            </DialogTitle>
            <Divider />
            <DialogContent>
              <form onSubmit={handleSubmit}>
                <p className="mb-0 fw-normal col-form-label">ยา : </p>
                <input type="search" className="form-control" value={search} onChange={handleChangesearch} autoFocus/>
                {showOptions && (
                    <ul className="list-group"  
                    style={{
                        overflowY: "auto",
                        position: "absolute",
                        width: "100%",
                        backgroundColor: "#fff",
                        zIndex: 10,
                      }}>
                    {meditem.length > 0 ? (
                        meditem.map((option) => (
                        <li
                            key={option.meditem_id}
                            onClick={() => handleSelect(option)}
                            style={{
                            padding: "8px",
                            cursor: "pointer",
                            borderBottom: "1px solid #eee",
                            }}
                        >
                            {option.name}
                        </li>
                        ))
                    ) : (
                        <li style={{ padding: "8px" }}>ไม่พบข้อมูล</li>
                    )}
                    </ul>
                )}

                {selected && (
                    <div style={{ marginTop: "10px" }}>
                    รายการที่เลือก: <strong>{selected.name}</strong> ({selected.meditem_id})
                    </div>
                )}
                
                <p className="mb-0 fw-normal col-form-label">เลขล็อต : </p>
                <input type="text" className="form-control" name="lot_number" value={formData.lot_number||""} onChange={handleChange} required />
                <p className="mb-0 fw-normal col-form-label">จำนวนยา : </p>
                <input type="text" className="form-control" name="quantity" value={formData.quantity||""} onChange={handleChange} required />
                <p className="mb-0 fw-normal col-form-label">วันหมดอายุ : </p>
                <input type="date" className="form-control" name="expire_date" value={formData.expire_date||""} onChange={handleChange} required />
                <Divider />
                <DialogActions>
                  <button type="submit" className="px-5 py-2 btn btn-primary" onClick={handleClickOpen}>
                    บันทึก
                  </button>
                </DialogActions>
              </form>
            </DialogContent>
          </BootstrapDialog>
          
        </React.Fragment>
      </div>
    
  );
}