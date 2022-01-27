/*
  Pretty self explanitory. I needed a way to get the current time
  and display it in a readable format. So I used my Google super
  power and found this on StackOverFlow.
*/
export function getCurrentDate(separator = '/') {
  let newDate = new Date();
  let date = newDate.getDate();
  let month = newDate.getMonth() + 1;
  let year = newDate.getFullYear();

  return `${date}${separator}${
    month < 10 ? `0${month}` : `${month}`
  }${separator}${year}`;
}
