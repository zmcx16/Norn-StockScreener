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
    return ['', convertIfNecessary(t_arr[1])]
  }
  else if (val.includes('>')) {
    let t_arr = val.split('>')
    return [convertIfNecessary(t_arr[1]), '']
  }
  else if (val.includes('-')){
    let t_arr = val.split('-')
    return [convertIfNecessary(t_arr[0]), convertIfNecessary(t_arr[1])]
  }
  else{ // hoc
    if(val == '0%'){
      return ['', '0']
    }
    else{
      console.error('val is invalid: ' + val)
      return ['', '']
    }
  }
}

function convertIfNecessary(input){
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
