export default function extractPropertyFromObject(objects, prop) {
  let res = {};

  for (let obj in objects) {
    if (objects.hasOwnProperty(obj)) {
      res[obj] = objects[obj][prop];
    }
  }

  return res;
}
