/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { CustomCalendarToolbar } from "./CustomCalendarToolbar";

const localizer = momentLocalizer(moment);
export const HomeCalendarDemo = ({height,width}) => {

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
          backgroundColor: '#1F293737', // Change background color
          border: '2px solid #FF5F1F', // Add border for emphasis
          color: '#000', // Change text color if necessary
        },
      };
    }
    // Default styling for other days
    return {};
  };
  return (
    <div>
      <Calendar
        localizer={localizer}
        startAccessor="start"
        endAccessor="end"
        className=" w-11/12 mx-auto md:h-56 lg:h-64 bg-white-100 text-black dark:text-white dark:bg-gray-800 "
        style={{ height: height }}
        components={{
          toolbar:CustomCalendarToolbar
        }}
        dayPropGetter={dayPropGetter}
      />
    </div>
  );
};