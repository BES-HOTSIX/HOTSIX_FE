export default function isTimeBeforeNow(time) {
    return new Date(time) < new Date();
}