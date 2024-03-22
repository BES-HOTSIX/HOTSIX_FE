"use client";

import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import ko from "date-fns/locale/ko";
import React, { useState } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

export default function SettleCalendar({ date, setDate, minDate, maxDate }) {
  const queryClient = useQueryClient();
  const [startDate, endDate] = date;
  const [isPickerOpen, setIsPickerOpen] = useState(false); // 날짜 선택기 표시 상태

  const onRangeChange = (ranges) => {
    console.log(ranges.searchSelection.startDate);
    console.log(ranges.searchSelection.endDate);

    setDate([ranges.searchSelection.startDate, ranges.searchSelection.endDate]);
  };

  return (
    <div className="relative">
      <div
        className="flex items-center space-x-2 cursor-pointer"
        onClick={() => setIsPickerOpen(!isPickerOpen)}
      ></div>
      <div
        className="bg-gray-100 w-[300px] p-2 rounded-lg cursor-pointer text-black text-lg flex justify-center"
        onClick={() => setIsPickerOpen(!isPickerOpen)}
      >
        {format(startDate, "yyyy-MM-dd", { locale: ko })} -{" "}
        {format(endDate, "yyyy-MM-dd", { locale: ko })}
      </div>
      {isPickerOpen && ( // 조건부 렌더링으로 날짜 선택기 표시
        <div className="absolute z-10 bg-white mt-2 p-4 rounded-lg shadow-lg">
          <div className="flex justify-center w-full">
            <DateRange
              locale={ko}
              editableDateInputs={false}
              onChange={onRangeChange}
              months={1}
              direction="horizontal"
              moveRangeOnFirstSelection={false}
              ranges={[{ startDate, endDate, key: "searchSelection" }]}
              minDate={minDate}
              maxDate={maxDate}
            />
          </div>
        </div>
      )}
    </div>
  );
}
