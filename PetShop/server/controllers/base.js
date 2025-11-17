// controllers/base.js

// Helper function to get Vietnam time in ISO-like format
const getVietnamTime = () => {
  return new Date().toLocaleString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });
};

export const welcomeToServer = (req, res) => {
  return res.status(200).json({
    message: "Welcome to server of Pet Shop!",
    timestamp: getVietnamTime(),
  });
};

export const welcomeToAPIOfPetShop = (req, res) => {
  return res.status(200).json({
    message: "Welcome to the Pet Shop API!",
    timestamp: getVietnamTime(),
  });
};
