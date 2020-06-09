export const fetchBookData = ({ commit }, id) => {
  commit("setLoading", true);
  fetch("https://archive.org/metadata/" + id)
    .then(function(response) {
      if (response.status !== 200) {
        console.log(
          "Looks like there was a problem. Status Code: " + response.status
        );
        return;
      }
      response.json().then(function(data) {
        commit("setBookData", data);
      });
    })
    .catch(error => {
      commit("setError", error);
    });
};
