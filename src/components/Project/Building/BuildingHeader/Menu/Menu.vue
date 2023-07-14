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
        <menu-delete></menu-delete>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import MenuComment from "./Comment/Comment.vue";
import MenuCopy from "./Copy/Copy.vue";
import MenuDelete from "./Delete/Delete.vue";
import IconButton from "@/components/Buttons/IconButton.vue";

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
