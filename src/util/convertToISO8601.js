export default function convertToISO8601(input) {
    const date = new Date(input);
    const options = {year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short'};
    let formattedDate = new Intl.DateTimeFormat('ko-KR', options).format(date);
    formattedDate = formattedDate.replace(/\.(?=\s\()/, '');
    return formattedDate;
}