<template>
    <div>
        <el-breadcrumb :separator-icon="ArrowRight">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card class="box-card">
            <el-table :data="rights" style="width: 100%" border stripe>
                <el-table-column type="index"/>
                <el-table-column prop="authName" label="权限名称"/>
                <el-table-column prop="path" label="路径"/>
                <el-table-column prop="level" label="权限等级">
                    <template #default="scope">
                        <el-tag v-if="scope.row.level === '0'">一级</el-tag>
                        <el-tag v-else-if="scope.row.level === '1'" type="success">二级</el-tag>
                        <el-tag v-else type="warning">三级</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script lang="ts" setup>
import { ArrowRight } from '@element-plus/icons-vue'
import { onMounted } from 'vue'
import { rightStore } from '@/store/right';
import { storeToRefs } from 'pinia';
import { ElMessage } from 'element-plus'

const store = rightStore();
const { rights } = storeToRefs(store);


const getRights = async function () {
    try {
        await store.getRightsList();
        ElMessage.success('获取权限列表成功');
    } catch (err:any ) {
        ElMessage.error(`${err.message}`);
    }
}

onMounted(() => {
  getRights();
});

</script>


<style lang="less" scoped>

</style>