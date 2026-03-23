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
import formatDate from "../Convert/formatDate";
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
      <Fab onClick={() => setOpen(!open)} sx={{ position: "fixed", bottom: 24, right: 24, bgcolor: '#ff9800', color: '#fff', '&:hover': { bgcolor: '#f57c00' }, boxShadow: '0 8px 20px rgba(255, 152, 0, 0.4)', zIndex: 1000 }}>
        {open ? <Cancel /> : <ChatIcon />}
      </Fab>

      {open && (
        <Card sx={{ position: "fixed", bottom: 90, right: 24, width: 380, height: 500, display: "flex", flexDirection: "column", boxShadow: '0 20px 60px rgba(0,0,0,0.15)', borderRadius: '24px', zIndex: 1000, overflow: 'hidden' }}>
          <CardHeader
            avatar={<Avatar src={`https://res.cloudinary.com/dh5jcbzly/image/upload/v1755585703/DOGSHOP/bot-avatar_vexgij.jpg`} sx={{ boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }} />}
            action={<IconButton sx={{ color: '#fff' }} onClick={() => setOpen(false)}><Cancel /></IconButton>}
            title={<Typography fontWeight="bold">PetShop Assistant</Typography>}
            subheader={<Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>{typing ? "Bot đang nhập..." : "Online"}</Typography>}
            sx={{ bgcolor: "#ff9800", color: "white", pb: 3 }}
          />

          <CardContent sx={{ flex: 1, overflowY: "auto", p: 2, bgcolor: '#fdfbf7', mt: -2, borderTopLeftRadius: '24px', borderTopRightRadius: '24px' }}>
            <List sx={{ py: 0 }}>
              {messages.map((m, i) => (
                <ListItem key={i} sx={{ justifyContent: m.sender === "user" ? "flex-end" : "flex-start", px: 0, py: 1 }}>
                  {m.sender === "bot" && <ListItemAvatar><Avatar src={`https://res.cloudinary.com/dh5jcbzly/image/upload/v1755585703/DOGSHOP/bot-avatar_vexgij.jpg`} sx={{ width: 32, height: 32 }} /></ListItemAvatar>}
                  <ListItemText
                    primary={<Typography variant="body1" sx={{ fontWeight: 500 }}>{m.text}</Typography>}
                    secondary={<Typography variant="caption" sx={{ color: m.sender === "user" ? "rgba(255,255,255,0.7)" : "text.secondary", display: 'block', mt: 0.5 }}>{formatDate(m.time.toString())}</Typography>}
                    sx={{
                      bgcolor: m.sender === "user" ? "#ff9800" : "#fff",
                      color: m.sender === "user" ? "white" : "#3e2723",
                      p: 1.5,
                      borderRadius: '16px',
                      borderTopRightRadius: m.sender === "user" ? '4px' : '16px',
                      borderTopLeftRadius: m.sender === "bot" ? '4px' : '16px',
                      maxWidth: "75%",
                      textAlign: "left",
                      boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                      border: m.sender === "user" ? 'none' : '1px solid #ffe8cc',
                      m: 0
                    }}
                  />
                  {m.sender === "user" && <ListItemAvatar sx={{ minWidth: 'auto', ml: 2 }}><Avatar src={`https://res.cloudinary.com/dh5jcbzly/image/upload/v1755585703/DOGSHOP/user-avatar_sgv3ve.png`} sx={{ width: 32, height: 32 }} /></ListItemAvatar>}
                </ListItem>
              ))}
              {typing && (
                <Typography variant="body2" sx={{ fontStyle: "italic", textAlign: "left", my: 1, color: "text.secondary", pl: 6 }}>
                  Bot đang gõ...
                </Typography>
              )}
              <div ref={messagesEndRef} />
            </List>
          </CardContent>

          <Box sx={{ display: "flex", p: 2, bgcolor: '#fff', borderTop: "1px solid #f0f0f0" }}>
            <TextField
              fullWidth size="small" placeholder="Nhập tin nhắn..." value={input}
              onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '20px', bgcolor: '#f9f9f9' } }}
            />
            <IconButton sx={{ color: '#ff9800', ml: 1, bgcolor: '#fff3e0', '&:hover': { bgcolor: '#ffe0b2' } }} onClick={handleSend}><SendIcon /></IconButton>
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
