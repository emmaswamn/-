<template>
    <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>数据统计</el-breadcrumb-item>
        <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card id="main">
        
    </el-card>
</template>

<script lang="ts" setup>
import { ArrowRight, Edit, Location, Search } from '@element-plus/icons-vue'
import { init } from './charthook/useEcharts'
import { onMounted} from 'vue';


onMounted(() => {
  init()
});

</script>

<style lang="less" scoped>
#main {
    margin-top: 30px;
    height: 400px;
    text-align: center;
    h1 {
        margin-top: 40px;
    }
}
</style>
