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
import { faFileInvoice } from '@fortawesome/free-solid-svg-icons';
import Swal from "sweetalert2";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));


export default function DialogCreateRec(treatmentData) {
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
    
    console.log(treatmentData.treatmentData.pe)

  
    function refreshPage() {
      window.location.reload(false);
    }

    const handleLogout = () => {
      localStorage.clear(); // Clear data from localStorage
      window.location.href = Location ; // Redirect to the main page
    };

    // FORM
    const [inputs, setInputs] = useState([]);
    const [total, setTotal] = useState(0);
  
    // โหลดข้อมูลครั้งแรกจาก treatmentData
    const FatchData = (treatmentData) => {
      let allInputs = [];
  
      const pushData = (list, key1, key2) => {
        return list.map((item) => ({
          value1: item[key1] || "",
          value2: item[key2] || "0",
        }));
      };
  
      if (treatmentData?.treatmentData?.rx?.length > 0) {
        allInputs = allInputs.concat(pushData(treatmentData.treatmentData.rx, "medicine_name", "total_price"));
      }
  
      if (treatmentData?.treatmentData?.lab_results?.length > 0) {
        allInputs = allInputs.concat(pushData(treatmentData.treatmentData.lab_results, "test_name", "total_price"));
      }
  
      if (treatmentData?.treatmentData?.xr_results?.length > 0) {
        allInputs = allInputs.concat(pushData(treatmentData.treatmentData.xr_results, "description", "total_price"));
      }
  
      if (treatmentData?.treatmentData?.prx?.length > 0) {
        allInputs = allInputs.concat(pushData(treatmentData.treatmentData.prx, "procedure_name", "total_price"));
      }
  
      if (treatmentData?.treatmentData?.pe?.length > 0) {
        allInputs = allInputs.concat(pushData(treatmentData.treatmentData.pe, "description", "total_price"));
      }
  
      setInputs(allInputs);
    }

    useEffect(() => {
      FatchData(treatmentData);
    }, [treatmentData]);
  
    // คำนวณยอดรวมทุกครั้งที่ inputs เปลี่ยน
    useEffect(() => {
      const totalSum = inputs.reduce((sum, item) => {
        const price = parseFloat(item.value2.toString().replace(/,/g, "")) || 0;
        return sum + price;
      }, 0);
      setTotal(totalSum);
    }, [inputs]);
  
    // แก้ไข input
    const handleInputChange = (index, field, value) => {
      const updatedInputs = [...inputs];
      updatedInputs[index][field] = value;
      setInputs(updatedInputs);
    };
  
    // เพิ่ม input ใหม่
    const addInput = () => {
      setInputs([...inputs, { value1: "", value2: "0" }]);
    };
  
    // ลบ input
    const removeInput = (index) => {
      const updatedInputs = inputs.filter((_, i) => i !== index);
      setInputs(updatedInputs);
    };
  


    return (
      <div>
        <React.Fragment>
          <div className="d-grid gap-2"> 
            <button className="btn btn-outline-success" onClick={handleClickOpen}>
              <FontAwesomeIcon className="me-2 fa-lg fa-icon" icon={faFileInvoice} /> สร้างใบเสร็จ
            </button>
          </div>
          <BootstrapDialog
            fullWidth={fullWidth}
            open={open}
            aria-labelledby="customized-dialog-title"
            onClose={handleClose}
          >
            <DialogTitle className="d-flex justify-content-between">
              <p className="mb-0">สร้างใบเสร็จ</p>
              <button type="button" className="btn-close" onClick={handleClose} aria-label="Close"></button>
            </DialogTitle>
            <Divider />
            <DialogContent>
              <div>
              {inputs.map((input, index) => (
                  <div key={index} className="input-group mb-2">
                    <input
                      type="text"
                      className="form-control"
                      value={input.value1}
                      onChange={(e) => handleInputChange(index, "value1", e.target.value)}
                    />
                    <span className="input-group-text">฿</span>
                    <input
                      type="number"
                      className="form-control"
                      value={input.value2}
                      onChange={(e) => handleInputChange(index, "value2", e.target.value)}
                    />
                    <button className="btn btn-danger" onClick={() => removeInput(index)}>ลบ</button>
                  </div>
                ))}
                <div className="input-group mb-3">
                            <span className="input-group-text w-50">รวมทั้งหมด</span>
                            <span className="input-group-text">฿</span>
                            <input type="number" className="form-control" value={total} />
                          </div>
                <button className="btn btn-secondary mb-3" onClick={addInput}>+ เพิ่มรายการ</button>

                

              </div>
              
              {/* <form onSubmit={handleSubmit}>
                <p className="mb-0 fw-normal col-form-label">รายการยา : </p>
                {treatmentData.treatmentData.rx&&
                  treatmentData.treatmentData.rx.map((rx, index) => (
                    <div key={index} className="input-group mb-1">
                      <input type="text" className="form-control w-50" value={formData.item_name||rx.medicine_name} onChange={handleChange} />
                      <span className="input-group-text">฿</span>
                      <input type="text" className="form-control" value={formData.item_price||rx.total_price} onChange={handleChange} />
                  </div>
                ))}
                <p className="mb-0 fw-normal col-form-label">รายการ Lab : </p>
                {treatmentData.treatmentData.lab_results&&
                  treatmentData.treatmentData.lab_results.map((lab_results, index) => (
                    <div key={index} className="input-group mb-1">
                      <input type="text" className="form-control w-50" value={formData.item_name||lab_results.test_name} onChange={handleChange} />
                      <span className="input-group-text">฿</span>
                      <input type="text" className="form-control" value={formData.item_price||lab_results.total_price} onChange={handleChange} />
                  </div>
                ))}
                <p className="mb-0 fw-normal col-form-label">รายการ X-ray : </p>
                {treatmentData.treatmentData.xr_results&&
                  treatmentData.treatmentData.xr_results.map((xr_results, index) => (
                    <div key={index} className="input-group mb-1">
                      <input type="text" className="form-control w-50" value={formData.item_name||xr_results.description} onChange={handleChange} />
                      <span className="input-group-text">฿</span>
                      <input type="text" className="form-control" value={formData.item_price||xr_results.total_price} onChange={handleChange} />
                  </div>
                ))}
                <p className="mb-0 fw-normal col-form-label">รายการ Prx : </p>
                {treatmentData.treatmentData.prx&&
                  treatmentData.treatmentData.prx.map((prx, index) => (
                    <div key={index} className="input-group mb-1">
                      <input type="text" className="form-control w-50" value={formData.item_name||prx.procedure_name} onChange={handleChange} />
                      <span className="input-group-text">฿</span>
                      <input type="text" className="form-control" value={formData.item_price||prx.total_price} onChange={handleChange} />
                  </div>
                ))}
                <p className="mb-0 fw-normal col-form-label">รายการ Pe : </p>
                {treatmentData.treatmentData.pe&&
                  treatmentData.treatmentData.pe.map((pe, index) => (
                    <div key={index} className="input-group mb-1">
                      <input type="text" className="form-control w-50" value={formData.item_name||pe.description} onChange={handleChange} />
                      <span className="input-group-text">฿</span>
                      <input type="text" className="form-control" value={formData.item_price||pe.total_price} onChange={handleChange} />
                  </div>
                ))}
               

                <Divider />
                <DialogActions>
                  <button type="submit" className="px-5 py-2 btn btn-primary" onClick={handleClickOpen}>
                    บันทึก
                  </button>
                </DialogActions>
              </form> */}
            </DialogContent>
          </BootstrapDialog>
          
        </React.Fragment>
      </div>
    
  );
}