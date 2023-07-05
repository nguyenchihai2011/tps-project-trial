import axios from "axios";
import store from "@/store";

const menuComments = {
  async getComments(content_type, object_id, page_size, page, fields) {
    try {
      const response = await axios.get("/api/comments/", {
        params: {
          content_type,
          object_id,
          page_size,
          page,
          fields,
        },
      });
    } catch (err) {
      console.log(err);
    }
  },
};

export default tableSetting;
