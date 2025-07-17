import React, { useState, useEffect } from "react";
import {
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
} from "firebase/auth";
import { auth } from "../firebase";
import {
  TextField,
  Button,
  Typography,
  Box,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router";

// ✅ Extend window interface
declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
  }
}

const PhoneVerify: React.FC = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
  const [cooldown, setCooldown] = useState<number>(0);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const navigate = useNavigate()

  // Countdown effect
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const setupRecaptcha = (auth:any) => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth, // ✅ use the passed-in auth instance
      "recaptcha-container",
      {
        size: "invisible",
        callback: () => handleSendOTP(),
      }
    );
  }
};


  const handleSendOTP = async () => {
  setupRecaptcha(auth);
  const appVerifier = window.recaptchaVerifier;

  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phone, appVerifier);
    setConfirmation(confirmationResult);
    setCooldown(60);
    showMessage("OTP sent successfully!", "success");
  } catch (err: any) {
    console.error(err);
    showMessage("Failed to send OTP", "error");
  }
};

  const handleVerifyOTP = async () => {
    try {
      if (confirmation) {
        await confirmation.confirm(otp);
        showMessage("Phone verified successfully! Please check your email to verify account with OTP has sent.", "success");
        navigate("/login")
      } else {
        showMessage("No OTP session found.", "error");
      }
    } catch (err: any) {
      console.error(err);
      showMessage("Invalid OTP", "error");
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={5}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Firebase Phone OTP Verification
      </Typography>

      <Stack spacing={2} mt={2}>
        <TextField
          label="Phone Number"
          placeholder="+84901234567"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={!!confirmation}
        />

        <Button
          variant="contained"
          onClick={handleSendOTP}
          disabled={cooldown > 0 || !phone}
        >
          {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Send OTP"}
        </Button>

        <TextField
          label="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <Button
          variant="contained"
          color="success"
          onClick={handleVerifyOTP}
          disabled={!otp}
        >
          Verify OTP
        </Button>
      </Stack>

      {/* Firebase Invisible reCAPTCHA */}
      <div id="recaptcha-container"></div>

      {/* Snackbar Message */}
      <Snackbar open={!!message} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={message?.type}>{message?.text}</Alert>
      </Snackbar>
    </Box>
  );
};

export default PhoneVerify;
