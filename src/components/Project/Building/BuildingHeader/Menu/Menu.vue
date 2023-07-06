<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on, attrs }">
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
        <menu-comment></menu-comment>
        <menu-copy></menu-copy>

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
import MenuComment from "./Comment/Comment.vue";
import MenuCopy from "./Copy/Copy.vue";
import MenuDelete from "./Delete/Delete.vue";
import IconButton from "@/components/buttons/IconButton.vue";

export default {
  data() {
    return {
      menus: [
        {
          title: "Copy to Destination",
          icon: "mdi-arrow-down-bold-box-outline",
        },
      ],
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
    MenuComment,
    MenuCopy,
    MenuDelete,
    IconButton,
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
