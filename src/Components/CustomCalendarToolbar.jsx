export const CustomCalendarToolbar = (toolbar) => {
  const goToBack = () => {
    toolbar.onNavigate("PREV");
  };

  const goToNext = () => {
    toolbar.onNavigate("NEXT");
  };

  const goToToday = () => {
    toolbar.onNavigate("TODAY");
  };

  const setView = (view) => {
    toolbar.onView(view);
  };

  const { date } = toolbar;
  const currentDate = date.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <p className="text-center md:text-2xl mb-1 dark:text-white ">
        {currentDate}
      </p>

      {/* Toolbar buttons */}
      <div className="flex  flex-row justify-between mb-4 p-2">
        {/* Navigation buttons */}
        <div className="  ">
          <button
            onClick={goToBack}
            className="bg-blue-500 text-white px-4 py-1 rounded mr-2 hover:bg-blue-600"
          >
            Back
          </button>
          <button
            onClick={goToToday}
            className="mt-2 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
          >
            Today
          </button>
          <button
            onClick={goToNext}
            className="mt-2 bg-blue-500 text-white px-4 py-1 rounded ml-2 hover:bg-blue-600"
          >
            Next
          </button>
        </div>

        {/* View buttons: Day, Week, Month */}
        <div>
          <button
            onClick={() => setView("day")}
            className="bg-gray-300 text-black px-4 py-1 rounded mr-2 hover:bg-gray-400"
          >
            Day
          </button>
          <button
            onClick={() => setView("week")}
            className="mt-2 bg-gray-300 text-black px-4 py-1 rounded mr-2 hover:bg-gray-400"
          >
            Week
          </button>
          <button
            onClick={() => setView("month")}
            className="mt-2 bg-gray-300 text-black px-4 py-1 rounded hover:bg-gray-400"
          >
            Month
          </button>
        </div>
      </div>
    </>
  );
};