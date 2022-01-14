import { createStore } from "vuex";
import axios from "axios";

export default createStore({
  state: {
    forks: [],
    totalForks: 0,
    loading: false,
    error: null,
    favorite: JSON.parse(localStorage.getItem("favorite")) ?? [],
  },
  mutations: {
    SET_FORKS(state, payload) {
      state.forks = payload;
    },
    SET_TOTAL_FORKS(state, payload) {
      state.totalForks = payload;
    },
    SET_LOADING(state, payload) {
      state.loading = payload;
    },
    SET_ERROR(state, payload) {
      state.error = payload;
    },
    ADD_TO_FAVORITE(state, payload) {
      state.favorite.push(payload);
      localStorage.setItem("favorite", JSON.stringify(state.favorite));
    },
    REMOVE_FROM_FAVORITE(state, payload) {
      state.favorite.splice(
        state.favorite.findIndex((item) => item == payload),
        1
      );
      localStorage.setItem("favorite", JSON.stringify(state.favorite));
    },
  },
  actions: {
    fetchTotalForks({ commit }, { owner, repositoryName }) {
      commit("SET_TOTAL_FORKS", 0);
      axios
        .get(`https://api.github.com/repos/${owner}/${repositoryName}`, {
          headers: {
            Accept: "application/vnd.github.v3+json",
          },
        })
        .then((res) => {
          commit("SET_TOTAL_FORKS", res.data.forks);
        });
    },
    fetchRepoForks(
      { commit, dispatch },
      { owner, repositoryName, page = 1, per_page = 10 }
    ) {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);
      commit("SET_FORKS", []);
      dispatch("fetchTotalForks", {
        owner: owner,
        repositoryName: repositoryName,
      });
      axios
        .get(`https://api.github.com/repos/${owner}/${repositoryName}/forks`, {
          headers: {
            Accept: "application/vnd.github.v3+json",
          },
          params: {
            page,
            per_page,
          },
        })
        .then((res) => {
          commit("SET_FORKS", res.data);
        })
        .catch((e) => {
          commit("SET_ERROR", e.response);
        })
        .finally(() => {
          commit("SET_LOADING", false);
        });
    },
  },
});
