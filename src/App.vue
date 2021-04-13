<template>
  <!-- <button @click="toggleModalState">Open modal</button> -->
  <!-- <v-message :message="aaaa"></v-message>
  <teleport to="#modal-wrapper">
    <modal v-if="modalOpen" @click="toggleModalState">
      <p>Hello, I'm a modal window.</p>
    </modal>
  </teleport> -->
  <MapLoad layerPointType="security" />
</template>

<script>
import { ref } from "vue";
// import Modal from "./components/Modal";
import MapLoad from "./components/MapLoad";
export default {
  name: "App",
  components: {
    // Modal,
    MapLoad,
  },
  emits: ["close"],
  // data: () => ({
  //   modalOpen: true
  // }),
  // methods: {
  //   toggleModalState() {
  //     this.modalOpen = !this.modalOpen;
  //   }
  // }
  setup() {
    const modalOpen = ref(false);
    const toggleModalState = () => {
      modalOpen.value = !modalOpen.value;
    };
    return {
      modalOpen,
      toggleModalState,
    };
  },
  mounted() {

  },
};
</script>

<style>
body,
html {
  margin: 0;
  padding: 0;
}
html {
  position: relative;
  width: 100%;
  height: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.modal {
  position: absolute;
  z-index: 2;
  width: 100%;
  height: 100%;
  top: 0%;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.2);
}
</style>
