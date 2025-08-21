import React, { useState, useRef, useEffect } from "react";
import {
  Box, Card, CardHeader, CardContent, TextField, IconButton,
  Typography, Fab, Avatar, List, ListItem, ListItemAvatar, ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import SendIcon from "@mui/icons-material/Send";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import APIs, { endpoints } from "../Config/APIs";
import formatDate from "../Convert/formatDate ";
import FacebookIcon from "@mui/icons-material/Facebook";
import { Cancel, Chat } from "@mui/icons-material";



interface Message {
  sender: "user" | "bot";
  text: string;
  time: Date;
}

export default function Chatbot() {
    
  const [open, setOpen] = useState(false);
  const [fallbackOpen, setFallbackOpen] = useState(false);

  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{
    sender: "bot",
    text: "Xin chào 👋, mình là trợ lý ảo. Bạn muốn tìm gì trong cửa hàng PetShop?",
    time: new Date()
  }]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { sender: "user", text: input, time: new Date() }]);
    setInput("");
    setTyping(true);

    try {
      const res = await APIs.post(endpoints.chatBot, { message: input });
      if (res.data.reply) {
        setMessages(prev => [...prev, { sender: "bot", text: res.data.reply || "🙁", time: new Date() }]);
      }
      else {
        setMessages(prev => [...prev, { sender: "bot", text: "Xin lỗi, mình chưa rõ câu trả lời 😅", time: new Date() }]);
        setFallbackOpen(true); // mở dialog
      }
      
    } catch {
      setMessages(prev => [...prev, { sender: "bot", text: "Xin lỗi, mình không thể trả lời câu hỏi của bạn hiên tại." +  
        "Bạn có thể liên hệ trực tiếp với cộng tác viên của mình qua các nền tảng mạng xã hội như Zalo và Facebook", 
        time: new Date() }]);
      setFallbackOpen(true); // mở dialog
    }

    setTyping(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  }, [messages, typing]);

  return (
    <>
      <Fab color="primary" onClick={() => setOpen(!open)} sx={{ position: "fixed", bottom: 16, right: 16 }}>
        <ChatIcon />
      </Fab>

      {open && (
        <Card sx={{ position: "fixed", bottom: 80, right: 16, width: 360, height: 480, display: "flex", flexDirection: "column", boxShadow: 3 }}>
          <CardHeader
            avatar={<Avatar src={`https://res.cloudinary.com/dh5jcbzly/image/upload/v1755585703/DOGSHOP/bot-avatar_vexgij.jpg`} />}
            action={<IconButton><MoreVertIcon /></IconButton>}
            title="PetShop Assistant"
            subheader={typing ? "Bot đang nhập..." : "Online"}
            sx={{ bgcolor: "primary.main", color: "white" }}
          />

          <CardContent sx={{ flex: 1, overflowY: "auto", p: 2 }}>
            <List sx={{ py: 0 }}>
              {messages.map((m, i) => (
                <ListItem key={i} sx={{ justifyContent: m.sender === "user" ? "flex-end" : "flex-start" }}>
                  {m.sender === "bot" && <ListItemAvatar><Avatar src={`https://res.cloudinary.com/dh5jcbzly/image/upload/v1755585703/DOGSHOP/bot-avatar_vexgij.jpg`} /></ListItemAvatar>}
                  <ListItemText
                    primary={m.text}
                    secondary={formatDate(m.time.toString())}
                    sx={{
                      bgcolor: m.sender === "user" ? "primary.light" : "grey.200",
                      color: m.sender === "user" ? "white" : "black",
                      p: 1,
                      borderRadius: 2,
                      maxWidth: "70%",
                      textAlign: m.sender === "user" ? "right" : "left",
                      boxShadow: 1
                    }}
                  />
                  {m.sender === "user" && <ListItemAvatar><Avatar src={`https://res.cloudinary.com/dh5jcbzly/image/upload/v1755585703/DOGSHOP/user-avatar_sgv3ve.png`} /></ListItemAvatar>}
                </ListItem>
              ))}
              {typing && (
                <Typography variant="body2" sx={{ fontStyle: "italic", textAlign: "left", my: 1 }}>
                  Bot đang gõ...
                </Typography>
              )}
              <div ref={messagesEndRef} />
            </List>
          </CardContent>

          <Box sx={{ display: "flex", p: 1, borderTop: "1px solid #ddd" }}>
            <TextField
              fullWidth size="small" placeholder="Nhập tin nhắn..." value={input}
              onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()}
            />
            <IconButton color="primary" onClick={handleSend}><SendIcon /></IconButton>
          </Box>
        </Card>
      )}
      {/* Popup fallback */}
      <Dialog open={fallbackOpen} onClose={() => setFallbackOpen(false)}>
        <DialogTitle>Bạn muốn được hỗ trợ thêm?</DialogTitle>
        <DialogContent>
          Bot chưa hiểu câu hỏi của bạn, vui lòng chat trực tiếp qua:
        </DialogContent>
        <DialogActions>
          <Button
            startIcon={<FacebookIcon />}
            onClick={() => window.open(`${process.env.REACT_APP_FACEBOOK_URL}`, "_blank")}
          >
            Messenger
          </Button>
          <Button
            startIcon={<Chat />}
            sx={{ color: "#0068FF" }}
            onClick={() => window.open(`${process.env.REACT_APP_ZALO_PHONE}`, "_blank")}
          >
            Zalo
          </Button>
          <Button
            startIcon={<Cancel />}
            sx={{ color: "#ff1e00ff" }}
            onClick={() => setFallbackOpen(false)}
          >
            Hủy
          </Button>
        </DialogActions>
      </Dialog>

    </>
  );
}
