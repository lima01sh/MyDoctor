import { useState, useEffect } from 'react';

function PatienFormEdit({ userId }) {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: ''
  });

  const [loading, setLoading] = useState(true);

  // 1. โหลดข้อมูลจาก API
  useEffect(() => {
    fetch(`https://api.example.com/users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setFormData({
          firstname: data.firstname || '',
          lastname: data.lastname || '',
          email: data.email || ''
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching user data:', err);
        setLoading(false);
      });
  }, [userId]);

  // 2. handle change ฟอร์ม
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // 3. ส่งข้อมูลทั้งหมด (รวมของเดิมที่ไม่ถูกแก้)
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`https://api.example.com/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then((res) => {
        if (res.ok) {
          alert('บันทึกข้อมูลสำเร็จ');
        } else {
          alert('เกิดข้อผิดพลาด');
        }
      })
      .catch((err) => console.error('Submit error:', err));
  };

  if (loading) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>ชื่อ</label>
        <input
          type="text"
          name="firstname"
          value={formData.firstname}
          onChange={handleChange}
          className="border px-2 py-1 w-full"
        />
      </div>
      <div>
        <label>นามสกุล</label>
        <input
          type="text"
          name="lastname"
          value={formData.lastname}
          onChange={handleChange}
          className="border px-2 py-1 w-full"
        />
      </div>
      <div>
        <label>อีเมล</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="border px-2 py-1 w-full"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        บันทึก
      </button>
    </form>
  );
}

export default PatienFormEdit;
