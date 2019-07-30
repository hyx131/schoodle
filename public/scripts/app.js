
// helper function to generate new time slots:
const createTimeSlots = function(date) {

  let $slot = `
  <p>${date}</p>
  <form id='add_slots' action='/events' method='POST'>
  <label for='start_time'>Start Time:</label>
  <input
  type='text'
  id='start_time'
  name="startTime"
  placeholder='start time'
  />
  <label for='end_time'>End Time:</label>
  <input
  type='text'
  id='end_time'
  name="endTime"
  placeholder='end time'
  />
  </form>
  <button>Close</button>`;

  return $slot;
};


// helper function to display month properly:
const getMonth = function(month) {
  let arr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  let m = '';
  for (let i = 0; i < arr.length; i++) {
    if (i === month) {
      m += arr[i];
    }
  }
  return m;
};


// clicking 'onChange' event on calendar then render the 'time_slots' section:
$(document).ready(function() {

  $("#pick_date").flatpickr({
    inline: true,
    onChange: function(selectedDates, dateStr, instance) {
      const date = selectedDates[0].getDate();
      const month = selectedDates[0].getMonth(); //January is 0 not 1
      const year = selectedDates[0].getFullYear();

      const dateString = getMonth(month) + "/" + date + "/" + year;

      $('.time_slots').append(createTimeSlots(dateString));
      $('#start_time').flatpickr({
        inline: true,
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
      });

      $("#end_time").flatpickr({
        inline: true,
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
      });
    },
  })

  $("button").on("click", function() {
    $("#add_slots").remove();
  })
});



