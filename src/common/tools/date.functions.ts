export function timeToStart(startDate?: Date) {
  if (!startDate) return 0;
  return startDate.valueOf() - Date.now();
}

export function timeToEnd(startDate?: Date, duration?: number) {
  if (!startDate || !duration) return 0;
  return (
    new Date(startDate.getTime() + duration * 1000 * 60).valueOf() - Date.now()
  );
}
