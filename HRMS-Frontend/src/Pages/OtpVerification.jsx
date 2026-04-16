import { useState } from "react";
import { verifyOtp } from "../Services/otp";

const OtpVerification = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const handleVerify = async () => {
    try {
      const res = await verifyOtp({ email, otp });

      if (res.data === true) {
        alert("OTP Verified ✅");
      } else {
        alert("Invalid OTP ❌");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Verify OTP</h2>

      <input
        placeholder="Enter Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="Enter OTP"
        onChange={(e) => setOtp(e.target.value)}
      />

      <button onClick={handleVerify}>Verify</button>
    </div>
  );
};

export default OtpVerification;