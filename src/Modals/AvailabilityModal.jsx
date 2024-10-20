/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export const AvailabilityModal = ({ isOpen, onClose, slotInfo, onSetAvailability }) => {
  const slotStart = new Date(slotInfo.start);
  const slotEnd = new Date(slotInfo.end);

  // console.log("SLot: ",slotInfo.slots);
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const formatLocalDateTime = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.00`;
  };


  const [availabilityStartTime, setAvlStartTime] = useState("09:00");
  const [availabilityEndTime, setAvlEndTime] = useState("17:00");

  const handleTime = (event) => {
    const { name, value } = event.target;
    console.log("Value: ", value);
    const [hours, minutes] = value.split(":");
    console.log("Value: ", value, "Hours, minutes ", hours, minutes);

    if (name === "start") {
      setAvlStartTime(`${hours}:${minutes}`);
    } else if (name === "end") {
      // setAvlEndTime(`${hours}:${minutes}`);

      if (
        parseInt(hours) == parseInt(availabilityStartTime.split(":")[0]) &&
        parseInt(minutes) == parseInt(availabilityStartTime.split(":")[1])
      ) {
        setSubmitDisabled(true);
        toast.error("End time can't be same as start time!");
        setAvlEndTime(availabilityStartTime); // Reset endTime to startTime if endTime is same as startTime
        return;
      }

      if (parseInt(hours) < parseInt(availabilityStartTime.split(":")[0])) {
        // console.log("End time can't be earlier than start time!",hours,availabilityStartTime.split(":")[0]);
        toast.error("End time can't be earlier than start time!");
        setAvlEndTime(availabilityStartTime); // Reset endTime to startTime if endTime is earlier

        setSubmitDisabled(true);
        return;
      }

      if (
        (parseInt(hours) === parseInt(availabilityStartTime.split(":")[0]) &&
          parseInt(minutes) > parseInt(availabilityStartTime.split(":")[1])) ||
        parseInt(hours) > parseInt(availabilityStartTime.split(":")[0])
      ) {
        setSubmitDisabled(false);
        setAvlEndTime(`${hours}:${minutes}`);
      }
    }
  };



  const handleAddAvailability = async (e) => {
    e.preventDefault();
    const newAvailabilities = [];
    // Availability for each day in slots[].
    for (let i = 0; i < slotInfo.slots.length; i++) {
      const slot = slotInfo.slots[i];
      // console.log(slot);
      let startDateTime = formatLocalDateTime(new Date(slot)); //string
      let endDateTime = formatLocalDateTime(new Date(slot));

      const [stHours, stMinutes] = availabilityStartTime.split(":");
      const [endHours, endMinutes] = availabilityEndTime.split(":");
      // Updating time only of slot start and end
      const newStartDateTime =
        startDateTime.substring(0, 11) +
        stHours.toString().padStart(2, "0") +
        ":" +
        stMinutes.toString().padStart(2, "0") +
        startDateTime.substring(16);

      const newEndDateTime =
        endDateTime.substring(0, 11) +
        endHours.toString().padStart(2, "0") +
        ":" +
        endMinutes.toString().padStart(2, "0") +
        endDateTime.substring(16);

      //new availability with slot date . and global startTime/endTime
      const availability = {
        email: user.email,
        start: newStartDateTime,
        end: newEndDateTime,
      };

      console.log("Availability to add: ", availability);
      // Add each availability/slot to the allAvailabilities array[].
      newAvailabilities.push(availability);
    }

    onSetAvailability(newAvailabilities);  //Send to backend
    console.log("Sent request to backend: ", newAvailabilities);
    onClose();    //Close modal after adding availablity
  };

  const [submitDisabled, setSubmitDisabled] = useState(false);

  // Slot
  const getOrdinal = (day) => {
    if (day > 3 && day < 21) return day + " th";
    switch (day % 10) {
      case 1:
        return day + " st";
      case 2:
        return day + " nd";
      case 3:
        return day + " rd";
      default:
        return day + " th";
    }
  };

  const formatFullDate = (date) => {
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    return `${getOrdinal(day)} ${month}`;
  };

  const formattedSlotStartDate = formatFullDate(slotStart);
  const formattedSlotEndDate = formatFullDate(slotEnd);

  //   -----------------------------------------------------
  if (!isOpen) return null; //***
  return (
    <div
      id="default-modal"
      tabIndex="-1"
      className=" w-full mx-auto  bg-gray-200 bg-opacity-20 backdrop-blur-sm overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center  md:inset-0 h-[calc(100%-1rem)] max-h-full"
    >
      <div className="mt-36 mx-auto relative p-4 w-full max-w-2xl max-h-full">
        {/* <!-- Modal content --> */}
        <div className="relative bg-gray-100 rounded-lg shadow dark:bg-gray-700">
          {/* <!-- Modal header --> */}
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-2xl  text-gray-900 dark:text-white">
              Set your Availability
            </h3>

            {/* Close button */}
            <button
              onClick={onClose}
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <svg
                className="w-3 h-3"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>

          {/* <!-- Modal body --> */}
          <div className="p-4 md:px-5  pt-2 pb-2 space-y-4">
            {/* Form for selecting start and end time */}
            <form
              onSubmit={handleAddAvailability}
              className="mt-1  pb-3 mx-auto  rounded-lg"
            >

              {/* Form header */}
              <div className="mb-2 text-gray-500 dark:text-gray-400">
                <label className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">
                  Slot: &nbsp;
                  {formattedSlotStartDate} to {formattedSlotEndDate}
                </label>
              </div>

              {/* Start and End Time Input */}
              <div className="mb-2">
                {/* Start time */}
                <label
                  htmlFor="time"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Start time:
                </label>
                <div className="relative mb-2 ">
                  <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    type="time"
                    id="time"
                    name="start"
                    value={availabilityStartTime}
                    onChange={handleTime}
                    className="bg-gray-50 border leading-none border-gray-300 text-gray-900 hover:border-blue-500 dark:hover:border-blue-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                </div>

                {/* End time */}
                <label
                  htmlFor="time"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  End time:
                </label>
                <div className="relative ">
                  <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    type="time"
                    id="time"
                    name="end"
                    value={availabilityEndTime}
                    onChange={handleTime}
                    className="bg-gray-50 border leading-none border-gray-300 text-gray-900 hover:border-blue-500 dark:hover:border-blue-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Form Submit button */}
              <div className="flex justify-center p-2 md:p-2">
                <button
                  type="submit"
                  disabled={submitDisabled}
                  id="submitAvailability"
                  className={`${
                    submitDisabled ? "cursor-not-allowed" : ""
                  }py-2.5 px-5 ms-1 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-300 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 `}
                >
                  Submit
                </button>

                {/* Close Btn */}
                <button
                  onClick={onClose}
                  data-modal-hide="default-modal"
                  type="button"
                  className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-300 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
