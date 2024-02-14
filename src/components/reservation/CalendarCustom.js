import React, { useState, useEffect } from 'react'
import { DateRange } from 'react-date-range'
import { addYears, addDays, isSameDay } from 'date-fns'
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

  useEffect(() => {
    if (!isLoading) {
      // 현재 날짜로부터 2년 뒤까지의 모든 날짜를 생성
      let allDates = [];
      for (let d = new Date(); d <= twoYearsLater; d = addDays(d, 1)) {
        allDates.push(d);
      }
  
      // 사용할 수 없는 날짜를 필터링하여 제외
      const availableDates = allDates.filter(d => 
        !reservedDates.some(excludedDate => 
          isSameDay(new Date(excludedDate), d)
        )
      );
  
      if (availableDates.length > 0) {
        // 사용 가능한 첫 번째 날짜를 startDate로, 그 다음 날짜를 endDate로 설정
        setStartDate(availableDates[0]);
        setEndDate(addDays(availableDates[0], 1));
      }
    }
  }, [isLoading, reservedDates]);

  // 현재 날짜와 2년 뒤 날짜 계산
  const today = new Date()
  const twoYearsLater = addYears(new Date(), 2)

  const onRangeChange = (ranges) => {
    const { selection } = ranges
    // 체크인 날짜와 체크아웃 날짜가 동일한 경우, 체크아웃 날짜를 체크인 날짜의 다음 날로 설정
    if (isSameDay(selection.startDate, selection.endDate)) {
      selection.endDate = addDays(selection.startDate, 1);
    }
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
