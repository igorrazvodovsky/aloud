export const saveStateLocally = store => {
  store.subscribe((mutation, state) => {
    localStorage.setItem("store", JSON.stringify(state));
  });
};
