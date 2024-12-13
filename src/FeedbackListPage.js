import React, { useEffect, useState } from "react";
import "./styles.css";

const AdminFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch("https://your-api-endpoint.com/feedbacks"); // Backend API endpoint
        if (!response.ok) {
          throw new Error("Geri bildirimler alınamadı.");
        }
        const data = await response.json();
        setFeedbacks(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchFeedbacks();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Geri Bildirimler</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!error && feedbacks.length === 0 && <p>Yükleniyor...</p>}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px",
        }}
      >
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Feedback ID
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Metin (Feedback)
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Duygu Durumu
            </th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map((feedback) => (
            <tr key={feedback.id}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {feedback.id}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {feedback.text}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {feedback.sentiment}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminFeedbacks;
