import React, { useRef, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from "chart.js";

// ลงทะเบียน Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const IncomeChart = ({ incomeData }) => {
  const chartRef = useRef(null);

  // ใช้ useEffect เพื่อสร้าง gradient background สำหรับกราฟ
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    const ctx = chart.ctx;
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, "rgba(131, 182, 240, 0.5)");
    gradient.addColorStop(1, "rgba(79, 253, 166, 0.1)");

    chart.data.datasets[0].backgroundColor = gradient;
    chart.update();
  }, [incomeData]);

  const data = {
    labels: incomeData.map((item) => item.month_name),
    datasets: [
      {
        label: "รายได้ทั้งหมด",
        data: incomeData.map((item) => item.total_income),
        borderColor: "rgb(51, 97, 150)",
        borderWidth: 3,  // เปลี่ยนความหนาของเส้น
        pointRadius: 5,  // เปลี่ยนขนาดจุด
        pointBackgroundColor: "rgb(51, 97, 150)", // สีจุด
        fill: false,  // ไม่ให้เติมสีพื้นหลัง
        tension: 0.4,  // ทำให้เส้นโค้งนุ่มนวล
        hoverBackgroundColor: "rgba(51, 97, 150, 0.5)", // สีเมื่อ hover
      },
      {
        label: "เงินสด",
        data: incomeData.map((item) => item.cash_income),
        borderColor: "rgb(255, 99, 132)",
        borderWidth: 3,
        pointRadius: 5,
        pointBackgroundColor: "rgb(255, 99, 132)",
        fill: false,
        tension: 0.4,
        hoverBackgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "การโอน",
        data: incomeData.map((item) => item.transfer_income),
        borderColor: "rgb(75, 192, 192)",
        borderWidth: 3,
        pointRadius: 5,
        pointBackgroundColor: "rgb(75, 192, 192)",
        fill: false,
        tension: 0.4,
        hoverBackgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          font: {
            family: "Kanit, sans-serif",
            size: 14,
          },
          color: "#333",
        },
      },
      tooltip: {
        titleFont: {
          family: "Kanit, sans-serif",
          size: 14,
        },
        bodyFont: {
          family: "Kanit, sans-serif",
          size: 12,
        },
      },
    },
    interaction: {
      mode: 'index',
      intersect: false
    },
    scales: {
      x: {
        ticks: {
          font: {
            family: "Kanit, sans-serif",
            size: 12,
          },
        },
      },
      y: {
        ticks: {
          font: {
            family: "Kanit, sans-serif",
            size: 12,
          },
        },
      },
    },
  };

  return <Line ref={chartRef} data={data} options={options} />;
};

export default IncomeChart;
