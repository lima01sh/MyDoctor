import { useState } from "react";
import { usePost } from "../../auth/usePost";
import { APi_URL_PORFUCTION } from "../../auth/config";
function Uipost() {
  const { response, error, loading, postData } = usePost(
    `${APi_URL_PORFUCTION}`+"/api/v1/zoo/check_qr"
  );

  const [ref1, setRef1] = useState("");

  const handleSubmit = () => {
    const raw = { ref1 };
    postData(raw);
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center">🔍 ตรวจสอบ QR Code</h1>

      <div className="card p-3 shadow-sm">
        <input
          type="text"
          className="form-control mb-2"
          placeholder="กรอก QR Code"
          value={ref1}
          onChange={(e) => setRef1(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSubmit}>
          ตรวจสอบ
        </button>
      </div>

      {loading && <div className="text-center mt-3">⌛ กำลังโหลด...</div>}
      {error && <div className="text-danger mt-3">{error}</div>}

      {response && (
        <div className="mt-3 p-3 bg-light border">
          <h5>✅ ผลลัพธ์:</h5>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default Uipost;
