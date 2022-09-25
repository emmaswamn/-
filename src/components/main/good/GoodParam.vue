<template>
    <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
        <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" v-bind:closable="false" show-icon/>
        <el-row class="cat_opt">
            <el-col>
                <span>选择商品分类： </span>
                <el-cascader
                    v-model="seletedCate"
                    :options="catelist"
                    :props="props"
                    @change="handleChange"
                    clearable
                    show-all-levels
                />
            </el-col>
        </el-row>

        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleTabClick">
            <el-tab-pane label="动态参数" name="many">
                <el-button type="primary" :disabled="isDisabled" v-on:click="showAddDialog">添加参数</el-button>

                <el-table :data="manyTable" style="width: 100%" border stripe row-key="attr_id">
                    <el-table-column type="expand">
                        <template #default="props">
                            <el-tag v-for="(val, index) in props.row.attr_vals" v-bind:key="index" closable v-on:close="handleClose(index, props.row)">{{val}}</el-tag>
                            <el-input
                                v-if="props.row.inputVisible"
                                ref="InputRef"
                                v-model="props.row.inputValue"
                                class="ml-1 w-20"
                                size="small"
                                @keyup.enter="handleInputConfirm(props.row)"
                                @blur="handleInputConfirm(props.row)"
                            />
                            <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput(props.row)">
                                + New Tag
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column type="index"/>
                    <el-table-column prop="attr_name" label="参数名称"/>
                    <el-table-column label="操作">
                        <template #default="scope">
                            <!-- modify -->
                            <el-button type="primary" size="small" :icon="Edit" v-on:click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                            <!-- delete -->
                            <el-button type="danger" size="small" :icon="Delete" v-on:click="removeAttr(scope.row.attr_id)" >删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>

            <el-tab-pane label="静态属性" name="only">
                <el-button type="primary" :disabled="isDisabled" v-on:click="showAddDialog(false)">添加属性</el-button>

                <el-table :data="onlyTable" style="width: 100%" border stripe row-key="attr_id">
                    <el-table-column type="expand">
                        <template #default="props">
                            <el-tag v-for="(val, index) in props.row.attr_vals" v-bind:key="index" closable v-on:close="handleClose(index, props.row)">{{val}}</el-tag>
                            <el-input
                                v-if="props.row.inputVisible"
                                ref="InputRef"
                                v-model="props.row.inputValue"
                                class="ml-1 w-20"
                                size="small"
                                @keyup.enter="handleInputConfirm(props.row)"
                                @blur="handleInputConfirm(props.row)"
                            />
                            <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput(props.row)">
                                + New Tag
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column type="index"/>
                    <el-table-column prop="attr_name" label="属性名称"/>
                    <el-table-column label="操作">
                        <template #default="scope">
                            <!-- modify -->
                            <el-button type="primary" size="small" :icon="Edit" v-on:click="showEditDialog(scope.row.attr_id,false)">编辑</el-button>
                            <!-- delete -->
                            <el-button type="danger" size="small" :icon="Delete"  v-on:click="removeAttr(scope.row.attr_id)" >删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>

    </el-card>

    <el-dialog
        v-model="addDialogVisible"
        :title="title"
        width="50%"
        v-on:close="resetForm(addParamFormRef)"
    >
        <el-form
            ref="addParamFormRef"
            :model="addParamform"
            :rules="addParamRules"
            label-width="120px"
        >
            <el-form-item :label="isMany ? '分类名称' : '属性名称'" prop="attr_name">
                <el-input v-model="addParamform.attr_name" />
            </el-form-item>

        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="submitAddForm(addParamFormRef)"
                >确认</el-button
                >
                <el-button @click="addDialogVisible = false">取消</el-button>
            </span>
        </template>
    </el-dialog>

    <el-dialog
        v-model="editDialogVisible"
        :title="title"
        width="50%"
        v-on:close="resetForm(editParamFormRef)"
    >
        <el-form
            ref="editParamFormRef"
            :model="editParamform"
            :rules="editParamRules"
            label-width="120px"
        >
            <el-form-item :label="isMany ? '分类名称' : '属性名称'" prop="attr_name">
                <el-input v-model="editParamform.attr_name" />
            </el-form-item>

        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="submitEditForm(editParamFormRef)"
                >确认</el-button
                >
                <el-button @click="editDialogVisible = false">取消</el-button>
            </span>
        </template>
    </el-dialog>

</template>

<script lang="ts" setup>
import { ArrowRight, Edit, Delete } from '@element-plus/icons-vue'
import { onMounted, ref, computed, nextTick } from 'vue'
import { ElMessage, ElMessageBox, ElInput } from 'element-plus';
import type { TabsPaneContext } from 'element-plus'
import { categoriesStore } from '@/store/category'
import { storeToRefs } from 'pinia'
import type { FormInstance } from 'element-plus'
import { addDialogVisible, addParamFormRef, addParamform, addParamRules } from './paramhook/addParam'
import { editDialogVisible, editParamFormRef, editParamform, editParamRules } from './paramhook/editParam'

const store = categoriesStore();
const { catelist } = storeToRefs(store);

