/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import axios from "axios";
import { Button, Modal } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { InfoModal } from "./InfoModal";
import { ConfirmationModal } from "./ConfirmationModal";

export const EventDetailsModal = ({
  isOpen,
  onClose,
  event,
  onDeleteAvailability,
  onUpdateAvailability,
}) => {
  // current user.
  const { user, isLoggedIn } = useSelector((state) => state.auth);

  const { title, start, end, duration, attendees, eventType } = event;
  const [localEvent, setLocalEvent] = useState({ ...event });

  // update local event, when event is changed
  useEffect(() => {
    if (event) setLocalEvent({ ...event });
  }, [event]);

  const handleSendEmail = (email) => {
    console.log("Email", email);
    window.open(`mailto:${email}`, "_blank");
  };

  const formattedStartTime = new Date(localEvent.start).toLocaleTimeString(
    "en-US",
    {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }
  ); // "9:30 AM".
  const formattedEndTime = new Date(localEvent.end).toLocaleTimeString(
    "en-US",
    {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }
  );

  const [newAvlStartTime, setNewAvlStartTime] = useState(""); //previous value
  const [newAvlEndTime, setNewAvlEndTime] = useState("");

  useEffect(() => {
    if (localEvent) {
      // Update Availability -Event
      const fmtNewSt = new Date(localEvent.start)
        .toLocaleTimeString()
        .slice(0, 5);
      const fmtNewEnd = new Date(localEvent.end)
        .toLocaleTimeString()
        .slice(0, 5);

      setNewAvlStartTime(fmtNewSt);
      setNewAvlEndTime(fmtNewEnd);
    }
    console.log("Current Event ", localEvent);
  }, [localEvent]);

  const [submitDisabled, setSubmitDisabled] = useState(false);

  const [newAvailabilityData, setNewAvailabilityData] = useState({
    availabilityId: event.availabilityId,
    start: newAvlStartTime,
    end: newAvlEndTime,
  });

  const handleTime = (event) => {
    const { name, value } = event.target;
    console.log("Value: ", value);
    const [hours, minutes] = value.split(":");
    console.log("Value: ", value, "Hours, minutes ", hours, minutes);

    if (name === "start") {
      setNewAvlStartTime(`${hours}:${minutes}`);
    } else if (name === "end") {
      // setNewAvlEndTime(`${hours}:${minutes}`);

      if (
        parseInt(hours) == parseInt(newAvlStartTime.split(":")[0]) &&
        parseInt(minutes) == parseInt(newAvlStartTime.split(":")[1])
      ) {
        setSubmitDisabled(true);
        toast.error("End time can't be same as start time!");
        setNewAvlEndTime(newAvlStartTime); // Reset endTime to startTime if endTime is same as startTime
        return;
      }

      if (parseInt(hours) < parseInt(newAvlStartTime.split(":")[0])) {
        // console.log("End time can't be earlier than start time!",hours,newAvlStartTime.split(":")[0]);
        toast.error("End time can't be earlier than start time!");
        setNewAvlEndTime(newAvlStartTime); // Reset endTime to startTime if endTime is earlier

        setSubmitDisabled(true);
        return;
      }

      if (
        (parseInt(hours) === parseInt(newAvlStartTime.split(":")[0]) &&
          parseInt(minutes) > parseInt(newAvlStartTime.split(":")[1])) ||
        parseInt(hours) > parseInt(newAvlStartTime.split(":")[0])
      ) {
        setSubmitDisabled(false);
        setNewAvlEndTime(`${hours}:${minutes}`);
      }
    }

    // Set object
    setNewAvailabilityData({
      availabilityId: localEvent.availabilityId,
      start: newAvlStartTime,
      end: newAvlEndTime,
    });
  };

  const formatLocalDateTime = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.00`;
  };

  const updateAvailability = (e) => {
    e.preventDefault();
    console.log("Send updated availability", e);
    let startDateTime = formatLocalDateTime(new Date(localEvent.start)); //string
    let endDateTime = formatLocalDateTime(new Date(localEvent.end));

    console.log(startDateTime, newAvlStartTime);

    const [stHours, stMinutes] = newAvlStartTime.split(":");
    const [endHours, endMinutes] = newAvlEndTime.split(":");
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

    const availability = {
      availabilityId: localEvent.availabilityId,
      start: newStartDateTime,
      end: newEndDateTime,
    };

    console.log("Updated Availability-->: ", availability);

    onUpdateAvailability(availability);
    onClose();
  };

  // Delete Availability -Event
  const deleteAvailability = () => {
    console.log(
      "Delete Availability: ",
      event.availabilityId,
      "User: ",
      user.email
    );
    setOpenInfoModal(true);
  };

  const handleConfirmDelete = () => {
    console.log("handle confirm,Delete Availability: ", event.availabilityId);

    setOpenInfoModal(false);

    onDeleteAvailability(event.availabilityId);
    onClose();
  };

  const [openInfoModal, setOpenInfoModal] = useState(false);

  if (!isOpen) return null; //***
  // ---------------------------------------------------------------------
  return (
    <div
      id="default-modal"
      tabIndex="-1"
      // aria-hidden="true"
      className=" w-full mx-auto  bg-gray-200  bg-opacity-20 backdrop-blur-sm overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center  md:inset-0 h-[calc(100%-1rem)] max-h-full"
    >
      <div className="mt-40 mx-auto relative p-4 w-full max-w-2xl max-h-full">
        {/* <!-- Modal content --> */}
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-800">
          {/* <!-- Modal header --> */}
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="sm:text-xl  text-gray-900 dark:text-white">
              {title}
            </h3>
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
          <div className="p-4 md:p-5 space-y-4">
            {eventType === "Available" ? (
              // {/* Availability Details */}
              <div className="space-y-4 text-black dark:text-white">
                <p>
                  <strong>Event Type:</strong> {localEvent.eventType}
                </p>
                <form onSubmit={updateAvailability}>
                  <div className="mb-2">
                    {/* Start Time */}
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
                        name="start"
                        value={newAvlStartTime}
                        onChange={handleTime}
                        className="bg-gray-50 border leading-none border-gray-300 text-gray-900 hover:border-blue-500 dark:hover:border-blue-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                    </div>

                    {/* End time */}
                    <label
                      htmlFor="time"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      End time:
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
                        name="end"
                        value={newAvlEndTime}
                        onChange={handleTime}
                        className="bg-gray-50 border leading-none border-gray-300 text-gray-900 hover:border-blue-500 dark:hover:border-blue-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex justify-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                    <div>
                      <button
                        type="submit"
                        // onClick={updateAvailability}
                        disabled={submitDisabled}
                        className={`${
                          submitDisabled ? "cursor-not-allowed opacity-50" : ""
                        } py-2.5 px-5 ms-3 text-sm font-medium text-gray-800 focus:outline-none bg-white rounded-lg border border-gray-500 hover:bg-gray-300 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 `}
                      >
                        Update availability
                      </button>

                      <button
                        type="button"
                        onClick={deleteAvailability}
                        className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-800 focus:outline-none bg-white rounded-lg border border-gray-500 hover:bg-gray-300 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                      >
                        Delete availability
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            ) : (
              // {/* Event Details */}
              <div className="space-y-4 text-black dark:text-white">
                <p>
                  <strong>Event Type:</strong> {eventType}
                </p>
                <p>
                  <strong>Start:</strong> {formattedStartTime}
                </p>
                <p>
                  <strong>End:</strong> {formattedEndTime}
                </p>
                {duration > 0 && (
                  <p>
                    <strong>Duration:</strong> {duration} minutes
                  </p>
                )}
                {attendees.length > 0 && (
                  <>
                    <p>
                      <strong>Attendees:</strong>{" "}
                    </p>
                    <ul>
                      {attendees.map((attendee, index) => (
                        <li key={index}>
                          <div className="flex justify-space-between">
                            <div>{attendee.name}</div>
                            {/* TODO: Send email */}
                            <button
                              //  onClick={handleSendEmail(attendee.email)}
                              className="text-white mx-5 px-2 rounded bg-gray-500"
                            >
                              Email
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                {/* // footer */}
                {/* <!-- Modal footer --> */}
                <div className="flex justify-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                  <button
                    onClick={onClose}
                    data-modal-hide="default-modal"
                    className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-300 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Delete confirmation msg */}
      {openInfoModal && (
        <ConfirmationModal
          title={"Are you sure you want to delete this availability?"}
          msgType={"danger"}
          onConfirm={handleConfirmDelete}
          onClose={() => setOpenInfoModal(false)}
        />
      )}
    </div>
  );
};
