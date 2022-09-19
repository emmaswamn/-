<template>
    <!-- menu -->
    <el-menu
    active-text-color="#409BFF"
    background-color="#333744"
    text-color="#fff"
    unique-opened
    v-bind:collapse="isExpand"
    v-bind:collapse-transition="false"
    v-bind:router="true"
    v-bind:default-active="activePath"
    >
        <el-sub-menu v-bind:index="menu.id + ''" v-for="menu in menus" v-bind:key="menu.id">
            <template #title>
                <UserFilled
                    style="width: 1em; height: 1em; margin-right: 8px"
                    v-if="menu.authName === '用户管理'"
                />
                <DocumentCopy
                    style="width: 1em; height: 1em; margin-right: 8px"
                    v-else-if="menu.authName === '订单管理'"
                />
                <Goods
                    style="width: 1em; height: 1em; margin-right: 8px"
                    v-else-if="menu.authName === '商品管理'"
                />
                <Box
                    style="width: 1em; height: 1em; margin-right: 8px"
                    v-else-if="menu.authName === '权限管理'"
                />
                <TrendCharts
                    style="width: 1em; height: 1em; margin-right: 8px"
                    v-else-if="menu.authName === '数据统计'"
                />
                <span>{{menu.authName}}</span>
            </template>
            <el-menu-item v-bind:index="'/' + subMenu.path" v-for="subMenu in menu.children"
            v-on:click="saveNavState('/' + subMenu.path)"
            v-bind:key="subMenu.id">
                <template #title>
                    <span>{{subMenu.authName}}</span>
                </template>
            </el-menu-item>
        </el-sub-menu>
    </el-menu>
</template>

<script lang="ts" setup>
import { UserFilled, DocumentCopy, Goods, Box, TrendCharts } from '@element-plus/icons-vue'
import { loginStore } from '@/store/login'
import { storeToRefs } from 'pinia'
import localCache from '../../utils/cache'

const store = loginStore()
const { menus, isExpand, activePath} = storeToRefs(store)

const saveNavState = function(path: string): void{
    localCache.setCache('activePath', path);
    store.activePath = path;
}

</script>

<style lang="less" scoped>
.el-menu{
    border-right: none;
}
</style>