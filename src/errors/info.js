export const generateProductsErrorInfo = (productExist) => {
  return "product exist in BD, please check the code";
};

export const generateCartErrorInfo = (cartExist) => {
  return "cart not found in BD, please check the code";
};

export const generateUserErrorInfo = (userExist) => {
  return "user not found in BD, please check the code";
};

export const generateTicketErrorInfo = (Ticket) => {
  return "Not products in the cart";
};

export const generateMessagesInfo = (Message) => {
  return "Not messages in the chat";
};
