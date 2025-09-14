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
      case 'PROMOTION':
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
  <Box sx={{ width: 360, bgcolor: 'background.paper' }}>
    {/* Tabs */}
    <Tabs value={tab} onChange={handleTabChange} variant="fullWidth">
      <Tab label={t("All")} value="all" />
      <Tab label={t("Unread")} value="unread" />
    </Tabs>

    {!filteredItems.length ? (
      <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
        <NotificationsNoneIcon sx={{ fontSize: 40, color: 'grey.400' }} />
        <Typography variant="body2">{t("No notifications")}</Typography>
      </Box>
    ) : (
      <>
        {/* Notification groups */}
        {Object.entries(groups).map(([label, items]) =>
          items.length ? (
            <Box key={label}>
              <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'text.secondary' }}>
                {label}
              </Typography>
              <List>
                {items.map((n) => (
                  <React.Fragment key={n._id}>
                    <ListItem
                      alignItems="flex-start"
                      disablePadding
                      sx={{
                        bgcolor: !n.isRead ? 'action.hover' : 'transparent',
                        borderRadius: 2,
                        mb: 0.5,
                      }}
                    >
                      <ListItemButton onClick={() => markANotificationAsRead(n._id)}>
                        <ListItemAvatar>
                          <Avatar>{getIcon(n.type)}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography
                              sx={{ fontWeight: !n.isRead ? 600 : 400 }}
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
                          <CircleIcon color="primary" sx={{ fontSize: 12, ml: 1 }} />
                        )}
                      </ListItemButton>
                    </ListItem>

                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            </Box>
          ) : null
        )}

        {/* Footer to use for paginating */}
        {currentPage < totalPages ? (
          <Box sx={{ textAlign: 'center', p: 1 }}>
            <Button size="small" onClick={handleLoadMoreNotificaions}>
              {t("View more notifications")} {`(${total - filteredItems.length})`}
            </Button>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', p: 1 }}>
            <Button size="small" onClick={handleLoadMoreNotificaions}>
              {t("Collapse notifications")}
            </Button>
          </Box>
        )}
      </>
    )}
  </Box>
);

};

export default NotificationList;
