import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone"; // ✅ built-in path

dayjs.extend(utc);
dayjs.extend(timezone);

const formatDate = (dateString: string) => {
  return dayjs(dateString)
    .tz("Asia/Ho_Chi_Minh")
    .format("DD/MM/YYYY - HH:mm:ss");
};

export default formatDate;
