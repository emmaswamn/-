<template>
    <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
        <el-row>
            <el-col :span="4">
                <el-button type="primary" v-on:click="showAddDialog">添加分类</el-button>
            </el-col>
        </el-row>

        <el-row class="cate-title">
            <el-col class="cate-title-item" :span="7">
                <p>分类名称</p>
            </el-col>
            <el-col class="cate-title-item" :span="6">
                <p>是否有效</p>
            </el-col>
            <el-col class="cate-title-item" :span="6">
                <p>排序</p>
            </el-col>
            <el-col class="cate-title-item" :span="5">
                <p>操作</p>
            </el-col>
        </el-row>

        <el-tree :data="catelist" :props="defaultProps" node-key="cat_id">
            <template #default="{ data }">
                <el-row>
                    <el-col :span="7">
                        <span>{{data.cat_name}}</span>
                    </el-col>
                    <el-col :span="6">
                        <el-icon v-if="!data.cat_deleted" class="icon-true"><CircleCheckFilled /></el-icon>
                        <el-icon v-else class="icon-false"><CircleCloseFilled /></el-icon>
                    </el-col>
                    <el-col :span="6">
                        <el-tag v-if="data.cat_level === 0">一级</el-tag>
                        <el-tag type="success" v-else-if="data.cat_level === 1">二级</el-tag>
                        <el-tag type="warning" v-else>三级</el-tag>
                    </el-col>
                    <el-col :span="5">
                        <!-- modify -->
                        <el-button type="primary" size="small" :icon="Edit" v-on:click="showEditDialog(data.cat_id, data.cat_name)">编辑</el-button>
                        <!-- delete -->
                        <el-button type="danger" size="small" :icon="Delete" v-on:click="removeCateById(data.cat_id)">删除</el-button>
                    </el-col>
                </el-row>
            </template>
        </el-tree>
    </el-card>

    <el-dialog
        v-model="addDialogVisible"
        title="添加分类"
        width="50%"
        v-on:close="resetAddForm(addCateFormRef)"
    >
        <el-form
            ref="addCateFormRef"
            :model="addCateform"
            :rules="addCateRules"
            label-width="120px"
        >
            <el-form-item label="分类名称：" prop="cat_name">
                <el-input v-model="addCateform.cat_name" />
            </el-form-item>
            <el-form-item label="归属分类：">
                <el-cascader
                    v-model="seletedCate"
                    :options="secCatelist"
                    :props="props"
                    @change="handleChange"
                    clearable
                    show-all-levels
                />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="submitAddForm(addCateFormRef)"
                >确认</el-button
                >
                <el-button @click="addDialogVisible = false">取消</el-button>
            </span>
        </template>
    </el-dialog>

    <el-dialog
        v-model="editDialogVisible"
        title="修改分类"
        width="50%"
        v-on:close="resetAddForm(editCateFormRef)"
    >
        <el-form
            ref="editCateFormRef"
            :model="editCateform"
            :rules="editCateRules"
            label-width="120px"
        >
            <el-form-item label="分类名称：" prop="cat_name">
                <el-input v-model="editCateform.cat_name" />
            </el-form-item>
        </el-form>

        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="submitEditForm(editCateFormRef)"
                >确认</el-button
                >
                <el-button @click="addDialogVisible = false">取消</el-button>
            </span>
        </template>        
    </el-dialog>


</template>

<script lang="ts" setup>
import { ArrowRight, CircleCheckFilled, CircleCloseFilled, Edit, Delete } from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue'
import { categoriesStore } from '@/store/category'
import { storeToRefs } from 'pinia'
import { ElMessage, ElMessageBox } from 'element-plus';
import { addDialogVisible, addCateFormRef, addCateform, addCateRules } from './catehook/addCate'
import { editDialogVisible, editCateFormRef, editCateform, editCateRules } from './catehook/editCate'
import type { FormInstance } from 'element-plus'

const store = categoriesStore();
const { catelist, secCatelist } = storeToRefs(store);

const defaultProps = {
  children: 'children',
  label: 'cat_name'
}

