
// format date to statify the express validtor
const formatDatePlus4 = (datetime) => {
  var dateobj = new Date(datetime);
  dateobj = new Date (dateobj.getTime()  + 4 * 60 * 60 * 1000);
  function pad(n) {
    return n < 10 ? "0"+n : n;
  }
  
  var date = pad(dateobj.getUTCFullYear()+"-"+ pad(dateobj.getUTCMonth() + 1)+"-" + pad(dateobj.getUTCDate()));

  var time = pad(pad(dateobj.getUTCHours()) + ":" + pad(dateobj.getUTCMinutes()) + ":" + pad(dateobj.getUTCSeconds()))

  finalRestul = date + " " + time
  return (finalRestul);
};

const formatDateMinus4 = (datetime) => {
  var dateobj = new Date(datetime);
  dateobj = new Date (dateobj.getTime()  - 4 * 60 * 60 * 1000);
  function pad(n) {
    return n < 10 ? "0"+n : n;
  }
  
  var date = pad(dateobj.getUTCFullYear()+"-"+ pad(dateobj.getUTCMonth() + 1)+"-" + pad(dateobj.getUTCDate()));

  var time = pad(pad(dateobj.getUTCHours()) + ":" + pad(dateobj.getUTCMinutes()) + ":" + pad(dateobj.getUTCSeconds()))

  finalRestul = date + " " + time
  return (finalRestul);
};



// format date to statify the express validtor
const formatDateNetural = (datetime) => {
      
  var dateobj = new Date(datetime);
  function pad(n) {
    return n < 10 ? "0"+n : n;
  }
  
  var date = pad(dateobj.getUTCFullYear()+"-"+ pad(dateobj.getUTCMonth() + 1)+"-" + pad(dateobj.getUTCDate()));

  var time = pad(pad(dateobj.getUTCHours()) + ":" + pad(dateobj.getUTCMinutes()) + ":" + pad(dateobj.getUTCSeconds()))

  return (date + " " + time);
};

export  {formatDateMinus4, formatDatePlus4, formatDateNetural};