<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on: onTooltip, attrs: attrsTooltip }">
      <v-btn
        class="building__button"
        v-bind="{ ...attrs, attrsTooltip }"
        v-on="{ ...on, ...onTooltip }"
        depressed
        fab
      >
        <v-icon> {{ icon }} </v-icon>
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
  },
};
</script>
