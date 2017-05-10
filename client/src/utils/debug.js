export function debug() {
  return process.env.NODE_ENV === 'development' ? true : false;
}
