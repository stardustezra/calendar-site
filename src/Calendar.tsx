import React, { useState, useEffect } from "react";
import axios from "axios";
import { Holiday } from "./types/holidayTypes";

const Calendar: React.FC = () => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const months = [
    "Januar 2024",
    "Februar 2024",
    "Marts 2024",
    "April 2024",
    "Maj 2024",
    "Juni 2024",
  ];

  useEffect(() => {
    const fetchHolidays = async () => {
      const token = import.meta.env.VITE_API_TOKEN;
      const endpoint = "/api/holidays";
      const startDate = "2024-01-01";
      const endDate = "2024-12-31";

      try {
        const response = await axios.get(endpoint, {
          params: { startDate, endDate },
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;
        setHolidays(data);
      } catch (error) {
        console.error("Error fetching holidays:", error);
      }
    };

    fetchHolidays();
  }, []);

  const renderCalendarGrid = (month: number, year: number) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return Array.from({ length: daysInMonth }, (_, index) => {
      const day = index + 1;
      const date = new Date(year, month, day);
      const dayName = date
        .toLocaleDateString("da-DK", { weekday: "short" })
        .charAt(0)
        .toUpperCase(); // Get the first character and convert to uppercase
      const holiday = holidays.find(
        (holiday) =>
          new Date(holiday.date).getFullYear() === year &&
          new Date(holiday.date).getMonth() === month &&
          new Date(holiday.date).getDate() === day
      );

      // Check if the current date is between May 13th and May 19th
      const isSpecialRange = month === 4 && day >= 13 && day <= 19;

      // Determine if the day is Saturday (6) or Sunday (0)
      const isSaturday = date.getDay() === 6;
      const isSunday = date.getDay() === 0;

      // Determine the class names to apply
      const dayClassNames = [
        "calendar-day",
        isSpecialRange ? "special-range" : "",
        isSaturday ? "saturday" : "",
        isSunday ? "sunday" : "",
        holiday ? "holiday" : "",
      ]
        .filter(Boolean)
        .join(" ");

      return (
        <div key={day} className={dayClassNames}>
          <span className="day-name">{dayName}</span>
          <span className="day-number">{day}</span>
          {holiday && <span className="holiday-indicator">{holiday.name}</span>}
        </div>
      );
    });
  };

  const renderCalendar = () => {
    const year = 2024; // Set the year here
    const firstSixMonths = months.slice(0, 6); // Get the first six months

    return (
      <div className="calendar-flex-container">
        {firstSixMonths.map((monthName, index) => (
          <div key={monthName} className="calendar-month">
            <h2>{monthName}</h2>
            <div className="calendar-grid">
              {renderCalendarGrid(index, year)}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return <div className="calendar">{renderCalendar()}</div>;
};

export default Calendar;
