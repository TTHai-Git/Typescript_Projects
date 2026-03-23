import React, {useState } from 'react';
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Divider,
 
  Box,
  Tabs,
  Tab,
  Badge,
  Button,
  ListItemButton
} from '@mui/material';
import { formatDistanceToNow } from "date-fns";
import CircleIcon from '@mui/icons-material/Circle';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import EventIcon from '@mui/icons-material/Event';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import MessageIcon from '@mui/icons-material/Message';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useNotification } from '../Context/Notification';
import { useTranslation } from 'react-i18next';

const NotificationList = () => {
  const { notificationItems, getNotifications, currentPage, total, totalPages, markANotificationAsRead } = useNotification();
  const [tab, setTab] = useState<'all' | 'unread'>('all');
  const {t} = useTranslation()

  const handleTabChange = (_: any, newValue: 'all' | 'unread') => {
    setTab(newValue);
  };

  // filter notifications
  const filteredItems =
    tab === 'unread' ? notificationItems.filter((n) => !n.isRead) : notificationItems;
  // group by date (today / earlier)
  const groupByDate = (items: any[]) => {
    const today = new Date().toDateString();
    const groups: Record<string, any[]> = { Today: [], Earlier: [] };

    items.forEach((n) => {
      const created = new Date(n.createdAt).toDateString();
      if (created === today) {
        groups['Today'].push(n);
      } else {
        groups['Earlier'].push(n);
      }
    });

    return groups;
  };

  const groups = groupByDate(filteredItems);

  // pick an icon based on type
  const getIcon = (type: string) => {
    switch (type) {
      case 'ORDER_UPDATE':
        return <NotificationsActiveIcon />;
      case 'VOUCHER':
        return <LocalOfferIcon />;
      case 'MESSAGE':
        return <MessageIcon />;
      case 'ALERT':
        return <WarningAmberIcon />;
      case 'EVENT':
        return <EventIcon />;
      default:
        return <NotificationsActiveIcon />;
    }
  };


  const handleLoadMoreNotificaions = () => {
    // console.log("currentPage, totalPages", currentPage, totalPages)
    if (currentPage < totalPages) {
      getNotifications(currentPage + 1)
    }
    else {
      getNotifications(1)
    }
  }



  return (
  <Box sx={{ width: 380, bgcolor: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}>
    {/* Tabs */}
    <Tabs value={tab} onChange={handleTabChange} variant="fullWidth" sx={{ '& .MuiTabs-indicator': { backgroundColor: '#ff9800' } }}>
      <Tab label={t("All")} value="all" sx={{ fontWeight: 'bold', '&.Mui-selected': { color: '#ff9800' } }} />
      <Tab label={t("Unread")} value="unread" sx={{ fontWeight: 'bold', '&.Mui-selected': { color: '#ff9800' } }} />
    </Tabs>

    {!filteredItems.length ? (
      <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
        <NotificationsNoneIcon sx={{ fontSize: 60, color: '#e0e0e0', mb: 1 }} />
        <Typography variant="body1" fontWeight="600">{t("No notifications")}</Typography>
      </Box>
    ) : (
      <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
        {/* Notification groups */}
        {Object.entries(groups).map(([label, items]) =>
          items.length ? (
            <Box key={label}>
              <Typography variant="subtitle2" sx={{ px: 2, py: 1.5, color: '#3e2723', fontWeight: '800', bgcolor: '#fdfbf7' }}>
                {label}
              </Typography>
              <List sx={{ px: 1 }}>
                {items.map((n) => (
                  <React.Fragment key={n._id}>
                    <ListItem
                      alignItems="flex-start"
                      disablePadding
                      sx={{
                        bgcolor: !n.isRead ? '#fffbf7' : 'transparent',
                        borderRadius: '16px',
                        mb: 0.5,
                        transition: 'all 0.2s',
                        border: !n.isRead ? '1px solid #ffe8cc' : '1px solid transparent',
                        '&:hover': {
                          bgcolor: '#fff3e0'
                        }
                      }}
                    >
                      <ListItemButton onClick={() => markANotificationAsRead(n._id)} sx={{ borderRadius: '16px', py: 1.5 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: !n.isRead ? '#ff9800' : '#e0e0e0', color: !n.isRead ? '#fff' : '#757575', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>{getIcon(n.type)}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography
                              sx={{ fontWeight: !n.isRead ? 800 : 500, color: '#3e2723' }}
                              variant="body2"
                            >
                              {n.title}
                            </Typography>
                          }
                          secondary={
                            <>
                              <Typography variant="body2" color="text.secondary">
                                {n.message}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.disabled"
                                sx={{ display: "block", mt: 0.5 }}
                              >
                                {formatDistanceToNow(
                                  new Date(n.isRead ? n.updatedAt : n.createdAt),
                                  { addSuffix: true }
                                )}
                              </Typography>
                            </>
                          }
                        />
                        {!n.isRead && (
                          <CircleIcon sx={{ fontSize: 12, ml: 1, color: '#ff9800' }} />
                        )}
                      </ListItemButton>
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            </Box>
          ) : null
        )}

        {/* Footer to use for paginating */}
        {currentPage < totalPages ? (
          <Box sx={{ textAlign: 'center', p: 2, borderTop: '1px solid #f0f0f0' }}>
            <Button size="small" onClick={handleLoadMoreNotificaions} sx={{ borderRadius: '20px', fontWeight: 'bold', color: '#ff9800' }}>
              {t("View more notifications")} {`(${total - filteredItems.length})`}
            </Button>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', p: 2, borderTop: '1px solid #f0f0f0' }}>
            <Button size="small" onClick={handleLoadMoreNotificaions} sx={{ borderRadius: '20px', fontWeight: 'bold', color: '#757575' }}>
              {t("Collapse notifications")}
            </Button>
          </Box>
        )}
      </Box>
    )}
  </Box>
);

};

export default NotificationList;
