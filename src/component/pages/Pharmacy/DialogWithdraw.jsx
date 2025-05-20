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


export default function DialogWithdraw() {
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
    
    const [data, setData] = useState([]);
    const [selected, setSelected] = useState(null);
    const [showOptions, setShowOptions] = useState(false);
    const [search, setSearch] = useState("");

    const [stock_id, setStock_id] = useState('');

    const handleSelect = (option) => {
        setSelected(option);
        setStock_id(option.id)
        setSearch(option.med_name);
        console.log(option.id);
        setShowOptions(false);
    };

    const filteredOptions = data.filter((opt) =>
      opt.med_name.toLowerCase().includes(search.toLowerCase())
    );
  
    const handleChangesearch = (e) => {
        const medname = e.target.value;
        setSearch(medname);
        setSelected(data);
        setShowOptions(true);
    };
    
    const apiUrl_list = `${APi_URL_UAT}list_stock&clinic_id=${clinic_id}`; // ใส่ API Key ที่นี่
    const listStock = () => {
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

    const apiUrl = `${APi_URL_UAT}withdraw_stock`;

    const handleSubmit = (e) => {
      e.preventDefault();
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
          });
          //
        } else {
          handleClose()
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
    
    useEffect(() => {
      listStock();
    }, []);


    return (
      <div>
        <React.Fragment>
          <div className="d-grid gap-2"> 
            <button className="mt-5 mt-md-0 px-2 btn btn-outline-primary" onClick={handleClickOpen}>
              <FontAwesomeIcon icon={faCirclePlus} className="me-2"/>เบิกยาจากคลังยา
            </button>
          </div>
          <BootstrapDialog
            fullWidth={fullWidth}
            open={open}
            aria-labelledby="customized-dialog-title"
            onClose={handleClose}
          >
            <DialogTitle className="d-flex justify-content-between">
              <p className="mb-0">เบิกยาจากคลังยา</p>
              <button type="button" className="btn-close" onClick={handleClose} aria-label="Close"></button>
            </DialogTitle>
            <Divider />
            <DialogContent>
              <form onSubmit={handleSubmit}>
                <p className="mb-0 fw-normal col-form-label">ยาจากคลังยา : </p>
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
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => (
                        <li
                            key={option.id}
                            onClick={() => handleSelect(option)}
                            style={{
                            padding: "8px",
                            cursor: "pointer",
                            borderBottom: "1px solid #eee",
                            }}
                        >
                            Lot No : {option.lot_number} - {option.med_name} <span className={option.quantity > 10 ? "text-success" : "text-danger"}>( {option.quantity} )</span>
                        </li>
                        ))
                    ) : (
                        <li style={{ padding: "8px" }}>ไม่พบข้อมูล</li>
                    )}
                    </ul>
                )}

                {selected && (
                    <div style={{ marginTop: "10px" }}>
                    รายการที่เลือก: Lot No : {selected.lot_number}  - <strong>{selected.med_name}</strong> <span className={selected.quantity > 10 ? "text-success" : "text-danger"}>( {selected.quantity} )</span>
                    </div>
                )}
                
                <p className="mb-0 fw-normal col-form-label">จำนวนยาที่เบิก : </p>
                <input type="number" className="form-control" min="1" name="quantity" value={formData.quantity||""} onChange={handleChange} required />
                <p className="mb-0 fw-normal col-form-label">เบิกโดย : </p>
                <input type="text" className="form-control" name="withdrawn_by" value={formData.withdrawn_by||""} onChange={handleChange} required />
                <p className="mb-0 fw-normal col-form-label">โน๊ต : </p>
                <input type="text" className="form-control" name="note" value={formData.note||""} onChange={handleChange} required />

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