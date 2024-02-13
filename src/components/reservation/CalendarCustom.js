import React, { useState, useEffect } from 'react'
import { DateRange } from 'react-date-range'
import { addYears, addDays } from 'date-fns'
import ko from 'date-fns/locale/ko'
import { useReservedDatesOfHotel } from '@/hooks/useReservation'

// react-date-range 스타일 시트 임포트
import 'react-date-range/dist/styles.css' // 메인 스타일 파일
import 'react-date-range/dist/theme/default.css' // 테마 스타일 파일
import '../../styles/calendar.css'

export default function CalendarCustom({
  hotelId,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}) {
  const { reservedDates, isLoading, isError, error } =
    useReservedDatesOfHotel(hotelId)
  const [excludedDates, setExcludedDates] = useState([])

  useEffect(() => {
    if (!isLoading && reservedDates) {
      const formattedDates = reservedDates.map(
        (dateString) => new Date(dateString)
      )
      setExcludedDates(formattedDates)
    }
  }, [reservedDates, isLoading])

  // 초기 상태를 설정할 때 부모 컴포넌트에서 받은 startDate와 endDate를 사용
  // 체크아웃 날짜가 체크인 날짜와 같거나 이전 날짜인 경우, 체크아웃 날짜를 체크인 날짜의 다음 날로 설정
  useEffect(() => {
    if (startDate >= endDate) {
      const newEndDate = addDays(startDate, 1)
      setEndDate(newEndDate)
    }
  }, [startDate, endDate, setEndDate])

  // 현재 날짜와 2년 뒤 날짜 계산
  const today = new Date()
  const twoYearsLater = addYears(new Date(), 2)

  const onRangeChange = (ranges) => {
    const { selection } = ranges
    setStartDate(selection.startDate)
    setEndDate(selection.endDate)
  }

  return (
    <div>
      <DateRange
        locale={ko}
        editableDateInputs={false}
        onChange={onRangeChange}
        months={1}
        direction='horizontal'
        moveRangeOnFirstSelection={false}
        ranges={[{ startDate, endDate, key: 'selection' }]}
        disabledDates={excludedDates}
        minDate={today}
        maxDate={twoYearsLater}
      />
    </div>
  )
}
