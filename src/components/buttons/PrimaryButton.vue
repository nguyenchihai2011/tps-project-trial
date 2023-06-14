<template>
  <v-btn
    min-width="100%"
    class="text-capitalize"
    :loading="loading4"
    :disabled="loading4"
    color="info"
    @click="onCreate()"
  >
    {{ text }}
  </v-btn>
</template>

<script>
export default {
  data() {
    return {
      loader: null,
      loading4: false,
    };
  },

  props: {
    text: {
      type: String,
      required: true,
    },
    onCreate: {
      type: Function,
    },
  },

  // watch: {
  //   loader() {
  //     const l = this.loader;
  //     this[l] = !this[l];

  //     setTimeout(() => (this[l] = false), 3000);

  //     this.loader = null;
  //   },
  // },
};
</script>

<style>
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
