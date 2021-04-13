<template>
  <div class="message">
    <el-row>
      <el-col :span="24"
        ><div class="message-row">
          <p class="text">hello {{message}}</p>
          </div
      ></el-col>
      <el-col :span="6">
        <img src="./st.jpg">
      </el-col>
    </el-row>
  </div>
</template>
<script>
import './index.scss'
export default {
  name: 'v-message',
  props: {
    message: String
  }
}
</script>
