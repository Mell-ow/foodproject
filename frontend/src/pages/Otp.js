import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

function Otp({ user, hasPendingOrder, onConfirmOtp, isPlacingOrder }) {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!hasPendingOrder) {
    return (
      <section className="auth-page card narrow-card">
        <h2>OTP Verification</h2>
        <p className="muted-text">No pending order found. Start checkout first.</p>
        <Link to="/checkout">Go to Checkout</Link>
      </section>
    );
  }

  const submit = async (event) => {
    event.preventDefault();
    const success = await onConfirmOtp(otp);

    if (success) {
      navigate("/");
    }
  };

  return (
    <section className="auth-page card narrow-card">
      <h2>Verify OTP</h2>
      <p className="muted-text">Enter the OTP sent to your mobile number.</p>

      <form onSubmit={submit}>
        <input
          value={otp}
          onChange={(event) => setOtp(event.target.value)}
          placeholder="Enter 6-digit OTP"
          required
        />
        <button type="submit" disabled={isPlacingOrder}>
          {isPlacingOrder ? "Placing order..." : "Verify and Place Order"}
        </button>
      </form>
    </section>
  );
}

export default Otp;