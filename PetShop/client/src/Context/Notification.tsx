// NotificationProvider.tsx
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
  total: number
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
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)

  const user = useSelector((state: RootState) => state.auth.user);
  const {t}= useTranslation()

  // ✅ Show popup
  const showNotification = (message: string, type: AlertColor = "info") => {
    setPopupMessage(message);
    setPopupType(type);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  // ✅ Fetch notifications
  const getNotifications = async (page: number) => {
    try {
      const res = await APIs.get(`${endpoints.getNotifications}?userId=${user?._id}&page=${page}`);
      if (page === 1) {
        setNotificationItems(res.data.notifs);
      }
      else {
        setNotificationItems((prev) => [...prev, ...res.data.notifs]);
      }
      
      setCurrentPage(res.data.currentPage)
      setTotalPages(res.data.totalPages)
      setTotal(res.data.total)
      
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  // ✅ Mark as read
  const markANotificationAsRead = async (notificationId: string) => {
    try {
      const res = await APIs.patch(endpoints.markANotificationAsRead(notificationId));
      console.log(res)
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
      value={{ notificationItems, currentPage, total, totalPages, getNotifications, markANotificationAsRead, showNotification }}
    >
      {children}

      {/* Global popup (float) */}
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          severity={popupType}
          onClose={handleClose}
          sx={{ width: "100%", borderRadius: 2 }}
        >
          {popupMessage}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};
