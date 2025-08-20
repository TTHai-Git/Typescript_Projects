import Fuse from "fuse.js";
import fs from "fs";
export const chatWithBotFAQ = async (req, res) => {
  // Load FAQ data
  const faqData = JSON.parse(fs.readFileSync("./faq.json", "utf8"));

  // Tạo Fuse instance cho fuzzy search
  const fuse = new Fuse(faqData, {
    keys: ["question"], // tìm trong field "question"
    threshold: 0.5, // độ chính xác (0 = strict, 1 = thoáng)
  });

  try {
    const { message } = req.body;

    // Tìm câu trả lời gần đúng nhất
    const result = fuse.search(message);

    if (result.length > 0) {
      return res.status(200).json({ reply: result[0].item.answer });
    } else {
      return res.status(400).json({
        reply: "Xin lỗi, tôi chưa có câu trả lời cho câu hỏi này.",
      });
    }
  } catch (error) {
    return res.status(500).json("Somthing went wrong. Please try again later!");
  }
};
