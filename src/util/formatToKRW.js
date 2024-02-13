export default function formatToKRW(number) {
    return new Intl.NumberFormat('ko-KR', {style: 'decimal'}).format(number);
}