const props = {
  expandTrigger: 'hover',
  value: 'cat_id',
  label: 'cat_name',
  children: 'children',
  checkStrictly: true
}

// Reset Userform
const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.resetFields(); 
}

const resetAddForm = (formEl: FormInstance | undefined) => {
    resetForm(formEl);
    seletedCate.value = [];
    addCateform.cat_pid = 0;
    addCateform.cat_level = 0;
}

// Add Cate
const seletedCate = ref([]);

// 1) show dialog
const  showAddDialog = async function () {
    addDialogVisible.value = true;
    logCate(2);
    // console.log(secCatelist);
}

// 2) save form item value
const handleChange = function() {
    if (seletedCate.value?.length > 0) {
        addCateform.cat_pid = seletedCate.value.slice(-1)[0];
        addCateform.cat_level = seletedCate.value.length;
        return;
    }
    addCateform.cat_pid = 0;
    addCateform.cat_level = 0;
};

// 3) submit form
const submitAddForm =  async function (formEl: FormInstance | undefined) {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            // console.log(addCateform);
            store.addCategories({...addCateform})
                .then(() => {
                    ElMessage.success('创建分类成功');
                    logCate(3,1,5);
                    addDialogVisible.value = false;
                })
                .catch(err => ElMessage.error(`${err.message}`));
        } else {
            ElMessage.error('请正确填写表单！');
        }
    })
};

// Edit Cate
const showEditDialog = function(id: number, name:string) {
    editCateform.cat_id = id;
    editCateform.cat_name = name;
    // console.log(id,name);
    editDialogVisible.value = true;
};

const submitEditForm = async function (formEl: FormInstance | undefined) {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            // console.log(editCateform);
            store.editCategories({id:editCateform.cat_id, name:editCateform.cat_name })
                .then(() => {
                    ElMessage.success('修改分类成功');
                    logCate(3,1,5);
                    addDialogVisible.value = false;
                })
                .catch(err => ElMessage.error(`${err.message}`));
        } else {
            ElMessage.error('请正确填写表单！');
        }
    })
}

// Delete Cate
const removeCateById = async function(id: number) {
    const confirmResult = await ElMessageBox.confirm(
        '此操作将永久删除该分类，是否继续？',
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).catch(err => err);

    if (confirmResult !== 'confirm') {
        ElMessage.info('已取消删除！');
        return;
    }
    try {
        await store.deleteCategories(id);
        logCate(3,1,5);
        ElMessage.success('删除分类成功！');
    } catch(err: any) {
        ElMessage.error(`${err.message}`);
    }
};

// Get categories
const logCate = async function (type=3, pagenum?:number, pagesize?:number) {
    try{
        if(pagenum && pagesize) {
            await store.getCatelist({type, pagenum, pagesize});
            ElMessage.success('获取分类列表成功');
            return;
        }
        await store.getCatelist({type});
    } catch (err:any) {
        ElMessage.error(`${err.message}`);
    }
}

onMounted(() => {
  logCate(3,1,31);
})
</script>

<style lang="less" scoped>
.el-tree{
    width: 100%;
    // border-bottom: 1px solid #eee;
    .el-row{
        width: 100%;
        .el-tag{
            margin-left: 8px;
        }
    }
    .icon-true{
        margin-left: 8px;
        filter: invert(65%) sepia(81%) saturate(351%) hue-rotate(85deg) brightness(91%) contrast(87%);
    }
    .icon-false{
        margin-left: 8px;
        filter: invert(50%) sepia(54%) saturate(6980%) hue-rotate(335deg) brightness(111%) contrast(126%);
    }
}

::v-deep .el-tree-node {
    padding: 10px;
    border-bottom: 1px solid #eee;  
}

.cate-title{
    border-bottom: 5px solid rgb(64, 158, 255);
    margin-bottom: 10px;
    margin-top: 20px;
    padding: 10px;
    background-color: #eee;
    .cate-title-item{
        padding-left: 20px;
    }
}
/deep/ .el-cascader{
    width: 100%;
}
</style>