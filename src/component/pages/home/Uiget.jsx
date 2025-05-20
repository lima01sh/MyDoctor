import { useFetch } from "../auth/useGet";
import { APi_URL_UATt } from "../auth/config";
function Uiget() {
  const { data, loading, error } = useFetch(
    APi_URL_UATt+"posts",
    []
  );

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">📌 JSON Placeholder Posts</h1>

      {loading && <div className="text-center">⌛ กำลังโหลดข้อมูล...</div>}
      {error && <div className="text-danger text-center">❌ {error.message}</div>}

      <div className="row">
        {data.map((post) => (
          <div key={post.id} className="col-md-6">
            <div className="card mb-3 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{post.title}</h5>
                <p className="card-text">{post.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Uiget
