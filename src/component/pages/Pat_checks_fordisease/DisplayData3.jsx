import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect } from "react";

const PatientDataDisplay = ({ savedData }) => {
  const data = savedData?.data || {};

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      :root {
        --honeydew: #eff8e2;
        --timberwolf: #cecfc7;
        --rose-quartz: #ada8b6;
        --russian-violet: #23022e;
        --tekhelet: #573280;
      }

      body {
        font-family: 'Prompt', sans-serif;
        background-color: var(--honeydew);
        color: var(--russian-violet);
      }

      .main-heading {
        background: linear-gradient(to right, var(--tekhelet), var(--rose-quartz));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-size: 2rem;
        font-weight: 700;
        text-align: center;
        margin-bottom: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
      }

      .section-wrapper {
        background-color: var(--timberwolf);
        border-left: 8px solid var(--rose-quartz);
        border-radius: 14px;
        padding: 1.5rem;
        margin-bottom: 2rem;
        box-shadow: 0 5px 12px rgba(35, 2, 46, 0.15);
      }

      .section-title {
        font-size: 1.4rem;
        font-weight: 600;
        color: var(--tekhelet);
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 1rem;
      }

      .section-title i {
        font-size: 1.6rem;
        color: var(--russian-violet);
      }

      .card.gradient {
        background: linear-gradient(135deg, var(--honeydew), #fff);
        border: 1px solid var(--rose-quartz);
        border-radius: 1rem;
        box-shadow: 0 4px 10px rgba(87, 50, 128, 0.1);
        transition: all 0.3s ease-in-out;
      }

      .card.gradient:hover {
        transform: scale(1.02);
        box-shadow: 0 8px 20px rgba(87, 50, 128, 0.25);
      }

      .card-title {
        background-color: var(--tekhelet);
        color: #fff;
        font-weight: 600;
        font-size: 1rem;
        padding: 0.75rem 1rem;
        border-radius: 1rem 1rem 0 0;
      }

      .card-body {
        background-color: #ffffff;
        padding: 1rem;
        border-radius: 0 0 1rem 1rem;
      }

      .field-row {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        margin-bottom: 0.6rem;
        flex-wrap: wrap;
      }

      .field-row i {
        font-size: 1rem;
        color: var(--tekhelet);
        margin-top: 2px;
      }

      .field-label {
        font-weight: 600;
        color: var(--russian-violet);
        min-width: 120px;
      }

      .field-value {
        color: #424242;
        font-size: 0.9rem;
        flex: 1;
      }

      .alert.custom {
        background-color: var(--rose-quartz);
        color: #fff;
        border: none;
        padding: 0.75rem 1.25rem;
        font-size: 1rem;
        margin-top: 2rem;
        border-radius: 8px;
        max-width: 500px;
        margin-left: auto;
        margin-right: auto;
        text-align: center;
        box-shadow: 0 4px 8px rgba(35, 2, 46, 0.2);
      }

      @media (max-width: 576px) {
        .card-title {
          font-size: 0.95rem;
        }
        .field-label {
          min-width: 100px;
          font-size: 0.85rem;
        }
        .field-value {
          font-size: 0.85rem;
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  if (!savedData || !savedData.data || Object.keys(savedData.data).length === 0) {
    return (
      <div className="text-center py-5">
        <div className="alert alert-info d-flex align-items-center justify-content-center">
          <i className="bi bi-info-circle me-2"></i>
          ไม่พบข้อมูล
        </div>
      </div>
    );
  }

  const iconMap = {
    hn_patient_id: "bi-person-badge",
    description: "bi-card-text",
    treatment_history_id: "bi-journal-medical",
    clinic_id: "bi-building",
    price: "bi-currency-dollar",
    procedure_name: "bi-scissors",
    quantity: "bi-basket",
    prcd_id: "bi-list-check",
    appointment_date: "bi-calendar-event",
    details: "bi-file-text",
    date: "bi-calendar-date",
    time: "bi-clock",
    code: "bi-file-earmark-medical",
    icd_id: "bi-clipboard-data",
    medicine_name: "bi-capsule",
    dosage: "bi-file-medical",
    usage_instruction: "bi-info-circle",
    meditem_id: "bi-box-seam",
    test_name: "bi-eyeglasses",
    result_value: "bi-graph-up",
    status_sen: "bi-activity",
    lab_data_id: "bi-bezier",
    rxay_id: "bi-x-diamond",
  };

  const formatFieldName = (field) => {
    const fieldNames = {
      hn_patient_id: "รหัสผู้ป่วย",
      description: "รายละเอียด",
      treatment_history_id: "รหัสประวัติการรักษา",
      clinic_id: "รหัสคลินิก",
      price: "ราคา (บาท)",
      procedure_name: "ชื่อหัตถการ",
      quantity: "จำนวน",
      prcd_id: "รหัสหัตถการ",
      appointment_date: "วันที่นัด",
      details: "รายละเอียดการนัด",
      date: "วันที่",
      time: "เวลา",
      code: "รหัสโรค (ICD-10)",
      icd_id: "รหัส ICD",
      medicine_name: "ชื่อยา",
      dosage: "รหัสวิธีใช้",
      usage_instruction: "วิธีการใช้ยา",
      meditem_id: "รหัสยา",
      test_name: "ชื่อการตรวจ",
      result_value: "ผลการตรวจ",
      status_sen: "สถานะ LAB",
      lab_data_id: "รหัสข้อมูล LAB",
      rxay_id: "รหัส X-Ray",
    };
    return fieldNames[field] || field.charAt(0).toUpperCase() + field.slice(1);
  };

  const sectionNames = {
    cc: "อาการสำคัญ (CC)",
    pi: "ประวัติปัจจุบัน (PI)",
    ph: "ประวัติอดีต (PH)",
    pe: "การตรวจร่างกาย (PE)",
    prx: "หัตถการ (PRX)",
    fu: "นัดหมาย (FU)",
    dx: "การวินิจฉัย (DX)",
    rx: "สั่งยา (RX)",
    lab_results: "ผลแล็บ (Lab Results)",
    xr_results: "ผล X-Ray (XR Results)",
  };

  return (
    <div className="container-fluid">
      <div className="main-heading">
        <i className="bi bi-heart-pulse-fill"></i>
        การแสดงผลข้อมูลวินิจฉัย
      </div>

      {Object.entries(data).map(([key, items]) => (
        <div key={key} className="section-wrapper">
          <h4 className="section-title">
            <i className="bi bi-folder2-open"></i>
            {sectionNames[key] || key.toUpperCase()} ({items.length} รายการ)
          </h4>
          <div className="row">
            {items.map((item, idx) => (
              <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 mb-3" key={idx}>
                <div className="card gradient h-100">
                  <div className="card-title">📄 รายการที่ {idx + 1}</div>
                  <div className="card-body">
                    {Object.entries(item).map(([field, value]) =>
                      field !== "icdOptions" && field !== "clinic_id" ? (
                        <div className="field-row" key={field}>
                          <i className={`bi ${iconMap[field] || "bi-info-circle"}`}></i>
                          <div className="field-label">{formatFieldName(field)}:</div>
                          <div className="field-value">{value || "N/A"}</div>
                        </div>
                      ) : null
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="text-center">
        <div className="alert custom" role="alert">
          <i className="bi bi-info-circle-fill me-2"></i>
          กรุณาตรวจสอบความถูกต้องของข้อมูลก่อนยืนยันการส่งข้อมูล
        </div>
      </div>
    </div>
  );
};

export default PatientDataDisplay;
