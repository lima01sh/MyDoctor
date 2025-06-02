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
    const history_id = treatmentData.treatmentData.treatment.history_id;
    const apiKey = localStorage.getItem("token"); // ใส่ API Key ที่นี่
    
    // console.log(history_id)

  
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
    const [rxTotal, setRxTotal] = useState(0);
    const [labTotal, setLabTotal] = useState(0);
    const [xrTotal, setXrTotal] = useState(0);
    const [prxTotal, setPrxTotal] = useState(0);
    const [peTotal, setPeTotal] = useState(0);
    const [prxXrTotal, setPrxXrTotal] = useState(0); // <-- ใหม่

    useEffect(() => {
      const pushData = (list, key1, key2) => {
        return list.map((item) => ({
          item_name: item[key1] || "",
          item_price: item[key2] || "0",
        }));
      };
    
      const getTotal = (list, key = "total_price") => {
        return list.reduce((sum, item) => {
          const val = parseFloat(item[key]?.toString().replace(/,/g, "")) || 0;
          return sum + val;
        }, 0);
      };
    
      const rx = treatmentData?.treatmentData?.rx || [];
      const lab = treatmentData?.treatmentData?.lab_results || [];
      const xr = treatmentData?.treatmentData?.xr_results || [];
      const prx = treatmentData?.treatmentData?.prx || [];
      const pe = treatmentData?.treatmentData?.pe || [];
    
      const rxSum = getTotal(rx);
      const labSum = getTotal(lab);
      const peSum = getTotal(pe);
      const xrSum = getTotal(xr);
      const prxSum = getTotal(prx);
      const prxXrSum = xrSum + prxSum;
    
      setRxTotal(rxSum);
      setLabTotal(labSum);
      setPeTotal(peSum);
      setXrTotal(xrSum);
      setPrxTotal(prxSum);
      setPrxXrTotal(prxXrSum);
    
      // สร้างเฉพาะ summaryInputs
      const summaryInputs = [
        {
          item_name: "ค่าตรวจทางห้องปฏิบัติการ",
          item_price: labSum.toString(),
        },
        {
          item_name: "ค่าตรวจอื่นๆ",
          item_price: prxXrSum.toString(),
        },
        {
          item_name: "ค่ายา",
          item_price: rxSum.toString(),
        },
        {
          item_name: "ค่าบริการทางการแพทย์",
          item_price: peSum.toString(),
        },
      ];
    
      setInputs(summaryInputs); // ❗️ใช้เฉพาะ summaryInputs เท่านั้น
    }, [treatmentData]);
    
    useEffect(() => {
      const totalSum = inputs.reduce((sum, item) => {
        const price = parseFloat(item.item_price?.toString().replace(/,/g, "")) || 0;
        return sum + price;
      }, 0);
      setTotal(totalSum);
    }, [inputs]);

    const [certCounts, setCertCounts] = useState({});

    const addCertForCar = (nameCert, price) => {
      const itemName = `ค่าบริการอื่นๆ (${nameCert})`;
      const currentCount = certCounts[nameCert] || 0;
    
      // กรณี price === 0 ไม่ให้เพิ่มซ้ำ
      if (price === 0 && currentCount > 0) return;
    
      const newCount = currentCount + 1;
      const newSum = newCount * price;
    
      // อัปเดต certCounts
      setCertCounts((prev) => ({
        ...prev,
        [nameCert]: newCount,
      }));
    
      // อัปเดต inputs
      setInputs((prevInputs) => {
        const existingIndex = prevInputs.findIndex((item) => item.item_name === itemName);
        if (existingIndex !== -1) {
          const updated = [...prevInputs];
          updated[existingIndex].item_price = newSum.toString();
          return updated;
        } else {
          return [
            ...prevInputs,
            { item_name: itemName, item_price: price.toString() },
          ];
        }
      });
    };
    
    // แก้ไข input
    const handleInputChange = (index, field, value) => {
      const updatedInputs = [...inputs];
      updatedInputs[index][field] = value;
      setInputs(updatedInputs);
    };
  
    // เพิ่ม input ใหม่
    const addInput = () => {
      setInputs([...inputs, { item_name: "", item_price: "" }]);
    };
  
    // ลบรายการออก
    const removeInput = (index) => {
      setInputs((prevInputs) => {
        const itemToRemove = prevInputs[index];

        const updatedInputs = prevInputs.filter((_, i) => i !== index);

        // เช็คถ้าเป็นค่าบริการอื่นๆ จาก cert
        if (itemToRemove.item_name?.startsWith("ค่าบริการอื่นๆ ")) {
          const nameCert = itemToRemove.item_name.replace("ค่าบริการอื่นๆ ", "");

          // รีเซ็ต certCounts เฉพาะตัวนี้
          setCertCounts((prev) => {
            const updated = { ...prev };
            delete updated[nameCert];
            return updated;
          });
        }

        return updatedInputs;
      });
    };

    const apiUrl = `${APi_URL_UAT}add_receipts`;

    const handleSubmit = (e) => {
      e.preventDefault();
      console.log(inputs);

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("X-API-KEY",apiKey);

      const raw = JSON.stringify({
        "clinic_id": clinic_id,
        "history_id": history_id,
        "items": inputs
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
          }).then(() => {
            refreshPage();
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

    const certi = [
      {
        nameCert:"ใบรับรองแพทย์",
        price: 0
      },
      {
        nameCert:"ใบรับรองแพทย์ (สำหรับใบอนุญาตขับรถ)",
        price: 100
      }
    ]


    return (
      <div>
        <React.Fragment>
          <div className="d-grid gap-2"> 
            <button className={`btn btn-outline-success text-start`} onClick={handleClickOpen}>
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
              <div className="d-flex justify-content-center mb-3">
                {certi.map((cert, index) => (
                    <button key={index} className="btn btn-secondary btn-sm mx-1" onClick={() => addCertForCar(cert.nameCert, cert.price)}>+ {cert.nameCert}</button>
                ))}
              </div>
              
              
              <form onSubmit={handleSubmit}>
                {inputs.map((inputI, index) => (
                  <div key={index} className="input-group mb-2">
                    <input
                      type="text"
                      className="form-control w-50"
                      value={inputI.item_name || ""}
                      onChange={(e) => handleInputChange(index, "item_name", e.target.value)}
                    />
                    <span className="input-group-text">฿</span>
                    <input
                      type="number"
                      className="form-control"
                      value={inputI.item_price || ""}
                      onChange={(e) => handleInputChange(index, "item_price", e.target.value)}
                    />
                    <button className="btn btn-danger" onClick={() => removeInput(index)}>ลบ</button>
                  </div>
                ))}
                <button className="btn btn-secondary mb-3 " onClick={addInput}>+ เพิ่มรายการ</button>
                <Divider />
                <div className="input-group mb-4 mt-4">
                  <span className="input-group-text w-50">รวมทั้งหมด</span>
                  <span className="input-group-text">฿</span>
                  <input type="number" className="form-control" value={total} />
                </div>
                 
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