
import logoClinic from '../../img/logoClinic.png';
import bg from '../../img/clinic_bg-01.png';

import "./home.css";
function Home() {
  // const clinic_number = localStorage.getItem('clinic_number');
  // const clinic_name = localStorage.getItem('clinic_name');
  // const address = localStorage.getItem('address');
  // const phone = localStorage.getItem('phone');
  // const doctor_name = localStorage.getItem('doctor_name');
   const user =  JSON.parse(localStorage.getItem("user")); // Get user data from localStorage
   const data_clinic =   user.data_clinic[0]; // Get user data from localStorage
    return (
      <div>
        {/* Form */}
        <div className="p-4 mb-5 text-center">
          <h2 className="text-start display-6 fw-semibold text-bluegaylight"><span className="fw-normal text-bluegay">ยินดีต้อนรับสู่...</span> ระบบจัดการคลินิก</h2>
          {/* <div className="bg">
            <img src={bg} alt="" className="w-100" />
          </div> */}
          <div className="position-relative">
            <div className="bg">
              <img src={bg} alt="" className="w-100" />
            </div>    
            <div className="position-absolute top-0 end-0 d-none d-sm-block">
                <p className="h4 fw-normal text-bluegay mt-3 me-3">{data_clinic.clinic_number}</p>
            </div>
            <div className=" position-absolute top-50 start-50 translate-middle">
                <p className="h1 fw-bold text-bluegaylight">{data_clinic.clinic_name}</p>
                <p className="mb-0 fw-normal text-bluegay">ที่อยู่: {data_clinic.address}</p>
                <p className="fw-normal text-bluegay">โทร. {data_clinic.phone}</p>
                <p className="mb-0 fw-normal text-bluegay">แพทย์ประจำ: {data_clinic.doctor_name}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  export default Home;
  