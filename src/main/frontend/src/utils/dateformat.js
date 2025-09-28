import dayjs from "dayjs";

const DEFAULT_FORMAT = "YYYY-MM-DD";

export function formatDate(value, format = DEFAULT_FORMAT) {
  if (!value) return "-";
  return dayjs(value).format(format);
}
