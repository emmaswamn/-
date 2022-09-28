<template>
    <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
        <!-- Search area -->
        <el-row :gutter="20">
            <el-col :span="8">
                <el-input
                placeholder="请输入内容"
                v-model="query"
                clearable
                v-on:clear="getOrderList(query)"
                >
                    <template #append>
                        <el-button :icon="Search" v-on:click="getOrderList(query)"/>
                    </template>
                </el-input>
            </el-col>
        </el-row>

        <el-table :data="orders" style="width: 100%" border stripe>
            <el-table-column type="index"/>
            <el-table-column prop="order_number" label="订单编号"/>
            <el-table-column prop="order_price" label="订单价格"/>
            <el-table-column prop="order_pay" label="是否付款">
                <template #default="scope">
                    <el-tag class="ml-2" type="danger" v-if="scope.row.order_pay === '0'">未付款</el-tag>
                    <el-tag class="ml-2" type="success" v-if="scope.row.order_pay === '1'">已付款</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="is_send" label="是否发货"/>
            <el-table-column prop="email" label="订单更新时间">
                <template #default="scope">
                    <div v-time>{{ scope.row.update_time }}</div>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template #default="scope">
                    <el-button type="primary" size="small" :icon="Edit" v-on:click="showEditDialog(scope.row.order_id)"></el-button>
                    <el-button type="success" size="small" :icon="Location" v-on:click="showLocateDialog"></el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
            v-model:currentPage="pageNum"
            v-model:page-size="pageSize"
            :page-sizes="[10, 15, 20, 30]"
            layout="total, sizes, prev, pager, next"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            class="pagination"
        />

        <el-config-provider :locale="locale"></el-config-provider>
    </el-card>

    <el-dialog
        v-model="editDialogVisible"
        title="修改地址"
        width="50%"
        v-on:close="resetForm(addressFormRef)"
    >
        <el-form
            ref="addressFormRef"
            :model="addressForm"
            :rules="addressRules"
            label-width="100px"
        >
            <el-form-item label="省市区/县" prop="address1">
                    <el-cascader
                        v-model="addressForm.address1"
                        :options="cityOptions"
                        :props="cityProps"
                    />
            </el-form-item>
            <el-form-item label="详细地址" prop="address2">
                <el-input v-model="addressForm.address2" />
            </el-form-item>
        </el-form>

        <template #footer>
        <span class="dialog-footer">
            <el-button type="primary" @click="editDialogVisible = false"
            >确认</el-button
            >
            <el-button @click="editDialogVisible = false">取消</el-button>
        </span>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { ArrowRight, Edit, Location, Search } from '@element-plus/icons-vue'
import { ref, onMounted } from 'vue'
import { ordersStore } from '@/store/order'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import type { FormInstance } from 'element-plus'
import axios from 'axios';
import { editDialogVisible, addressFormRef, addressForm, addressRules } from './orderhook/editOrder'

let locale = ref(zhCn);
const store = ordersStore();
const { orders, total } = storeToRefs(store);
const query = ref('');
const pageNum = ref(1);
const pageSize = ref(10);

// Pagination
const handleSizeChange = function(newSize: number) {
    logOrders(pageNum.value, newSize);
    pageSize.value = newSize;
};

const handleCurrentChange = function(newPage: number) {
    logOrders(newPage, pageSize.value);
    pageNum.value = newPage;
};

/*获取数据的url key需要自己到高德地图申请噢*/
const url= `https://restapi.amap.com/v3/config/district?keywords=&subdistrict=3&extensions=base&key=${process.env.VUE_APP_KEY}`;
/*选项列表*/
const cityOptions = ref([]);
/*选项列表格式*/
const cityProps={
    value: 'name',
    label: 'name',
    children: 'districts'
}

const getCity= async function(){
    const res = await axios.get(url);
    cityOptions.value = getTreeData(res.data.districts[0].districts);
};

const getTreeData = function(data: any) {
    // 循环遍历返回的数据
    for (let i = 0; i < data.length; i++) {
        if (data[i].districts.length < 1) {
            // districts若为空数组，则将districts设为undefined
            data[i].districts = undefined;
        } else {
            // districts若不为空数组，则继续 递归调用 本方法
            getTreeData(data[i].districts);
        }
    }
    return data;
};

const showEditDialog = async function() {
    editDialogVisible.value = true;
};

const showLocateDialog = function(){
    ElMessage.warning('查询快递功能尚未开放，敬请期待！')
};

// Reset Userform
const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.resetFields(); 
}

// get Orderlist
const getOrderList = async function (query: string) {
    await logOrders(1, 10, query);
};

const logOrders = async(num = 1, size = 10, query?:string) => {
  try {
    await store.getOrders({ pagenum: num, pagesize: size , query});
    ElMessage.success('获取订单列表成功');
  } catch(err: any) {
    ElMessage.error(`${err.message}`);
  }
};

onMounted(() => {
    logOrders();
    getCity();
})


</script>
