import { forwardRef, useState, useEffect } from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ko from 'date-fns/locale/ko'
import { getMonth, getYear, getDate, isBefore, addDays } from 'date-fns'

import '../../styles/calendarCustom.css'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import { useReservedDatesOfHotel } from '@/hooks/useReservation'

registerLocale('ko', ko) // 날짜 한국어로 표시

const CustomInput = forwardRef((props, ref) => {
	return (
		<div className='calendar-input-wrap'>
			<input {...props} ref={ref} type='text' />
			<CalendarMonthIcon />
		</div>
	)
})

CustomInput.displayName = 'CustomInput' // displayName을 수동으로 설정

export default function CalendarCustom({
	hotelId,
	startDate,
	endDate,
	setStartDate,
	setEndDate,
}) {
	const { reservedDates, isLoading, isError, error } = useReservedDatesOfHotel(hotelId);
	const [excludedDates, setExcludedDates] = useState([]);
	const [minEndDate, setMinEndDate] = useState(endDate);
	const [maxEndDate, setMaxEndDate] = useState(null)

	useEffect(() => {
		if (!isLoading && reservedDates) {
				const formattedDates = reservedDates.map(dateString => new Date(dateString));
				setExcludedDates(formattedDates);
		}
	}, [reservedDates, isLoading]);

	const today = new Date()
	const twoYearsLater = new Date(
		today.getFullYear() + 2,
		today.getMonth(),
		today.getDate()
	)

	// 체크인 날짜가 변경될 때 호출되는 함수
	const handleStartDateChange = (date) => {
		setStartDate(date)

		// 체크아웃 날짜의 최소 선택 가능 날짜를 체크인 날짜의 다음 날로 설정
		const nextDay = addDays(date, 1)
		setMaxEndDate(twoYearsLater) // 체크아웃 날짜의 최대 선택 가능 날짜를 업데이트
		setMinEndDate(nextDay) // 여기서 setMinEndDate는 체크아웃 날짜의 최소 선택 가능 날짜 상태를 업데이트하는 함수입니다.

		// 체크아웃 날짜가 체크인 날짜보다 이전인 경우, 체크아웃 날짜를 체크인 날짜의 다음 날로 재설정
		if (isBefore(endDate, nextDay)) {
				setEndDate(nextDay);
		}
		
		// 선택 불가능한 날짜 중 체크인 날짜 이후의 첫 번째 날짜를 찾음
		const firstDisabledDateAfterStart = excludedDates.find((excludedDates) =>
			isBefore(date, excludedDates)
		)
		// 체크아웃 날짜의 최대값을 설정 (선택 불가능한 날짜의 전날)
		if (firstDisabledDateAfterStart) {
			setMaxEndDate(addDays(firstDisabledDateAfterStart, -1))
		} else {
			// 모든 날짜가 선택 가능한 경우
			setMaxEndDate(twoYearsLater)
		}
	}

	const _ = require('lodash')
	const years = _.range(getYear(new Date()), getYear(new Date()) + 3, 1)
	const months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']

	return (
		<div className='custom-wrap3 custom-wrap4'>
			<div className='date-picker-wrap'>
				<DatePicker
					//Input 커스텀
					customInput={<CustomInput />}
					//header 커스텀
					renderCustomHeader={({
						date,
						changeYear,
						changeMonth,
						decreaseMonth,
						increaseMonth,
						prevMonthButtonDisabled,
						nextMonthButtonDisabled,
					}) => (
						<div
							style={{
								margin: 10,
								display: 'flex',
								justifyContent: 'center',
							}}>
							<button
								onClick={decreaseMonth}
								disabled={prevMonthButtonDisabled}>
								<ArrowBackIosIcon />
							</button>
							<select
								value={getYear(date)}
								onChange={({ target: { value } }) => changeYear(Number(value))}
								className='selectbox'>
								{years.map((option) => (
									<option key={option} value={option}>
										{option}년
									</option>
								))}
							</select>

							<select
								value={months[getMonth(date)]}
								onChange={({ target: { value } }) =>
									changeMonth(months.indexOf(value))
								}
								className='selectbox'>
								{months.map((option) => (
									<option key={option} value={option}>
										{option}월
									</option>
								))}
							</select>

							<button
								onClick={increaseMonth}
								disabled={nextMonthButtonDisabled}>
								<ArrowForwardIosIcon />
							</button>
						</div>
					)}
					dayClassName={(d) => 'custom-day'}
					dateFormat='yyyy.MM.dd'
					disabledKeyboardNavigation //다른달에도 해당일자에 색표시되는거 제거
					locale='ko' //한국어로 설정
					//최소(minDate),최대날짜(maxDate) 범위 지정
					minDate={today} // 현재날짜부터
					maxDate={twoYearsLater} // 2년 뒤까지
					excludeDates={excludedDates}
					selected={startDate}
					onChange={handleStartDateChange}
					selectsStart
					startDate={startDate}
					endDate={startDate}
				/>
				<p className='wave'>&nbsp; &#126; &nbsp;</p>
				<DatePicker
					customInput={<CustomInput />}
					renderCustomHeader={({
						date,
						changeYear,
						changeMonth,
						decreaseMonth,
						increaseMonth,
						prevMonthButtonDisabled,
						nextMonthButtonDisabled,
					}) => (
						<div
							style={{
								margin: 10,
								display: 'flex',
								justifyContent: 'center',
							}}>
							<button
								onClick={decreaseMonth}
								disabled={prevMonthButtonDisabled}>
								<ArrowBackIosIcon />
							</button>
							<select
								value={getYear(date)}
								onChange={({ target: { value } }) => changeYear(Number(value))}
								className='selectbox'>
								{years.map((option) => (
									<option key={option} value={option}>
										{option}년
									</option>
								))}
							</select>

							<select
								value={months[getMonth(date)]}
								onChange={({ target: { value } }) =>
									changeMonth(months.indexOf(value))
								}
								className='selectbox'>
								{months.map((option) => (
									<option key={option} value={option}>
										{option}월
									</option>
								))}
							</select>

							<button
								onClick={increaseMonth}
								disabled={nextMonthButtonDisabled}>
								<ArrowForwardIosIcon />
							</button>
						</div>
					)}
					dayClassName={(d) => 'custom-day'}
					dateFormat='yyyy.MM.dd'
					disabledKeyboardNavigation
					locale='ko'
					minDate={minEndDate}
					maxDate={maxEndDate}
					excludeDates={excludedDates}
					selected={endDate}
					onChange={(date) => setEndDate(date)}
					selectsEnd
					startDate={startDate}
					endDate={endDate}
				/>
			</div>
		</div>
	)
}
