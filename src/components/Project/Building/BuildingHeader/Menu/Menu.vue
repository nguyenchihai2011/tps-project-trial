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
                ><v-list-item-icon>
                  <v-icon>mdi-message-reply-text</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Comment</v-list-item-title>
                </v-list-item-content></v-btn
              >
            </div>
          </template>
          <v-card>
            <v-card-title class="text-h5"> Comments for 1 </v-card-title>
            <v-card-text class="menu__comment__list">
              <v-card-text class="d-flex justify-space-between">
                <div class="d-flex">
                  <v-avatar color="rgb(225, 6, 0)" size="48">
                    <span class="white--text text-h5">L</span>
                  </v-avatar>
                  <div class="ml-5 comment__item__content">
                    <div>
                      <span>Local Development :</span> <span>comment</span>
                    </div>
                    <div>
                      <span>2023-07-03 03:48:11 pm</span>
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
              <v-card-text class="d-flex justify-space-between">
                <div class="d-flex">
                  <v-avatar color="rgb(225, 6, 0)" size="48">
                    <span class="white--text text-h5">L</span>
                  </v-avatar>
                  <div class="ml-5 comment__item__content">
                    <div>
                      <span>Local Development :</span>
                      <span class="d-block" style="width: 100%"
                        >aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</span
                      >
                    </div>
                    <div>
                      <span>2023-07-03 03:48:11 pm</span>
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
              <v-card-text class="d-flex justify-space-between">
                <div class="d-flex">
                  <v-avatar color="rgb(225, 6, 0)" size="48">
                    <span class="white--text text-h5">L</span>
                  </v-avatar>
                  <div class="ml-5 comment__item__content">
                    <div>
                      <span>Local Development :</span>
                      <span class="d-block" style="width: 100%"
                        >aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</span
                      >
                    </div>
                    <div>
                      <span>2023-07-03 03:48:11 pm</span>
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

        <v-dialog v-model="dialogDelete" persistent max-width="40vw">
          <template v-slot:activator="{ on, attrs }">
            <div>
              <v-btn
                text
                class="px-0 text-capitalize"
                v-bind="attrs"
                v-on="on"
                height="48px"
                color="rgba(0,0,0,0.6)"
                :disabled="getSelectedBuildingLength < 1"
              >
                <v-list-item-icon>
                  <v-icon>mdi-delete</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Permanently Delete</v-list-item-title>
                </v-list-item-content>
              </v-btn>
            </div>
          </template>
          <v-card>
            <v-card-title class="text-h5">
              Permanently Delete Building
            </v-card-title>
            <v-card-text
              ><p>
                You are about to PERMANENTLY delete 1 building. If any items in
                this building are assigned to a request approval, both items and
                requests will be deleted and CANNOT be recovered. Do you want to
                continue?
              </p>
              <p class="mb-0">
                If not, click "Redact" for a recoverable selection.
              </p></v-card-text
            >
            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn
                color="primary"
                outlined
                @click="dialogDelete = false"
                class="text-capitalize"
              >
                No, Cancel
              </v-btn>

              <v-btn
                color="primary"
                @click="handleRedacted()"
                class="text-capitalize"
              >
                Redact
              </v-btn>

              <v-btn
                color="error"
                @click="handleDelete()"
                class="text-capitalize"
              >
                Yes, Permanently Delete
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import IconButton from "@/components/buttons/IconButton.vue";
import { mapActions, mapGetters, mapMutations } from "vuex";
import axios from "axios";
export default {
  inject: ["getSnackbar", "setSnackbar"],

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
      dialogDelete: false,
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
    IconButton,
  },

  computed: {
    ...mapGetters(["getSelectedBuildingLength", "getSelectedBuilding"]),
  },

  methods: {
    ...mapMutations(["setSelectedBuilding"]),
    ...mapActions([
      "fetchAPIBuildingsColumns",
      "fetchAPIBuildings",
      "fetchAPITableSettings",
    ]),
    async handleDelete() {
      const response = await axios.delete(
        "/api/buildings/bulk/",
        {
          data: { ids: this.getSelectedBuilding },
        },
        {
          headers: {
            "x-camelcase": 1,
          },
        }
      );

      this.setSnackbar(
        true,
        "Successful! Your buildings has been deleted.",
        "success",
        5000
      );
      this.setSelectedBuilding([]);
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
      this.dialogDelete = false;
    },

    async handleRedacted() {
      const response = await axios.patch(
        "/api/buildings/bulk/",
        {
          change_note: null,
          ids: this.getSelectedBuilding,
          project_ids: "75ea5a2e-e123-40df-a8c4-bf65386dba16",
          state: "REDACTED",
        },
        {
          headers: {
            "x-camelcase": 1,
          },
        }
      );
      this.setSnackbar(
        true,
        "Successful! Your buildings has been redacted.",
        "success",
        5000
      );
      this.dialogDelete = false;
      this.setSelectedBuilding([]);
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
    },

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
