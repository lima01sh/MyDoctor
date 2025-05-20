import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ใช้เพื่อเปลี่ยนหน้า
import "bootstrap/dist/css/bootstrap.min.css";
// import { usePost } from "../auth/usePost";
import { APi_URL_USER } from "../auth/config";
import Swal from "sweetalert2";
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // ใช้เพื่อเปลี่ยนหน้า

  function refreshPage() {
    window.location.reload(false);
}

  const handleSubmit = async (e) => {
    setLoading(true);
     setError(null);
    e.preventDefault();

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "username": username,
      "password": password
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch(APi_URL_USER+"auth", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result['success'] === true) {
          localStorage.setItem("token", result.data.token);
          localStorage.setItem("user", JSON.stringify(result.data));
          localStorage.setItem("clinic_id", result.data.clinic_id);

          navigate("/home");
        }else{
          Swal.fire({
            title: "Error!",
            text: result.message,
            icon: "error",
            confirmButtonText: "OK",
          }).then(() => {
            refreshPage();
          });
          console.log("result:", result);
        }
        console.log(result)
      })
      .catch((error) => {   
        setLoading(false);
        setError(error);
      });

  };
  
  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg, #667eea, #764ba2)",
      }}
    >
      <div className="card p-4 shadow-lg" style={{ maxWidth: "380px", width: "100%", borderRadius: "15px" }}>
        <h2 className="text-center mb-4 text-primary fw-bold">ระบบจัดการคลินิก</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label fw-semibold">
              <i className="bi bi-envelope-fill me-2"></i>Email Address
            </label>
            <input
              type="email"
              className="form-control rounded-3"
              id="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label fw-semibold">
              <i className="bi bi-lock-fill me-2"></i>Password
            </label>
            <input
              type="password"
              className="form-control rounded-3"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <button
            type="submit"
            className="btn w-100 text-white fw-bold"
            style={{
              background: "linear-gradient(135deg, #ff758c, #ff7eb3)",
              border: "none",
              borderRadius: "30px",
            }}
            disabled={loading}
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