const props = {
  expandTrigger: 'hover',
  value: 'cat_id',
  label: 'cat_name',
  children: 'children'
}

const seletedCate = ref([]);
const activeName = ref('many');
const manyTable = ref([]);
const onlyTable = ref([]);

// Reset Userform
const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.resetFields(); 
}

//////////////////////////////////////////////////
// Get paramslist
const handleChange = async function(){
    getParams();
}

const handleTabClick = function(tab: TabsPaneContext){
    // console.log(tab.props.name);
    getParams(tab.props.name?.toString());
}

const getParams = async function (activename?:string) {
    if (seletedCate.value?.length !== 3) {
        seletedCate.value = [];
        manyTable.value = [];
        onlyTable.value = [];
        return;
    }
    try {
        if(!activename)  activename = activeName.value;
        const result = await store.getCateById({id:selectCatId.value, sel:activename});
        if(activename === 'many') manyTable.value = result;
        if(activename === 'only') onlyTable.value = result;
        ElMessage.success('获取参数列表成功');
        // console.log(catelist);
    } catch (err: any) {
        ElMessage.error(`${err.message}`);
    }    
}

///////////////////////////////////
// Add param
const isMany = ref(true);
const title = computed(function(){
    return `添加${isMany.value ? '动态参数' : '静态属性'}`;
});
const showAddDialog = function (isParam = true) {
    isMany.value = isParam;
    addDialogVisible.value = true;
};

const submitAddForm = async function(formEl: FormInstance | undefined) {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            // console.log(addParamform);
            const id = selectCatId.value;
            const attr_sel = actNAme.value;
            store.addAttrByCatid({id, attr_sel, attr_name:addParamform.attr_name})
                .then(() => {
                    ElMessage.success('添加参数/属性成功');
                    getParams();
                    addDialogVisible.value = false;
                })
                .catch(err => ElMessage.error(`${err.message}`));
        } else {
            console.log('error submit!', fields)
        }
    })
};

// Edit param
const attr_id = ref(0);
const showEditDialog = function(attrid: number, isParam=true) {
    isMany.value = isParam;
    editDialogVisible.value = true;
    attr_id.value = attrid;
};

const submitEditForm = async function(formEl: FormInstance | undefined) {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            // console.log(editParamform);
            const id = selectCatId.value;
            const attr_sel = actNAme.value;
            store.editAttr({id, attrId: attr_id.value,attr_sel, attr_name:editParamform.attr_name})
                .then(() => {
                    ElMessage.success('编辑参数/属性成功');
                    getParams();
                    editDialogVisible.value = false;
                })
                .catch(err => ElMessage.error(`${err.message}`));
        } else {
            console.log('error submit!', fields)
        }
    })
};

////////////////////////////////
// Delete attr

const  removeAttr = async function(attrid: number) {
    // console.log(attrid);
    const confirmResult = await ElMessageBox.confirm(
        '此操作将永久删除该参数/属性，是否继续？',
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
        const id = selectCatId.value;
        await store.deleteAttr(id, attrid);
        getParams();
        ElMessage.success('删除参数/属性成功！');
    } catch(err: any) {
        ElMessage.error(`${err.message}`);
    }
};


const isDisabled = computed(function(){
    return seletedCate.value.length !== 3;
});

const selectCatId = computed(function(){
    return seletedCate.value.slice(-1)[0];
});

const actNAme = computed(function(){
    return isMany.value ? 'many' : 'only';
});

// Get categories
const logCate = async function () {
    try{
        await store.getCatelist({});
        // console.log(catelist);
    } catch (err:any) {
        ElMessage.error(`${err.message}`);
    }
}

// Add and Delete Val

const InputRef = ref<InstanceType<typeof ElInput>>();

const showInput = (row:any) => {
    // console.log(row);
    row.inputVisible = true
    nextTick(() => {
        // console.log(InputRef);
        InputRef.value!.input!.focus();
    })
};

const handleInputConfirm = async(row:any) => {
    if (row.inputValue.trim().length === 0) {
        row.inputVisible = false;
        row.inputValue = '';
        return;
        // dynamicTags.value.push(inputValue.value)
    }
    row.attr_vals.push(row.inputValue.trim());
    const vals = row.attr_vals.join(' ');
    console.log(vals);
    row.inputVisible = false;
    row.inputValue = '';
    try {
        await store.editAttr({id: selectCatId.value,attrId:row.attr_id,attr_name: row.attr_name,attr_sel: row.attr_sel, attr_vals: vals})
    } catch (err:any) {
        ElMessage.error(`${err.message}`);
    }
};

// Delete val
const handleClose = async function(index:number, row:any) {
    row.attr_vals.splice(index,1);
    const vals = row.attr_vals.join(' ');
    try {
        await store.editAttr({id: selectCatId.value,attrId:row.attr_id,attr_name: row.attr_name,attr_sel: row.attr_sel, attr_vals: vals})
    } catch (err:any) {
        ElMessage.error(`${err.message}`);
    }    
};

onMounted(() => {
  logCate();
})
</script>

<style lang="less" scoped>
.cat_opt{
    margin:15px 0;
}

.el-tag{
    margin:10px;
}

.w-20{
    width: 120px;
}

</style>
