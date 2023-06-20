<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on: onTooltip, attrs: attrsTooltip }">
      <v-btn
        class="building__button"
        v-bind="{ ...attrs, attrsTooltip }"
        v-on="{ ...on, ...onTooltip }"
        :disabled="disabled"
        depressed
        fab
      >
        <v-badge dot overlap v-if="badge"
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
    badge: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
