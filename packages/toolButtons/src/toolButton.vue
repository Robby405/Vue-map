<template>
  <div class="btn-wrapper">
    <el-button
      @click="handleBtnClick"
      :icon="handleBtnIcon(type)"
      :title="name"
      type="text"
      class="btn-item"
      size="small"
    ></el-button>
  </div>
</template>
<script>
import { setFullExtent, measureLengthOrArea } from "../../sources/js/map";
export default {
  name: "toolButton",
  props: {
    type: {
      type: String,
    },
    name: {
      type: String,
    },
    map: {
      default: null,
    },
    proj: {
      type: String
    }
  },
  data() {
    return {
      iconName: "",
    };
  },
  mounted() {},
  methods: {
    handleBtnIcon(type) {
      switch (type) {
        case "fullExtend":
          return "el-icon-full-screen";
        case "measureLength":
          return "el-icon-arrow-up";
        case 'measureArea':
          return "el-icon-crop"
      }
    },
    handleBtnClick() {
      switch (this.type) {
        case "fullExtend":
          setFullExtent(this.map);
          break;
        case "measureLength":
          measureLengthOrArea(this.map, "LineString", this.proj);
          break;
        case "measureArea":
          measureLengthOrArea(this.map, "Polygon", this.proj);
          break;
      }
    },
  },
};
</script>
<style>
@import url(./../../sources/css/ol.scss);
</style>
<style lang="scss" scoped>
.btn-wrapper + .btn-wrapper {
  margin-left: 10px;
}
.btn-item {
  display: inline-block;
  background: rgba(0, 0, 0, 0.6);
  padding: 6px 6px;
  color: #eee;
  font-size: 20px;
  border-radius: 8px;
}

</style>
