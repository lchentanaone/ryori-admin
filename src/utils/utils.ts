import * as crypto from "crypto";

export const encrypt = (text: string) => {
  const SECRET_KEY = "your-secret-key";
  const ALGORITHM = "aes-256-ctr";
  const cipher = crypto.createCipher(ALGORITHM, SECRET_KEY);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

export const decrypt = (encryptedText: string) => {
  const SECRET_KEY = "your-secret-key";
  const ALGORITHM = "aes-256-ctr";
  const decipher = crypto.createDecipher(ALGORITHM, SECRET_KEY);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

export const formatDate = (dateString: string | number | Date) => {
  const createdAtDate = new Date(dateString);
  const formattedDate = `${createdAtDate.getFullYear()}-${(
    createdAtDate.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${createdAtDate.getDate().toString().padStart(2, "0")}`;
  return formattedDate;
};
export const truncateText = (
  text: string | undefined,
  maxLength: number
): string => {
  if (!text) return ""; // Handle undefined or null cases
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

export const formatDateMonth = (
  dateString: string | number | Date | undefined
) => {
  if (!dateString) return ""; // Return an empty string if dateString is undefined or empty

  // Create a Date object from the input date string
  const createdAtDate = new Date(dateString);

  // Define an array of month names
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Extract the year, month, and date components
  const year = createdAtDate.getFullYear();
  const month = monthNames[createdAtDate.getMonth()];
  const date = createdAtDate.getDate().toString().padStart(2, "0");

  // Construct the formatted date string as "month date year"
  const formattedDate = `${month} ${date} ${year}`;

  // Return the formatted date string
  return formattedDate;
};

export const formatTime = (dateString: string | number | Date | undefined) => {
  if (!dateString) return ""; // Return an empty string if dateString is undefined or empty

  // Create a Date object from the input date string
  const createdAtDate = new Date(dateString);

  const hours = createdAtDate.getHours().toString().padStart(2, "0");
  const minutes = createdAtDate.getMinutes().toString().padStart(2, "0");
  const seconds = createdAtDate.getSeconds().toString().padStart(2, "0");

  // Construct the formatted date string as "month date year hour:minute"
  const formattedDate = `${hours}:${minutes}:${seconds}`;

  // Return the formatted date string
  return formattedDate;
};
export const getTimeDifference = (
  dateString: string | number | Date | undefined
) => {
  if (!dateString) return ""; // Return an empty string if dateString is undefined or empty

  // Create a Date object from the input date string
  const createdAtDate = new Date(dateString);
  const currentDate = new Date();

  const timeDifference = currentDate.getTime() - createdAtDate.getTime();
  const secondsDifference = Math.floor(timeDifference / 1000);

  if (secondsDifference < 60) {
    return `${secondsDifference} second${
      secondsDifference !== 1 ? "s" : ""
    } ago`;
  } else if (secondsDifference < 3600) {
    const minutesDifference = Math.floor(secondsDifference / 60);
    return `${minutesDifference} minute${
      minutesDifference !== 1 ? "s" : ""
    } ago`;
  } else if (secondsDifference < 86400) {
    const hoursDifference = Math.floor(secondsDifference / 3600);
    return `${hoursDifference} hour${hoursDifference !== 1 ? "s" : ""} ago`;
  } else if (secondsDifference < 2592000) {
    const daysDifference = Math.floor(secondsDifference / 86400);
    return `${daysDifference} day${daysDifference !== 1 ? "s" : ""} ago`;
  } else {
    const monthsDifference = Math.floor(secondsDifference / 2592000);
    return `${monthsDifference} month${monthsDifference !== 1 ? "s" : ""} ago`;
  }
};

export const formatCurrency = (amount: number | bigint) => {
  const formatter = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  });

  return formatter.format(amount);
};

export const capitalizeFirstLetter = (string: string) => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
};
