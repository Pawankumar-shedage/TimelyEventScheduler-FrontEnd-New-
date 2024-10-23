/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import { EventDetailsModal } from "../Modals/EventDetailsModal";
import { AvailabilityModal } from "../Modals/AvailabilityModal";
import { toast } from "react-toastify";
import { CustomCalendarToolbar } from "./CustomCalendarToolbar";
import { useSelector } from "react-redux";
import { MyEvents } from "./MyEvents";
import { useNavigate } from "react-router-dom";

const localizer = momentLocalizer(moment);
// /events
export const CalendarSchedule = ({ height }) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0); //for fetching availabilities, when needed
  const navigate = useNavigate();
  const { user, isLoggedIn } = useSelector((state) => state.auth);

  const email = user.email;

  const [userEvents, setUserEvents] = useState([...events]);

  //fetch events/availabilities/sessions from backend
  useEffect(() => {
    axios
      .get(`http://localhost:4545/sessions/${email}`)
      .then((response) => {
        console.log("Events data: ", response.data);

        // Assuming the backend returns events in the correct format
        const backendEvents = response.data.map((event) => ({
          ...event,
          title: event.title,
          eventType: event.sessionType,
          start: new Date(event.start), // Convert to Date object
          end: new Date(event.end),
        }));
        setEvents(backendEvents); // Store fetched events in state

        setUserEvents(backendEvents);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, []);

  // Event display
  const EventComponent = ({ event }) => {
    return (
      <span>
        <strong>{event.title}</strong>
        <p>{event.eventType}</p>
        <small>{event.description}</small>
      </span>
    );
  };

  const handleSelectEvent = (event) => {
    // console.log("Selected event", event);
    setSelectedEvent(event);
    setIsModalOpen(true);

    console.log("Modal Open ", isModalOpen);
  };

  const handleSelectSlot = (slot) => {
    console.log("Selected slot", slot);
    // Send this slot to availability modal.
    setSelectedSlot(slot);
    setIsAvailabilityModalOpen(true);
  };

  const handleCloseSlotModal = () => {
    setIsAvailabilityModalOpen(false);
  };

  // -----Custom Calendar styles
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
          backgroundColor: "#808080", // Change background color
          border: "2px solid #FF5F1F", // Add border for emphasis
          color: "#000", // Change text color if necessary
        },
      };
    }
    // Default styling for other days
    return {};
  };

  const handleCalendarView = (view) => {
    console.log("View: ", view);
  };

  // View Availability----------------

  // Update availability
  useEffect(() => {
    const handleViewAvailability = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4545/users/${email}/availability`
        ); // fetch availaiblity for selected slot

        console.log("Availabilities: ", response.data);
        if (response.status === 200) {
          const availabilities = response.data.map((availability) => ({
            title: "Available",
            start: new Date(availability.start),
            end: new Date(availability.end),
            availabilityId: availability.availabilityId,
            duration: availability.duration,
            eventType: "Available",
            attendees: availability.attendees,
          }));

          setEvents((prevState) => {
            const updatedEvents = [...prevState, ...availabilities].filter(
              (event, index, self) =>
                index ===
                self.findIndex((e) => e.availabilityId === event.availabilityId)
            );
            return updatedEvents;
          });
        }
      } catch (error) {
        console.log("Error: ", error);
      }
    };
    handleViewAvailability();
  }, [email]); //reloading calendar component only when availability is added/deleted.

  // Available Event Styling
  const eventStyleGetter = (eventData) => {
    if (eventData.title === "Available") {
      return {
        style: {
          backgroundColor: "rgba(211, 249, 216, 0.7)", // Light green for availability
          borderColor: "#28A745", // Darker green for emphasis
          color: "#1E7D34", // Text color
          zIndex: 1,
        },
      };
    }

    return {
      style: {
        backgroundColor: "#3BF2F6",
        borderColor: "#28A745",
        color: "#000",
        zIndex: 2,
      },
    };
  };
  // !View Availability-----------------

  // Set(Add Availability)
  const handleSetAvailability = async (allAvailabilities) => {
    console.log("Sending Availabilities: ", allAvailabilities);

    setEvents((events) => [...events, ...allAvailabilities]);
    try {
      const response = await axios.post(
        "http://localhost:4545/users/availability",
        allAvailabilities
      );

      if (response.status >= 200 && response.status < 300) {
        console.log("Response: ", response.data);
        toast.success("Availability added successfully");
      }
    } catch (error) {
      if (error.response) {
        console.log("Server Error Response: ", error.response.data);
        toast.error(
          `${
            error.response.data ? error.response.data : "Something went wrong"
          }`
        );
      } else {
        console.log("Unknown Error: ", error);
        toast.error("Something went wrong, please try again");
      }
    }
    setReloadKey((prevKey) => prevKey + 1);
  };

  // Delete Availability:
  const handleDeleteAvailability = async (availabilityId) => {
    try {
      const response = await axios.delete(
        `http://localhost:4545/users/${user.email}/availability/${availabilityId}`
      );

      if (response.status === 200) {
        console.log("Response data:", response.data);
        toast.success("Availability deleted successfully");

        // Referesh the calendar
        setEvents((prevEvents) => {
          return prevEvents.filter(
            (event) => event.availabilityId !== availabilityId
          );
        });
      }
    } catch (error) {
      console.log("Error: ", error); //debug log
      toast.error("Failed to delete availability,please try again");
    }
  };

  // Update availability
  const handleUpdateAvailability = async (availability) => {
    console.log("Received availability: ", availability);
    try {
      const response = await axios.put(
        `http://localhost:4545/users/${user.email}/updtAvailability/${availability.availabilityId}`,
        availability
      );

      if (response.status === 200) {
        console.log("Response data:", response.data); //debug log
        toast.success("Availability updated successfully");

        setReloadKey((prevKey) => prevKey + 1); //fetch updated availability.
      }
    } catch (error) {
      console.log("Error: ", error); //debug log
      toast.error(error.response.data, " please try again");
    }
  };

  // Show User Events
  const handleMyEvents = () => {
    navigate("/myevents", { state: { height: 500, userEvents: userEvents } });
  };
  // -------------------------------------------------------------------------------------
  return (
    <div className="p-6  bg-gray-100 dark:bg-gray-800">
      {/* For users */}
      <div className="w-10/12 mx-auto mb-2 text-black dark:text-white   flex justify-between">
        <h2 className="text-2xl md:text-3xl  dark:text-white mb-4">
          Upcoming Events
        </h2>
        <div className="">
          {/* Availability btn */}
          <button
            onClick={() => toast.info("Select day(s) to set availability")}
            className="bg-blue-500 hover:bg-blue-700 text-white dark:text-white font-bold  h-10/12 py-2  my-auto px-4 rounded-2xl"
          >
            Set Availability
          </button>
          {/* User Events  */}
          <button
            onClick={handleMyEvents}
            type="button"
            className="ml-5 bg-blue-500 hover:bg-blue-700 text-white dark:text-white font-bold  h-10/12 py-2  my-auto px-4 rounded-2xl"
          >
            My Events
          </button>
        </div>
      </div>

      <Calendar
        key={reloadKey}
        className="w-10/12 text-black  dark:text-white mx-auto"
        components={{
          event: EventComponent,
          toolbar: CustomCalendarToolbar,
        }}
        selectable
        onSelectEvent={handleSelectEvent}
        events={events}
        eventPropGetter={eventStyleGetter}
        localizer={localizer}
        onSelectSlot={handleSelectSlot}
        startAccessor="start"
        endAccessor="end"
        style={{ height: height }}
        dayPropGetter={dayPropGetter}
        onView={handleCalendarView}
      />

      {/* Selected Event Modal */}
      {selectedEvent && (
        <EventDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          event={selectedEvent}
          onDeleteAvailability={handleDeleteAvailability}
          onUpdateAvailability={handleUpdateAvailability}
        />
      )}

      {/* Availability Modal */}
      {isAvailabilityModalOpen && (
        <AvailabilityModal
          isOpen={isAvailabilityModalOpen}
          onClose={handleCloseSlotModal}
          slotInfo={selectedSlot}
          onSetAvailability={handleSetAvailability}
        />
      )}
    </div>
  );
};
