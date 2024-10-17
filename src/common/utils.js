export function getUrl() {
  let href = 'https://norn-stockscreener.zmcx16.moe/'
  if (typeof window !== 'undefined') {
    href = window.location.href
  }
  return href
}

export const isFloat = (n) => {
  return Number(n) === n && n % 1 !== 0
}

export const isNumeric = (n) => {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

export const convertKMBT = (n, precision) => {
  if (n < 1e3) return n;
  if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(precision) + "K";
  if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(precision) + "M";
  if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(precision) + "B";
  if (n >= 1e12) return +(n / 1e12).toFixed(precision) + "T";
}

export const getFromEndVal = (input) =>{

  const val = input
  if (val.includes('Any')) {
    return ['', '']
  }
  else if (val.includes('<')) {
    let t_arr = val.split('<')
    return ['', convertFromSelect2Input(t_arr[1])]
  }
  else if (val.includes('>')) {
    let t_arr = val.split('>')
    return [convertFromSelect2Input(t_arr[1]), '']
  }
  else if (val.includes(' ~ ')){
    let t_arr = val.split(' ~ ')
    return [convertFromSelect2Input(t_arr[0]), convertFromSelect2Input(t_arr[1])]
  }
  else{ // hoc
    if(val === '0%'){
      return ['', '0']
    }
    else{
      console.error('val is invalid: ' + val)
      return ['', '']
    }
  }
}


// ref: https://www.colorhexa.com/ff0000
export function getRedLevel (val){
  if (val >= 6.0 / 7.0) {
    return '#b30000'
  } else if (val >= 5.0 / 7.0) {
    return '#cc0000'
  } else if (val >= 4.0 / 7.0) {
    return '#e60000'
  } else if (val >= 3.0 / 7.0) {
    return '#ff0000'
  } else if (val >= 2.0 / 7.0) {
    return '#ff1a1a'
  } else if (val >= 1.0 / 7.0) {
    return '#ff3333'
  } else {
    return '#ff4d4d'
  } 
}

export function getBlueLevel (val){
  if (val >= 6.0 / 7.0) {
    return '#0000b3'
  } else if (val >= 5.0 / 7.0) {
    return '#0000cc'
  } else if (val >= 4.0 / 7.0) {
    return '#0000e6'
  } else if (val >= 3.0 / 7.0) {
    return '#0000ff'
  } else if (val >= 2.0 / 7.0) {
    return '#1a1aff'
  } else if (val >= 1.0 / 7.0) {
    return '#3333ff'
  } else {
    return '#4d4dff'
  } 
}


export function workdayCount(start,end) {
  var first = start.clone().endOf('week'); // end of first week
  var last = end.clone().startOf('week'); // start of last week
  var days = last.diff(first,'days') * 5 / 7; // this will always multiply of 7
  var wfirst = first.day() - start.day(); // check first week
  if(start.day() == 0) --wfirst; // -1 if start with sunday 
  var wlast = end.day() - last.day(); // check last week
  if(end.day() == 6) --wlast; // -1 if end with saturday
  return wfirst + Math.floor(days) + wlast; // get the total
} //              ^ EDIT: if days count less than 7 so no decimal point

function convertFromSelect2Input (input){
  // $50 mln -> 50
  // $50 bln -> 50000
  // $50 tln -> 50000000
  // 1.27% -> 1.27
  let data = input
  if (data.includes('$')) {
    data = data.replace('$', '')
  }
  if (data.includes('%')) {
    data = data.replace('%', '')
  }

  if (data.includes('mln')) {
    data = data.replace('mln', '')
    return data
  }
  else if (data.includes('bln')) {
    data = data.replace('bln', '')
    return (data * 1000).toString()
  } 
  else if(data.includes('tln')) {
    data = data.replace('tln', '')
    return (data * 1000 * 1000).toString()
  }

  return data
}

export function NavZhEnUrl(zhUrl, enUrl) {
  return (typeof window !== 'undefined' && navigator.language.includes('zh')) ? zhUrl : enUrl
}

export function IsValidDateYYYYDashMMDashDD(dateString) {
  var regEx = /^\d{4}-\d{2}-\d{2}$/;
  if(!dateString.match(regEx)) return false;  // Invalid format
  var d = new Date(dateString);
  var dNum = d.getTime();
  if(!dNum && dNum !== 0) return false; // NaN value, Invalid date
  return d.toISOString().slice(0,10) === dateString;
}