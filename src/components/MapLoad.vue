<template>
  <div class="map-container">
    <div id="map" class="map"></div>
    <aside class="buttons-aside">
      <tool-button type="fullExtent" :map="map" name="复原" :proj="proj" />
      <tool-button type="fullScreen" :map="map" name="全屏" :proj="proj" />
      <tool-button type="measureLength" :map="map" name="测距" :proj="proj" />
      <tool-button type="measureArea" :map="map" name="测面" :proj="proj" />
      <tool-button type="deleteLayer" :map="map" name="清空" :proj="proj" />

    </aside>
  </div>
</template>
<script>
import toolButton from "../../packages/toolButtons/src/toolButton.vue";
import { MapClass } from "../../packages/sources/js/loadMap";

export default {
  components: { toolButton },
  name: "loadMap",
  props: ["layerPointType"],
  data() {
    return {
      loadMap: null,
      map: null,
      proj: "EPSG:4326",
      auth_token: "52b622a111a5b63a7bafff41f4b9c376",
      view: {
        view: {
          projection: "EPSG:4326",
          center: [113.356899, 22.977328],
          zoom: 9,
          minZoom: 4,
        },
      },
    };
  },
  mounted() {
    this.loadMap = new MapClass(
      "map",
      this.layerPointType,
      this.proj,
      this.auth_token,
      this.view
    );
    this.map = this.loadMap ? this.loadMap.map : null;
  },
};
</script>

<style lang="scss" scoped>
.map-container {
  position: relative;
  .map {
    width: 100vw;
    height: 100vh;
  }
  .buttons-aside {
    display: flex;
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 2;
  }
}
</style>
