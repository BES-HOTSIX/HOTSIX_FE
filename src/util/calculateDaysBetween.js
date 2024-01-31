export default function calculateDaysBetween(date1, date2) {
    const msPerDay = 24 * 60 * 60 * 1000;
    const startDate = new Date(date1);
    const endDate = new Date(date2);
    const differenceInMs = Math.abs(endDate - startDate);
    return Math.round(differenceInMs / msPerDay);
}