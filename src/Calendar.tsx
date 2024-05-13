import React, { useState, useEffect } from "react";
import axios from "axios";
import { Holiday } from "./types/holidayTypes";

const Calendar: React.FC = () => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);

  useEffect(() => {
    const fetchHolidays = async () => {
      const token = import.meta.env.VITE_API_TOKEN;
      const endpoint = "/api/holidays";
      const startDate = "2024-01-01";
      const endDate = "2024-12-31";

      console.log(import.meta.env);

      try {
        const response = await axios.get(endpoint, {
          params: {
            startDate,
            endDate,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        setHolidays(data);
      } catch (error) {
        console.error("Error fetching holidays:", error);
      }
    };

    fetchHolidays();
  }, []);

  const renderCalendarGrid = () => {
    const daysInMonth = Array.from({ length: 30 }, (_, index) => index + 1);

    return daysInMonth.map((day) => (
      <div key={day} className="calendar-day">
        <span className="day-number">{day}</span>
        {holidays.some(
          (holiday) => new Date(holiday.date).getDate() === day
        ) && <span className="holiday-indicator">Holiday!</span>}
      </div>
    ));
  };

  return (
    <div className="calendar">
      <h2>Holidays</h2>
      <div className="calendar-grid">{renderCalendarGrid()}</div>
    </div>
  );
};

export default Calendar;
