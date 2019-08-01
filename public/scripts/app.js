

/*
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
  let arr = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec"
  ];
  let m = "";
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

      $(".time_slots").append(createTimeSlots(dateString));
      $("#start_time").flatpickr({
        inline: true,
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i"
      });

      $("#end_time").flatpickr({
        inline: true,
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i"
      });
    }
  });

});
*/

/************************* Ignore Previouse Codes For Now **************************/


// helper to add more times:

const addSlot = function (i) {
  let slot = `<div>
  <h2>Time ${i}:</h2>
  <label for='start_time'>Start Time:</label>
  <input
  type='text'
  class='start_time'
  name="times[${i}][startTime]"
  placeholder='start time'
  />
  <label for='end_time'>End Time:</label>
  <input
  type='text'
  class='end_time'
  name="times[${i}][endTime]"
  placeholder='end time'
  />
  </div>`;

  return slot;
};


$(document).ready(function() {

  $('#add_time').on("click", function(event) {
    event.preventDefault();
    addTimes();
  })

});

var timesAdded = 0;
const addTimes = function() {
  timesAdded += 1;
  let $slot = $(addSlot(timesAdded));
  $('#add').append($slot);
  flatpickrStyle($slot);
}


const flatpickrStyle = function ($el) {

  $el.find(".start_time").flatpickr({
    altInput: true,
    enableTime: true,
    dateFormat: "Y-m-d H:i",
    "disable": [
      function(date) {
        let today = new Date(); // disable all days previous to current date
          today.setHours(0,0,0,0);
          return (date < today);
      }
    ]
  });

  $el.find(".end_time").flatpickr({
    altInput: true,
    enableTime: true,
    dateFormat: "Y-m-d H:i",
    "disable": [
      function(date) {
        let today = new Date();
          today.setHours(0,0,0,0);
          return (date < today);
      }
    ]
  });

}
/********************************** Add Guest Email ***********************************/

const addEmailSlot = function(i) {
  let mail = `
    <div>
      <input
        type='email'
        class='email_guest'
        name='guestMail[${i}]'
        placeholder='Enter Email Here'
      />
    </div>
  `
  return mail;
}


var mailsAdded = 0;
const addEmail = function() {
  mailsAdded += 1;
  let $mail = $(addEmailSlot(mailsAdded));
  $('#add_mail').append($mail);
}


$(document).ready(function() {

  $('#add_email').on("click", function(event) {
    event.preventDefault();
    addEmail();
  })

});





/*********************************** Add time slot table into events_admin.ejs ***********************************/



// $(document).ready(function() {

// const addSlotTable = function (i) {
//   let checkBoxRow = `
//   <tr>
//     <th>${moment(data[i].start_date_time).format("MM/DD/YY")}</th>
//   </tr>
//   <tr>
//     <td><input type='checkbox' name='${data[i].user_id}'></td>
//   </tr>`;

//   return checkBoxRow;
// };


// const addTimeTable = function(data) {
//   for (let i = 0; i < data.length; i++) {
//     let $checkBoxRow = $(addSlotTable(i));
//     $('#add_slot_table').append($checkBoxRow);
//   }
// }




// });

