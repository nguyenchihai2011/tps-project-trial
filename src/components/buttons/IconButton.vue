<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on: onTooltip, attrs: attrsTooltip }">
      <v-btn
        class="building__button"
        v-bind="{ ...attrs, attrsTooltip }"
        v-on="{ ...on, ...onTooltip }"
        @click="handleClick()"
        :disabled="disabled"
        depressed
        fab
      >
        <v-badge dot overlap bordered v-if="badge"
          ><v-icon> {{ icon }} </v-icon></v-badge
        >
        <v-icon v-else> {{ icon }} </v-icon>
      </v-btn>
    </template>
    <span>{{ tooltip }}</span>
  </v-tooltip>
</template>

<script>
export default {
  props: {
    on: {
      type: Object,
      required: true,
    },
    attrs: {
      type: Object,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    tooltip: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    handleClick: {
      type: Function,
      default: () => {},
      required: false,
    },

    badge: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
