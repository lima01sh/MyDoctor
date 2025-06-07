// components/DisplayData.jsx

import "bootstrap/dist/css/bootstrap.min.css";
import './Dis.css';
const PatientDataDisplay = ({ savedData }) => {
  const data = savedData?.data || {};
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

  // ฟังก์ชันสำหรับแปลงชื่อคีย์ให้อ่านง่ายขึ้น
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
      rxay_id: "รหัส X-Ray"
    };
    return fieldNames[field] || field.charAt(0).toUpperCase() + field.slice(1);
  };

  // ฟังก์ชันสำหรับกำหนดสีตามประเภทข้อมูล
  const getSectionColor = (key) => {
    const colors = {
      cc: "#e3f2fd", // ฟ้าอ่อน
      pi: "#f3e5f5", // ม่วงอ่อน
      ph: "#fff3e0", // ส้มอ่อน
      pe: "#e8f5e8", // เขียวอ่อน
      prx: "#fff8e1", // เหลืองอ่อน
      fu: "#fce4ec", // ชมพูอ่อน
      dx: "#ffebee", // แดงอ่อน
      rx: "#e1f5fe", // ฟ้าเข้มอ่อน
      lab_results: "#f1f8e9", // เขียวใสอ่อน
      xr_results: "#fafafa" // เทาอ่อน
    };
    return colors[key] || "#f8f9fa";
  };

  const getSectionBorderColor = (key) => {
    const colors = {
      cc: "#2196f3",
      pi: "#9c27b0",
      ph: "#ff9800",
      pe: "#4caf50",
      prx: "#ffc107",
      fu: "#e91e63",
      dx: "#f44336",
      rx: "#03a9f4",
      lab_results: "#8bc34a",
      xr_results: "#607d8b"
    };
    return colors[key] || "#dee2e6";
  };

  // ฟังก์ชันสำหรับกำหนดไอคอนให้แต่ละหมวด
  const getSectionIcon = (key) => {
    const icons = {
      cc: "bi-clipboard2-pulse",
      pi: "bi-file-medical",
      ph: "bi-journal-text",
      pe: "bi-heart-pulse",
      prx: "bi-scissors",
      fu: "bi-calendar-event",
      dx: "bi-file-earmark-medical",
      rx: "bi-capsule",
      lab_results: "bi-clipboard-data",
      xr_results: "bi-file-image"
    };
    return icons[key] || "bi-file";
  };

  // ฟังก์ชันสำหรับแปลงชื่อหมวดหมู่
  const getSectionTitle = (key) => {
    const titles = {
      cc: "อาการสำคัญ (Chief Complaint)",
      pi: "ประวัติปัจจุบัน (Present Illness)",
      ph: "ประวัติอดีต (Past History)",
      pe: "การตรวจร่างกาย (Physical Examination)",
      prx: "หัตถการ (Procedure)",
      fu: "การนัดหมาย (Follow Up)",
      dx: "การวินิจฉัย (Diagnosis)",
      rx: "การสั่งยา (Prescription)",
      lab_results: "ผลการตรวจทางห้องปฏิบัติการ (Laboratory Results)",
      xr_results: "ผลการตรวจ X-Ray (X-Ray Results)"
    };
    return titles[key] || key.toUpperCase();
  };

  // กรองข้อมูลที่มีการใช้งานจริง
  const validSections = Object.entries(data).filter(([key, items]) =>
    items.some(item => 
      Object.values(item).some(value => 
        value && value !== 'N/A' && value !== ''
      )
    )
  );

  return (
    <div className="medical-report">
      

      <div className="sections-grid">
        {validSections.map(([key, items]) => (
          <div className="section-column" key={key}>
            <div 
              className="section-header"
              style={{
                backgroundColor: getSectionColor(key),
                borderBottomColor: getSectionBorderColor(key),
                color: '#424242'
              }}
            >
              <div className="section-title">
                <i className={`bi ${getSectionIcon(key)} me-2`} style={{ flexShrink: 0 }}></i>
                <span title={getSectionTitle(key)}>
                  {getSectionTitle(key)}
                </span>
              </div>
              <span className="summary-badge">
                {items.length} รายการ
              </span>
            </div>
            
            <div className="section-body">
              {items.length > 0 ? (
                <div className="data-items">
                  {items.map((item, idx) => (
                    <div className="data-item" key={idx}>
                      <div className="item-number">{idx + 1}</div>
                      {Object.entries(item).map(([field, value]) => 
                        field !== "icdOptions" && field !== "clinic_id" ? (
                          <div className="field-row" key={field}>
                            <span className="field-label">{formatFieldName(field)}:</span>
                            <span className="field-value">{value || "ไม่ระบุ"}</span>
                          </div>
                        ) : null
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-data-message">
                  ไม่มีข้อมูลในหมวดนี้
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientDataDisplay;