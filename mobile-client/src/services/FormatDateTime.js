
// format date to statify the express validtor
const formatDate = (datetime) => {
      
  var dateobj = new Date(datetime);
  function pad(n) {
    return n < 10 ? "0"+n : n;
  }
  
  var date = pad(dateobj.getFullYear()+"-"+ pad(dateobj.getMonth() + 1)+"-" + pad(dateobj.getDate()));

  var time = pad(pad(dateobj.getUTCHours()) + ":" + pad(dateobj.getUTCMinutes()) + ":" + pad(dateobj.getUTCSeconds()))

  return (date + " " + time);
};

export default formatDate;