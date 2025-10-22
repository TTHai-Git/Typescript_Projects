import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Grid,
  Button,
  Paper,
  CircularProgress,
} from "@mui/material";
import { ArrowBack, Refresh } from "@mui/icons-material";
import { authApi, endpoints } from "../Config/APIs";
import { useNotification } from "../Context/Notification";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { logout } from "../features/login/authSlice";
import { useDispatch } from "react-redux";

const Form2FA: React.FC = () => {
  const dispatch = useDispatch();
  const { user_id } = useParams();
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [QRCodeUrl, setQRCodeUrl] = useState<string>("");
  const [secret, setSecret] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [verifying, setVerifying] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(120);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isAuthenticated2Fa = searchParams.get("isAuthenticated2Fa") === "true"; // normalize to boolean
  const { showNotification } = useNotification();
  const { t } = useTranslation();

  const handleChange = (value: string, index: number) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const generateQRForTOTP = async (showNotify = false) => {
    try {
      setLoading(true);
      const res = await authApi.get(endpoints["generateQR"]);
      if (res.status === 200) {
        setQRCodeUrl(res.data.QRCodeUrl);
        setSecret(res.data.secret);
        setTimeLeft(120);
        if (showNotify) showNotification("New QR code generated", "info");
      }
    } catch (error) {
      showNotification("Failed to generate QR code", "error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    const code = otp.join("");
    if (code.length !== 6) return showNotification("Enter all 6 digits", "warning");

    try {
      setVerifying(true);
      // Step 1: Verify OTP first
      const payload = isAuthenticated2Fa
        ? { totp: code, secret, userId: user_id } // for disabling, verify first
        : { totp: code, secret }; // for enabling, verify new secret

      const res = await authApi.post(endpoints["verifyTOTP"], payload);

      if (res.status === 200 && res.data.isVerified2FA) {
        showNotification(t(res.data.message), "info");
        if (isAuthenticated2Fa) {
          // 🔴 Disable flow
          const res_dis = await authApi.put(endpoints["disable2FA"](user_id));
          showNotification(t(res_dis.data.message), "warning");
        } else {
          // 🟢 Enable flow
          const res_ena = await authApi.put(endpoints["enable2FA"](user_id), { secret });
          showNotification(t(res_ena.data.message), "success");
        }
       handleLogOut()
      } else {
        showNotification(t(res.data.message), "error");
      }
    } catch (error:any) {
      console.error(error);
      showNotification(t(error.response.data.message),"error");
    } finally {
      setVerifying(false);
    }
  };

  const handleLogOut = async () => {
      dispatch(logout());
      const res = await authApi.post(endpoints.logout)
      if (res.status === 200) navigate('/login');
    };

  // Auto countdown logic for regenerating QR
  useEffect(() => {
    if (!QRCodeUrl || isAuthenticated2Fa) return; // Only for enabling 2FA
    if (timeLeft <= 0) {
      generateQRForTOTP(true);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, QRCodeUrl, isAuthenticated2Fa]);

  useEffect(() => {
    
    if (!isAuthenticated2Fa) generateQRForTOTP(); // only fetch QR when enabling
  }, [isAuthenticated2Fa]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ backgroundColor: "#f8f9fb", position: "relative" }}
    >
      <Button
        variant="outlined"
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{
          position: "absolute",
          top: 30,
          left: 30,
          borderRadius: 3,
          textTransform: "none",
          fontWeight: "bold",
        }}
      >
        {t("Go Back")}
      </Button>

      <Paper
        elevation={3}
        sx={{
          p: 5,
          borderRadius: 4,
          width: { xs: "90%", sm: 400 },
          textAlign: "center",
        }}
      >
        <Typography variant="h5" fontWeight="600" mb={2}>
          {isAuthenticated2Fa
            ? t("Disable Two-Factor Authentication")
            : t("Enable Two-Factor Authentication")}
        </Typography>

        {!isAuthenticated2Fa && (
          <>
            <Typography variant="subtitle1" fontWeight={600} align="left" mb={1}>
              Step 1: Scan this QR code
            </Typography>
            <Typography variant="body2" color="text.secondary" align="left" mb={2}>
              Scan using your authenticator app (Google Authenticator, Microsoft Authenticator, Authy, Duo Mobile, etc.)
            </Typography>

            <Box
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: 2,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                p: 2,
                mb: 1,
                minHeight: 180,
              }}
            >
              {loading ? (
                <CircularProgress />
              ) : (
                QRCodeUrl && (
                  <img
                    src={QRCodeUrl}
                    alt="2FA QR Code"
                    style={{ width: 160, height: 160 }}
                  />
                )
              )}
            </Box>

            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              mb={1}
            >
              QR code expires in <strong>{timeLeft}s</strong>
            </Typography>

            <Button
              startIcon={<Refresh />}
              size="small"
              variant="outlined"
              onClick={() => generateQRForTOTP(true)}
              sx={{ mb: 3, textTransform: "none" }}
            >
              Refresh QR Code
            </Button>
          </>
        )}

        <Typography variant="subtitle1" fontWeight={600} align="left" mb={1}>
          {isAuthenticated2Fa ? "Step 1: Verify your code" : "Step 2: Enter the one-time code"}
        </Typography>

        <Typography variant="body2" color="text.secondary" align="left" mb={2}>
          Enter the 6-digit verification code from your authenticator app.
        </Typography>

        <Grid container spacing={1} justifyContent="center" mb={3}>
          {otp.map((digit, index) => (
            <Grid item key={index}>
              <TextField
                id={`otp-${index}`}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                inputProps={{
                  maxLength: 1,
                  style: {
                    textAlign: "center",
                    fontSize: "20px",
                    width: "45px",
                    height: "45px",
                  },
                }}
              />
            </Grid>
          ))}
        </Grid>

        <Button
          fullWidth
          variant="contained"
          color={isAuthenticated2Fa ? "warning" : "primary"}
          onClick={handleSubmit}
          disabled={verifying || otp.join("").length !== 6}
          sx={{ py: 1.2, fontWeight: 600 }}
        >
          {verifying ? (
            <CircularProgress size={24} />
          ) : isAuthenticated2Fa ? (
            "Verify & Disable 2FA"
          ) : (
            "Verify & Enable 2FA"
          )}
        </Button>
      </Paper>
    </Box>
  );
};

export default Form2FA;
