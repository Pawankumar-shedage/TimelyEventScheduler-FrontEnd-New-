/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import axios from "axios";
import { Button, Modal } from "flowbite-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

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

  console.log("Event Details Modal", event.start.toISOString().slice(0,22));

  const handleSendEmail = (email) => {
    console.log("Email", email);
    window.open(`mailto:${email}`, "_blank");
  };

  const formattedStartTime = new Date(start).toLocaleTimeString("en-US", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }); // "9:30 AM".
  const formattedEndTime = new Date(end).toLocaleTimeString("en-US", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  // Update Availability -Event
  const fmtNewSt=new Date(start).toISOString().slice(0,23);
  const fmtNewEnd=new Date(end).toISOString().slice(0,23);
  const [newAvailabilityData, setNewAvailabilityData] = useState({
    availabilityId:event.availabilityId,
    start: fmtNewSt,
    end: fmtNewEnd,
  });

  const handleNewAvalabilityDataChange = (e)=>{
    const {name,value} = e.target;
    setNewAvailabilityData({
      ...newAvailabilityData,
      [name]:value
    });

    console.log("New Availability Data: ", newAvailabilityData);
    
  }
  const updateAvailability = (e) => {
    e.preventDefault();

    // onUpdateAvailability(newAvailabilityData);
    // onClose();
  };

  // Delete Availability -Event
  const deleteAvailability = () => {
    console.log(
      "Delete Availability: ",
      event.availabilityId,
      "User: ",
      user.email
    );
    onDeleteAvailability(event.availabilityId);
    onClose();
  };

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
                  <strong>Event Type:</strong> {eventType}
                </p>
                <form onSubmit={updateAvailability}>
                  <p>
                    <strong>Start:</strong>{" "}
                    <span>
                      <input
                        type="time"
                        name="start"
                        value={newAvailabilityData.start}
                        onChange={handleNewAvalabilityDataChange}
                      />
                    </span>
                  </p>
                  <p>
                    <strong>End:</strong>{" "}
                    <span>
                      <input
                        type="time"
                        name="end"
                        value={newAvailabilityData.end}
                        onChange={handleNewAvalabilityDataChange}
                      />
                    </span>
                  </p>

                  <div>
                    <button type="submit">Update</button>
                  </div>
                </form>
                {duration > 0 && (
                  <p>
                    <strong>Duration:</strong> {duration} minutes
                  </p>
                )}
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
                  <p>
                    <strong>Attendees:</strong>{" "}
                  </p>
                )}
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
              </div>
            )}
          </div>
          {/* <!-- Modal footer --> */}
          <div className="flex justify-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
            {eventType === "Available" ? (
              <div>
                <button
                  onClick={updateAvailability}
                  className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-800 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-300 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  Update availability
                </button>

                <button
                  onClick={deleteAvailability}
                  className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-800 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-300 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  Delete availability
                </button>
              </div>
            ) : (
              <button
                onClick={onClose}
                data-modal-hide="default-modal"
                className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-300 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
