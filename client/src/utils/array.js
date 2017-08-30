export function empty(value) {
  return !(value && value.length);
}

export function pushUnique(arr, value) {
  if (arr.indexOf(value) === -1) arr.push(value)
}

export function defaultMonths(){
    let arr = Array(12)
      for (var i = arr.length - 1; i >= 0; i--) {
        arr[i] = i
      }
    return arr
}
