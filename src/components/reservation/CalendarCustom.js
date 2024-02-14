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
  const [userHasMadeASelection, setUserHasMadeASelection] = useState(false);

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
  // useEffect(() => {
  //   if (startDate >= endDate) {
  //     const newEndDate = addDays(startDate, 1)
  //     setEndDate(newEndDate)
  //   }
  // }, [startDate, endDate, setEndDate])

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
  

  // useEffect(() => {
  //   if (userHasMadeASelection) {
  //     return;
  //   }
  //   if (!isLoading && reservedDates) {
  //     const today = new Date();
  //     const formattedExcludedDates = reservedDates.map(date => new Date(date)).sort((a, b) => a - b);
  //     // 오늘 날짜 이후의 예약 불가능한 날짜들만 필터링
  //     const futureExcludedDates = formattedExcludedDates.filter(date => date >= today);
  
  //     // 첫 번째 예약 가능한 날짜를 찾기
  //     let newStartDate = today;
  //     while (futureExcludedDates.some(date => isSameDay(date, newStartDate) || isSameDay(date, addDays(newStartDate, 1)))) {
  //       newStartDate = addDays(newStartDate, 1);
  //     }
  
  //     const newEndDate = addDays(newStartDate, 1);
  //     // 예약 가능한 날짜가 excludedDates에 포함되지 않는지 다시 확인
  //     if (!futureExcludedDates.some(date => isSameDay(date, newEndDate))) {
  //       if (!isSameDay(newStartDate, startDate) || !isSameDay(newEndDate, endDate)) {
  //         setStartDate(newStartDate);
  //         setEndDate(newEndDate);
  //       }
  //     }
  //   }
  // }, [isLoading, reservedDates, userHasMadeASelection]);

  // useEffect(() => {
  //   if (userHasMadeASelection) {
  //     // 사용자의 선택을 처리한 후, 다음 로직 실행을 위해 상태를 리셋합니다.
  //     // setUserHasMadeASelection(false);
  //     return;
  //   }
  //   if (!isLoading && reservedDates) {
  //     // 문자열로 된 날짜들을 Date 객체로 변환
  //     const formattedDates = reservedDates.map(date => new Date(date));
  //     // 날짜 순으로 정렬
  //     const sortedExcludedDates = formattedDates.sort((a, b) => a - b);
  
  //     const today = new Date();
  //     let potentialStartDate = today;
  //     let potentialEndDate = addDays(today, 1);
  
  //     // potentialStartDate가 excludedDates에 포함되어 있다면, 다음 가능한 날짜를 찾음
  //     while (sortedExcludedDates.some(date => isSameDay(date, potentialStartDate))) {
  //       potentialStartDate = addDays(potentialStartDate, 1);
  //       potentialEndDate = addDays(potentialStartDate, 1); // endDate를 startDate의 다음 날로 초기 설정
  //     }
  
  //     // potentialEndDate가 excludedDates에 포함되어 있는지 검사하고, 포함되어 있다면 다음 가능한 날짜를 찾음
  //     while (sortedExcludedDates.some(date => isSameDay(date, potentialEndDate))) {
  //       potentialEndDate = addDays(potentialEndDate, 1);
  //     }
  
  //     // startDate와 endDate 설정
  //     if (!isSameDay(potentialStartDate, startDate) || !isSameDay(potentialEndDate, endDate)) {
  //       setStartDate(potentialStartDate);
  //       setEndDate(potentialEndDate);
  //     }
  //   }
  // }, [isLoading, reservedDates, userHasMadeASelection]);

  // useEffect(() => {
  //   if (userHasMadeASelection) {
  //     return;
  //   }
  //   if (!isLoading && reservedDates) {
  //     const formattedDates = reservedDates.map(dateString => new Date(dateString));
  //     const sortedExcludedDates = formattedDates.sort((a, b) => a - b);
  
  //     let newStartDate = new Date();
  //     let newEndDate = addDays(new Date(), 1);
  //     let found = false;
  
  //     while (!found) {
  //       // newStartDate가 excludedDates에 포함되지 않고,
  //       // newEndDate가 excludedDates에 포함되지 않으며,
  //       // newStartDate와 newEndDate 사이에 excludedDates가 없는지 확인
  //       if (!sortedExcludedDates.some(date => isSameDay(date, newStartDate) || isSameDay(date, newEndDate))) {
  //         const rangeHasExcludedDate = sortedExcludedDates.some(date =>
  //           date > newStartDate && date < newEndDate
  //         );
  
  //         if (!rangeHasExcludedDate) {
  //           found = true;
  //         } else {
  //           // 연속된 선택 가능한 날짜가 아니면, newStartDate를 하루 증가시키고 다시 확인
  //           newStartDate = addDays(newStartDate, 1);
  //           newEndDate = addDays(newStartDate, 1);
  //         }
  //       } else {
  //         // excludedDates에 포함된 날짜를 발견하면, newStartDate와 newEndDate를 증가
  //         newStartDate = addDays(newStartDate, 1);
  //         newEndDate = addDays(newStartDate, 1);
  //       }
  //     }
  
  //     // 최종적으로 선택 가능한 연속된 날짜를 찾으면 상태 업데이트
  //     if (!isSameDay(newStartDate, startDate) || !isSameDay(newEndDate, endDate)) {
  //       setStartDate(newStartDate);
  //       setEndDate(newEndDate);
  //     }
  //   }
  // }, [isLoading, reservedDates, userHasMadeASelection]);
  

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
    setUserHasMadeASelection(true);
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
