// ✅ NotificationProvider.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Snackbar, Alert, AlertColor } from "@mui/material";
import APIs, { endpoints } from "../Config/APIs";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Notification } from "../Interface/Notification";
import { useTranslation } from "react-i18next";

interface NotificationContextType {
  currentPage: number;
  totalPages: number;
  total: number;
  notificationItems: Notification[];
  getNotifications: (page: number) => void;
  markANotificationAsRead: (notificationId: string) => void;
  showNotification: (message: string, type?: AlertColor) => void;
}

const NotificationContext = createContext<NotificationContextType>({
  currentPage: 1,
  totalPages: 0,
  total: 0,
  notificationItems: [],
  getNotifications: () => {},
  markANotificationAsRead: () => {},
  showNotification: () => {},
});

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notificationItems, setNotificationItems] = useState<Notification[]>([]);
  const [popupMessage, setPopupMessage] = useState<string>("");
  const [popupType, setPopupType] = useState<AlertColor>("info");
  const [open, setOpen] = useState<boolean>(false);
  const [cooldown, setCooldown] = useState<boolean>(false); // ✅ chặn spam
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const user = useSelector((state: RootState) => state.auth.user);
  const { t } = useTranslation();

  // ✅ Hiển thị thông báo có cooldown & auto fade
  const showNotification = (message: string, type: AlertColor = "info") => {
    if (cooldown) return; // ⛔ không cho hiển thị thông báo kế tiếp trong lúc đang hiển thị

    setPopupMessage(message);
    setPopupType(type);
    setOpen(true);
    setCooldown(true);

    // Ẩn sau 5s (fade-out tự động)
    setTimeout(() => {
      setOpen(false);
      // Sau khi fade-out xong (300ms mặc định của MUI), cho phép hiển thị thông báo mới
      setTimeout(() => setCooldown(false), 300);
    }, 5000);
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  // ✅ Fetch notifications
  const getNotifications = async (page: number) => {
    try {
      const res = await APIs.get(`${endpoints.getNotifications(user?._id)}?page=${page}`);
      if (page === 1) {
        setNotificationItems(res.data.notifs);
      } else {
        setNotificationItems((prev) => [...prev, ...res.data.notifs]);
      }

      setCurrentPage(res.data.currentPage);
      setTotalPages(res.data.totalPages);
      setTotal(res.data.total);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  // ✅ Mark as read
  const markANotificationAsRead = async (notificationId: string) => {
    try {
      const res = await APIs.patch(endpoints.markANotificationAsRead(notificationId));
      if (res.status === 200) {
        showNotification(t(`${res.data.message}`), "success");
      } else {
        showNotification(t(`${res.data.message}`), "error");
      }
      getNotifications(currentPage);
    } catch (error) {
      console.error("Failed to update notification", error);
    }
  };

  useEffect(() => {
    if (user?._id) getNotifications(currentPage);
  }, [user?._id]);

  return (
    <NotificationContext.Provider
      value={{
        notificationItems,
        currentPage,
        total,
        totalPages,
        getNotifications,
        markANotificationAsRead,
        showNotification,
      }}
    >
      {children}

      {/* ✅ Global Snackbar Popup */}
      <Snackbar
        open={open}
        autoHideDuration={5000} // mờ dần sau 5s
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        TransitionProps={{ timeout: 400 }} // fade mượt
      >
        <Alert
          severity={popupType}
          onClose={handleClose}
          sx={{
            width: "100%",
            borderRadius: 2,
            boxShadow: 2,
            animation: "fadeIn 0.3s ease",
          }}
          variant="filled"
        >
          {popupMessage}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};
