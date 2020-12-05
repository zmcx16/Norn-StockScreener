export const isFloat = (n) => {
  return Number(n) === n && n % 1 !== 0
}

export const getFromEndVal = (input) =>{

  const val = input
  if (val.includes('Any')) {
    return ['', '']
  }
  else if (val.includes('<')) {
    let t_arr = val.split('<')
    return ['', t_arr[1]]
  }
  else if (val.includes('>')) {
    let t_arr = val.split('>')
    return [t_arr[1], '']
  }
  else {
    let t_arr = val.split('-')
    return [t_arr[0], t_arr[1]]
  }
}