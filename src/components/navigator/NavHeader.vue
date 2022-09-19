<template>
    <div class="header__group">
        <div class="header__mark">
            <router-link to="/welcome">
                <img src="../../assets/settings.png" alt="">
            </router-link>
            <span>电商后台管理系统</span>
        </div>
        <div class="menu__control">
            <Expand v-show="isExpand" v-on:click="changeExpand" class="icon-control" style="width: 1em; height: 1em; margin-right: 8px" />
            <Fold v-show="!isExpand" v-on:click="changeExpand" class="icon-control" style="width: 1em; height: 1em; margin-right: 8px" />
        </div>
    </div>
    <el-button v-on:click="logout" type="info">退出</el-button>
</template>

<script lang="ts" setup>
import localCache from '../../utils/cache';
import { useRouter} from 'vue-router'
import { Expand, Fold } from '@element-plus/icons-vue'
import { loginStore } from '@/store/login'
import { storeToRefs } from 'pinia'

const store = loginStore()
const { isExpand } = storeToRefs(store)

const router = useRouter()

const logout = function() {
  localCache.clearCache();
  router.push('/login');
};

const changeExpand = function() {
    store.isExpand = !store.isExpand;
}

</script>

<style lang="less" scoped>
.header__group{
    display: flex;
    justify-content: space-evenly;
    align-items: center;
}

.header__mark {
    display: flex;
    align-items: center;
    span{
      margin-left: 15px;
    }
}

img {
    height: 40px;
    width: 40px;
    cursor: pointer;
}

.menu__control{
    margin-left: 10px;
    margin-top: 5px;
    .icon-control{
        cursor: pointer;
    }
}
</style>