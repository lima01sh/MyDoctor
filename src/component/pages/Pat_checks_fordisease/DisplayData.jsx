// components/DisplayData.jsx

import "bootstrap/dist/css/bootstrap.min.css";


const PatientDataDisplay = ({ savedData }) => {
  const data = savedData?.data || {};
  if (!savedData || !savedData.data || Object.keys(savedData.data).length === 0) {
    return <div>ไม่พบข้อมูล</div>;
  }
  
  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">การแสดงผลข้อมูล วินิจฉัย</h1>
      <div className="accordion" id="accordionExample">
        {Object.entries(data).map(([key, items], index) => (
          <div className="accordion-item" key={key}>
            <h2 className="accordion-header" id={`heading${index}`}>
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#collapse${index}`}
                aria-expanded="true"
                aria-controls={`collapse${index}`}
              >
                {key.toUpperCase()}
              </button>
            </h2>
            <div
              id={`collapse${index}`}
              className="accordion-collapse collapse"
              aria-labelledby={`heading${index}`}
              data-bs-parent="#accordionExample"
            >
              <div className="accordion-body">
                <div className="row">
                  {items.map((item, idx) => (
                    <div className="col-md-4 mb-3" key={idx}>
                      <div className="card h-100 shadow-sm">
                        <div className="card-body">
                          {Object.entries(item).map(([field, value]) => (
                            <p key={field} className="mb-1">
                              <strong>{field}:</strong> {value || 'N/A'}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientDataDisplay






// import "bootstrap/dist/css/bootstrap.min.css";

// const PatientDataDisplay = ({ savedData }) => {
//   const data = savedData?.data || {}; // ใช้ Optional Chaining เพื่อตรวจสอบข้อมูล

//   // หากไม่มีข้อมูลแสดงข้อความ
//   if (!savedData || !savedData.data || Object.keys(savedData.data).length === 0) {
//     return <div>ไม่พบข้อมูล</div>;
//   }

//   return (
//     <div className="container py-4">
//       <h1 className="text-center mb-4">การแสดงผลข้อมูล วินิจฉัย</h1>
//       <div className="accordion" id="accordionExample">
//         {Object.entries(data).map(([key, items], index) => (
//           <div className="accordion-item" key={key}>
//             <h2 className="accordion-header" id={`heading${index}`}>
//               <button
//                 className="accordion-button"
//                 type="button"
//                 data-bs-toggle="collapse"
//                 data-bs-target={`#collapse${index}`}
//                 aria-expanded="true"
//                 aria-controls={`collapse${index}`}
//               >
//                 {key.toUpperCase()}
//               </button>
//             </h2>
//             <div
//               id={`collapse${index}`}
//               className="accordion-collapse collapse"
//               aria-labelledby={`heading${index}`}
//               data-bs-parent="#accordionExample"
//             >
//               <div className="accordion-body">
//                 <div className="row">
//                   {Array.isArray(items) && items.map((item, idx) => (
//                     <div className="col-md-4 mb-3" key={idx}>
//                       <div className="card h-100 shadow-sm">
//                         <div className="card-body">
//                           {Object.entries(item).map(([field, value]) => (
//                             // ตรวจสอบว่า value เป็น Object หรือไม่
//                             <p key={field} className="mb-1">
//                               <strong>{field}:</strong> 
//                               {typeof value === 'object' ? JSON.stringify(value) : value || 'N/A'}
//                             </p>
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default PatientDataDisplay;
