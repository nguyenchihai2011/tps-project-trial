<template>
  <v-dialog v-model="dialogComment" persistent max-width="500">
    <template v-slot:activator="{ on, attrs }">
      <div>
        <v-btn
          text
          class="px-0 text-capitalize"
          v-bind="attrs"
          v-on="on"
          height="48px"
          color="rgba(0,0,0,0.6)"
          min-width="100%"
          :disabled="s_quantity_selected_building !== 1"
          ><v-list-item-icon>
            <v-badge
              dot
              overlap
              bordered
              v-if="s_quantity_selected_building === 1 && s_comments.length > 0"
            >
              <v-icon>mdi-message-reply-text</v-icon>
            </v-badge>
            <v-icon v-else>mdi-message-reply-text</v-icon>
          </v-list-item-icon>
          <v-list-item-content> Comment </v-list-item-content></v-btn
        >
      </div>
    </template>
    <v-card style="position: relative">
      <v-card-title class="text-h5">
        Comments for {{ s_selected_building[0]?.name }}
      </v-card-title>

      <v-card-text class="menu__comment__list">
        <v-card
          v-for="comment in s_comments"
          :key="comment.id"
          class="d-flex justify-space-between px-7 py-9 mb-5"
        >
          <div class="d-flex">
            <v-avatar color="rgb(225, 6, 0)" size="48">
              <span class="white--text text-h5">L</span>
            </v-avatar>
            <div class="ml-5 comment__item__content">
              <div>
                <span
                  >{{ comment.created_by.first_name }}
                  {{ comment.created_by.last_name }}:
                </span>
                <v-textarea
                  v-if="isEditComment && idCommentEdit === comment.id"
                  name="input-7-1"
                  label="Change this comment..."
                  v-model="comment.text"
                  @keyup.enter="handleEditComment()"
                  hint="Press Enter to save this comment"
                ></v-textarea>
                <span v-else>{{ comment.text }} <span>(edited)</span></span>
              </div>
              <div>
                <span>{{ comment.modified_at | transformDate }}</span>
              </div>
            </div>
          </div>
          <div class="d-flex">
            <v-btn
              text
              min-width="36px"
              class="px-0"
              @click="handleOpenEditComment(comment.id)"
              ><v-icon>mdi-pencil</v-icon></v-btn
            >
            <v-btn text min-width="36px" class="px-0" @click="snackbar = true"
              ><v-icon>mdi-delete</v-icon></v-btn
            >
            <v-snackbar
              v-model="snackbar"
              min-width="460px"
              top
              elevation="0"
              timeout="-1"
            >
              Are you sure you want to delete this comment?
              <template v-slot:action="{ attrs }">
                <v-btn
                  color="primary"
                  v-bind="attrs"
                  min-width="100%"
                  @click="handleDeleteComment(comment.id)"
                >
                  DELETE
                </v-btn>
              </template>
            </v-snackbar>
          </div>
        </v-card>
      </v-card-text>
      <v-card-text class="menu__content__textarea"
        ><v-textarea
          name="input-7-1"
          filled
          label="Leave a comment..."
          height="108px"
          no-resize
          v-model="textContent"
          @keyup.enter="handleSubmitComment()"
        ></v-textarea
      ></v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn min-width="120px" color="darken-1" @click="closeDialogComment()">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import axios from "axios";
export default {
  data() {
    return {
      textContent: "",
      dialogComment: false,
      snackbar: false,
      idCommentEdit: "",
      isEditComment: false,
    };
  },

  computed: {
    ...mapGetters({
      s_selected_building: "getSelectedBuilding",
      s_selected_building_ids: "getSelectedBuildingIds",
      s_quantity_selected_building: "getQuantitySelectedBuilding",
      s_show_state: "getShowStateBuilding",
      s_comments: "getComments",
    }),
  },

  filters: {
    transformDate: function (value) {
      const date = new Date(value);
      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };
      return (
        date
          .toLocaleString("ja-JP", options)
          .replace(",", "")
          .replaceAll("/", "-") +
        " " +
        (date.getHours() >= 12 ? "pm" : "am")
      );
    },
  },

  methods: {
    ...mapMutations(["setSelectedBuilding"]),
    ...mapActions([
      "fetchAPIBuildings",
      "fetchAPITableSettings",
      "fetchAPIComments",
    ]),

    async handleSubmitComment() {
      try {
        const response = await axios.post("/api/comments/", {
          content_type: "building",
          object_id: this.s_selected_building_ids[0],
          text: this.textContent,
        });
        this.textContent = "";
        this.setSelectedBuilding([]);
        this.fetchAPITableSettings();
        const query = this.$route.query;
        this.fetchAPIBuildings({
          page: query.page,
          page_size: query.pageSize,
          sortBy: query.sortBy,
          desc: query.desc,
          building_type: query.building_type,
          state: this.s_show_state,
        });
        this.dialogComment = false;
      } catch (err) {
        console.log(err);
      }
    },

    closeDialogComment() {
      this.textContent = "";
      this.setSelectedBuilding([]);
      this.fetchAPITableSettings();
      const query = this.$route.query;
      this.fetchAPIBuildings({
        page: query.page,
        page_size: query.pageSize,
        sortBy: query.sortBy,
        desc: query.desc,
        building_type: query.building_type,
        state: this.s_show_state,
      });
      this.dialogComment = false;
    },

    handleOpenEditComment(id) {
      this.idCommentEdit = id;
      this.isEditComment = true;
    },

    handleEditComment() {},

    async handleDeleteComment(idCommentDelete) {
      try {
        const response = await axios.delete(
          `/api/comments/${idCommentDelete}/`
        );
        this.fetchAPIComments({
          content_type: "building",
          object_id: this.s_selected_building_ids[0],
          page_size: 25,
          page: 1,
          fields:
            "id,created_by.email,created_by.first_name,created_by.last_name,text,modified_at,created_at,modified_by.user_id",
        });
        this.snackbar = false;
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style>
.v-snack__wrapper {
  top: 40px;
  height: 64px;
}
</style>
