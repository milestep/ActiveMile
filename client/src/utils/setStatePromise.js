export function setStatePromise(that, newState) {
  return new Promise((resolve) => {
    that.setState(newState, () => {
      resolve();
    });
  });
}
