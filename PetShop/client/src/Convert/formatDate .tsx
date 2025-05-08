import { format } from "date-fns";

const formatDate = (dateString: string) => {
  return format(new Date(dateString), "dd/MM/yyyy - HH:mm:ss");
};

export default formatDate;