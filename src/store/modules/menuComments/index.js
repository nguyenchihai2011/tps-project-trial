import menuComments from "@/requestHttp/menuComments";

const state = {
  comments: [],
};

const getters = {
  getComments: (state) => {
    return state.comments;
  },
};

const mutations = {
  setComments: (state, payload) => {
    state.comments = payload;
  },
};

const actions = {
  fetchAPIComments: async ({ commit }, payload) => {
    try {
      const comments = await menuComments.getComments({
        content_type: payload.content_type,
        object_id: payload.object_id,
        page_size: payload.page_size,
        page: payload.page,
        fields: payload.fields,
      });
      commit("setComments", comments.results);
    } catch (err) {
      console.log(err);
    }
  },
};

export default { state, getters, mutations, actions };
