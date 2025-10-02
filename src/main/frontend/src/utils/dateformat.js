import dayjs from "dayjs";

const DEFAULT_FORMAT = "YYYY-MM-DD";

export function formatDate(value, format = DEFAULT_FORMAT) {
  if (!value) return "-";
  return dayjs(value).format(format);
}

export function formatTime(value) {
  if (!value) return "-";
  
  const [hour, minutes] = value.split(':');



  return `${hour}:${minutes}`;
}

export function period(dailyTodo){
  const periodStack = [];

dailyTodo.forEach((v) => {
    const d1 = new Date(formatDate(v.eventBgngDt));
    const d2 = new Date(formatDate(v.eventEndDt));
    
    const periodMs = d2.getTime() - d1.getTime();
    const period = Math.max(1, Math.floor(periodMs / (1000 * 60 * 60 * 24)) + 1);

    periodStack.push(period);
  })

  return periodStack;
}