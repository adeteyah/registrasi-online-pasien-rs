export function getToday() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const result = `${year}-${month}-${day}`;
  return result;
}

export function getTodayOffsetDate(offset) {
  const todayStr = getToday(); // Get today's formatted date
  const today = new Date(todayStr); // Convert string to Date object

  // Modify the date based on the offset (+14 or -14)
  today.setDate(today.getDate() + offset);

  // Format the resulting date in "YYYY-MM-DD" format
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  const result = `${year}-${month}-${day}`;
  return result;
}
