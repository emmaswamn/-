<template>
  <div class="common-layout">
    <el-container class="home-container">
      <!-- Header -->
      <el-header>
        <nav-header></nav-header>
      </el-header>
      <el-container>
        <!-- Aside -->
        <el-aside v-bind:width="isExpand ? '64px' :'200px'">
          <nav-menu></nav-menu>
        </el-aside>
        <!-- Main -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import NavHeader from '../components/navigator/NavHeader.vue'
import NavMenu from '../components/navigator/NavMenu.vue'
import { loginStore } from '@/store/login'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const store = loginStore()
const { isExpand } = storeToRefs(store)

const logMenus = async() => {
  try {
    await store.getMenuList();
  } catch(err: any) {
    ElMessage.error(`${err.message}`);
  }
};

onMounted(() => {
  logMenus();
})

</script>

<style lang="less" scoped>
.common-layout {
  height: 100%;
}

.home-container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
}

.el-aside {
  background-color: #333744;
}

.el-main {
  background-color: #eaedf1;
}
</style>