/*
  A function to determine the amount of time a job has been posted
*/
export function timeDifference(jobListingDate) {
  // To set two dates to two variables
  var date1 = new Date(jobListingDate);
  var date2 = new Date();

  // To calculate the time difference of two dates
  var Difference_In_Time = date2.getTime() - date1.getTime();

  // To calculate the no. of days between two dates
  var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

  if (Difference_In_Days < 1) {
    return 'Today';
  } else if (Math.round(Difference_In_Days) === 1) {
    return 'Yesterday';
  } else {
    return `${Math.round(Difference_In_Days)} days ago`;
  }
}
