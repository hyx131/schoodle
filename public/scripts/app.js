// $(() => {
//   $.ajax({
//     method: "GET",
//     url: "/api/users"
//   }).done((users) => {
//     for(user of users) {
//       $("<div>").text(user.name).appendTo($("body"));
//     }
//   });;
// });


const createTimeSlots = function(events) {
  let $slot = `
    <p> ${events.date} </P>
    <form>
      <input type='text' id='start_time' placeholder='start time'>
      <input type='text' id='end_time' placeholder='end time'>
    </form>
  `
}
