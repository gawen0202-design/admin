"use client";
import { useState } from "react";

export default function AdminBillingPage() {
  const [formData, setFormData] = useState({
    encBill: "",
    price: "",
    goodName: "상품 서비스",
    recvphone: "",
  });
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!formData.encBill || !formData.price || !formData.recvphone) {
      alert("모든 정보를 입력해주세요.");
      return;
    }

    if (!confirm(`${formData.price}원을 즉시 결제하시겠습니까?`)) return;

    setLoading(true);
    try {
      const res = await fetch("/api/pay-billing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await res.json();

      if (result.success) {
        alert(`결제 성공!\n결제번호: ${result.mul_no}\n영수증: ${result.csturl}`);
      } else {
        alert(`결제 실패: ${result.message}`);
      }
    } catch (err) {
      alert("통신 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "500px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>💰 관리자 결제 실행</h1>
      <p style={{ color: "#666", marginBottom: "30px" }}>고객의 등록결제키(encBill)를 이용해 결제를 요청합니다.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <label>
          <strong>등록결제키 (encBill)</strong>
          <input 
            type="text" 
            placeholder="고객에게 받은 encBill 입력"
            style={{ width: "100%", padding: "10px", marginTop: "5px" }}
            value={formData.encBill}
            onChange={(e) => setFormData({...formData, encBill: e.target.value})}
          />
        </label>

        <label>
          <strong>구매자 휴대폰 번호</strong>
          <input 
            type="text" 
            placeholder="01012345678"
            style={{ width: "100%", padding: "10px", marginTop: "5px" }}
            value={formData.recvphone}
            onChange={(e) => setFormData({...formData, recvphone: e.target.value})}
          />
        </label>

        <label>
          <strong>결제 금액</strong>
          <input 
            type="number" 
            placeholder="금액 입력"
            style={{ width: "100%", padding: "10px", marginTop: "5px" }}
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
          />
        </label>

        <label>
          <strong>상품명</strong>
          <input 
            type="text" 
            style={{ width: "100%", padding: "10px", marginTop: "5px" }}
            value={formData.goodName}
            onChange={(e) => setFormData({...formData, goodName: e.target.value})}
          />
        </label>

        <button 
          onClick={handlePayment}
          disabled={loading}
          style={{ 
            padding: "15px", 
            backgroundColor: loading ? "#ccc" : "#007bff", 
            color: "white", 
            border: "none", 
            borderRadius: "5px", 
            fontSize: "16px",
            cursor: "pointer",
            marginTop: "20px"
          }}
        >
          {loading ? "결제 처리 중..." : "결제 요청하기"}
        </button>
      </div>
    </div>
  );
}