/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import moment from "moment";
import { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { CustomCalendarToolbar } from "./CustomCalendarToolbar";
import { useLocation } from "react-router-dom";

const localizer = momentLocalizer(moment);

export const MyEvents = () => {
  const location = useLocation();
  const { height, userEvents } = location.state || {};

  console.log("My Events", userEvents);

  const dayPropGetter = (date) => {
    const today = new Date(); // Get the current date

    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      // Apply custom styles for current day
      return {
        style: {
          backgroundColor: "#ADD8E6", // Change background color
          border: "2px solid #FF5F1F", // Add border for emphasis
          color: "#000", // Change text color if necessary
        },
      };
    }
    // Default styling for other days
    return {};
  };

  return (
    <div>
      <Calendar
        className="w-10/12 text-black  dark:text-white mx-auto"
        style={{ height: height }}
        events={userEvents}
        localizer={localizer}
        startAccessor="start"
        endAccessor="end"
        components={{ toolbar: CustomCalendarToolbar }}
        dayPropGetter={dayPropGetter}
      />
    </div>
  );
};
