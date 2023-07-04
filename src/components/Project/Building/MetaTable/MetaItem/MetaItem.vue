<template>
  <div>
    <v-icon class="table__header__icon"> {{ icon }} </v-icon>
    <span class="table__header__lable">{{ lable }}</span>
    <span class="table__header__data">{{ data }}</span>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      required: true,
    },
    lable: {
      type: String,
      required: true,
    },
    data: {
      type: String,
      required: true,
    },
  },
};
</script>

<style>
.table__header__icon {
  font-size: 16px !important;
  color: #939393;
}

.table__header__lable,
.table__header__data {
  font-size: 14px;
  color: #00000099;
}
.table__header__lable {
  font-weight: 500;
}

.table__header__data {
  margin-right: 16px;
}
</style>
