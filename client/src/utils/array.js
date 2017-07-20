export function empty(value) {
  return !(value && value.length);
}

export function pushUnique(arr, value) {
  if (arr.indexOf(value) === -1) arr.push(value)
}
