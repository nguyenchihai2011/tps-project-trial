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
      <v-list-item v-for="(item, index) in menus" :key="index">
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import IconButton from "@/components/buttons/IconButton.vue";
export default {
  data() {
    return {
      menus: [
        { title: "Comment" },
        { title: "Copy (Clone)" },
        { title: "Copy to Destination" },
        { title: "Permanently Delete" },
        { title: "Print" },
        { title: "Export Table" },
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
    IconButton,
  },
};
</script>
