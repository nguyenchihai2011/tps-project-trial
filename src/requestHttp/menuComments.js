import axios from "axios";

const menuComments = {
  async getComments(params) {
    const response = await axios.get("/api/comments/", {
      params,
    });
    return response.data;
  },

  async createComment(payload) {
    const response = await axios.post("/api/comments/", payload);
  },

  async updateComment(idComment, payload) {
    const response = await axios.patch(`/api/comments/${idComment}/`, payload);
  },

  async deleteComment(idComment) {
    const response = await axios.delete(`/api/comments/${idComment}/`);
  },
};

export default menuComments;
