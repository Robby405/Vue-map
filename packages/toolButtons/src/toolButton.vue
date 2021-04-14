<template>
  <div class="btn-wrapper">
    <el-button
      @click="handleBtnClick"
      :title="name"
      type="text"
      :class="['btn-item', typeName]"
      size="small"
    ></el-button>
  </div>
</template>
<script>
import {
  setFullExtent,
  measureLengthOrArea,
  removeOverlayFromMap,
} from "../../sources/js/map";
import { ElMessage } from "element-plus";
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
      type: String,
    },
  },
  data() {
    return {
      layer: null,
      isFullScreen: false,
      typeName: this.type,
    };
  },
  mounted() {
    const that = this;
    this.iconName = this.handleBtnIcon(this.type);
    //监听退出全屏事件
    window.onresize = function() {
      if (!that.checkFull()) {
        console.log('否')
        //要执行的动作
        this.typeName = "fullScreen";
      }else{
        this.typeName = "exitFullScreen";
      }
    };
  },
  methods: {
    handleBtnIcon(type) {
      switch (type) {
        case "fullExtent":
          return "el-icon-bangzhu";
        case "fullScreen":
          return "el-icon-full-screen";
        case "exitFullScreen":
          return "el-icon-crop";
        case "measureLength":
          return "el-icon-arrow-up";
        case "measureArea":
          return "el-icon-crop";
        case "deleteLayer":
          return "el-icon-delete";
      }
    },
    handleBtnClick() {
      switch (this.type) {
        case "fullExtent":
          setFullExtent(this.map);
          break;
        case "fullScreen":
          if (this.typeName === "fullScreen") {
            this.typeName = "exitFullScreen";
            let elem = document.body;
            if (elem.webkitRequestFullScreen) {
              elem.webkitRequestFullScreen();
            } else if (elem.mozRequestFullScreen) {
              elem.mozRequestFullScreen();
            } else if (elem.requestFullScreen) {
              elem.requestFullscreen();
            } else {
              //不支持全屏
              ElMessage.warning({
                message: "浏览器不支持全屏",
                type: "warning",
              });
              this.iconName = this.handleBtnIcon("fullScreen");
            }
          } else {
            this.typeName = "fullScreen";
            let elem = document;
            if (elem.webkitCancelFullScreen) {
              elem.webkitCancelFullScreen();
            } else if (elem.mozCancelFullScreen) {
              elem.mozCancelFullScreen();
            } else if (elem.cancelFullScreen) {
              elem.cancelFullScreen();
            } else if (elem.exitFullscreen) {
              elem.exitFullscreen();
            } else {
              ElMessage.warning({
                message: "浏览器不支持全屏",
                type: "warning",
              });
            }
          }
          break;
        case "measureLength":
          this.layer = measureLengthOrArea(this.map, "LineString", this.proj);
          break;
        case "measureArea":
          this.layer = measureLengthOrArea(this.map, "Polygon", this.proj);
          break;
        case "deleteLayer":
          removeOverlayFromMap(this.map, this.layer);
          break;
      }
    },
    checkFull() {
      return document.body.scrollHeight === window.screen.height && document.body.scrollWidth === window.screen.width
    },
  },
};
</script>
<style>
@import url(./../../sources/css/ol.scss);
@import url(./../../sources/css/mixin.scss);
</style>
<style lang="scss" scoped>
.btn-wrapper + .btn-wrapper {
  margin-left: 10px;
}
.btn-item {
  display: inline-block;
  background: rgba(0, 0, 0, 0.6);
  background-position: center;
  background-repeat: no-repeat;
  object-fit: cover;
  width: 40px;
  height: 40px;
  padding: 6px 6px;
  color: #eee;
  font-size: 20px;
  border-radius: 8px;
  &.fullExtent {
    background-image: url("../../sources/img/restore.png");
  }
  &.fullScreen {
    background-image: url("../../sources/img/fullScreen.png");
  }
  &.exitFullScreen {
    background-image: url("../../sources/img/exitFullScreen.png");
  }
  &.measureLength {
    background-image: url("../../sources/img/measureLength.png");
  }
  &.measureArea {
    background-image: url("../../sources/img/measureArea.png");
  }
  &.deleteLayer {
    background-image: url("../../sources/img/delete.png");
  }
}
</style>
