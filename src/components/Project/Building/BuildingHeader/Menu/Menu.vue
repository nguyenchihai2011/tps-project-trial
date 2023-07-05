<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on, attrs }">
      <!-- <icon-button :on="on" :attrs="attrs" :icon="icon" :tooltip="tooltip" /> -->
      <v-tooltip bottom>
        <template v-slot:activator="{ on: onTooltip, attrs: attrsTooltip }">
          <v-btn
            class="building__button"
            depressed
            fab
            v-bind="{ ...attrs, ...attrsTooltip }"
            v-on="{ ...on, ...onTooltip }"
          >
            <v-icon> {{ icon }}</v-icon>
          </v-btn>
        </template>
        <span>{{ tooltip }}</span>
      </v-tooltip>
    </template>
    <v-list>
      <v-list-item class="d-block">
        <v-dialog v-model="dialog" persistent max-width="500">
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
                :disabled="getSelectedBuildingLength !== 1"
                ><v-list-item-icon>
                  <v-badge
                    dot
                    overlap
                    bordered
                    v-if="
                      getSelectedBuildingLength === 1 && getComments.length > 0
                    "
                  >
                    <v-icon>mdi-message-reply-text</v-icon>
                  </v-badge>
                  <v-icon v-else>mdi-message-reply-text</v-icon>
                </v-list-item-icon>
                <v-list-item-content> Comment </v-list-item-content></v-btn
              >
            </div>
          </template>
          <v-card>
            <v-card-title class="text-h5"> Comments for 1 </v-card-title>
            <v-card-text class="menu__comment__list">
              <v-card-text
                v-for="comment in getComments"
                :key="comment.id"
                class="d-flex justify-space-between"
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
                      <span>{{ comment.text }}</span>
                    </div>
                    <div>
                      <span>{{ comment.modified_at | transformDate }}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <v-btn text min-width="36px" class="px-0"
                    ><v-icon>mdi-pencil</v-icon></v-btn
                  >
                  <v-btn text min-width="36px" class="px-0"
                    ><v-icon>mdi-delete</v-icon></v-btn
                  >
                </div>
              </v-card-text>
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

              <v-btn min-width="120px" color="darken-1" @click="dialog = false">
                Close
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <div>
          <v-btn
            text
            class="px-0 text-capitalize"
            height="48px"
            color="rgba(0,0,0,0.6)"
          >
            <v-list-item-icon>
              <v-icon>mdi-content-copy</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Copy (Clone)</v-list-item-title>
            </v-list-item-content>
          </v-btn>
        </div>

        <div>
          <v-btn
            text
            class="px-0 text-capitalize"
            height="48px"
            color="rgba(0,0,0,0.6)"
          >
            <v-list-item-icon>
              <v-icon>mdi-arrow-down-bold-box-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Copy to Destination</v-list-item-title>
            </v-list-item-content>
          </v-btn>
        </div>

        <menu-delete></menu-delete>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import MenuDelete from "./Delete/Delete.vue";
import IconButton from "@/components/buttons/IconButton.vue";
import { mapActions, mapGetters } from "vuex";
import axios from "axios";
export default {
  data() {
    return {
      textContent: "",
      menus: [
        { title: "Comment", icon: "mdi-message-reply-text" },
        { title: "Copy (Clone)", icon: "mdi-content-copy" },
        {
          title: "Copy to Destination",
          icon: "mdi-arrow-down-bold-box-outline",
        },
        { title: "Permanently Delete", icon: "mdi-delete" },
        { title: "Print", icon: "mdi-printer" },
        { title: "Export Table", icon: "mdi-file-export" },
      ],
      dialog: false,
    };
  },
  props: {
    icon: {
      type: String,
      required: true,
    },
    tooltip: {
      type: String,
      required: true,
    },
  },

  components: {
    MenuDelete,
    IconButton,
  },

  computed: {
    ...mapGetters([
      "getSelectedBuildingLength",
      "getSelectedBuilding",
      "getComments",
    ]),
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
    ...mapActions([
      "fetchAPIBuildingsColumns",
      "fetchAPIBuildings",
      "fetchAPITableSettings",
    ]),

    async handleSubmitComment() {
      try {
        const response = await axios.post("/api/comments/", {
          content_type: "building",
          object_id: this.getSelectedBuilding[0],
          text: this.textContent,
        });
        this.textContent = "";
        this.fetchAPIBuildingsColumns();
        const query = this.$route.query;
        this.fetchAPIBuildings({
          page: query.page,
          page_size: query.pageSize,
          sortBy: query.sortBy,
          desc: query.desc,
          building_type: query.building_type,
        });
        this.fetchAPITableSettings();
        this.dialog = false;
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style>
.menu__item {
  display: flex;
}

.menu__comment__list {
  height: 400px;
  overflow-y: auto;
}

.comment__item__content {
  width: 240px;
}
</style>
