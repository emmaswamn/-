<template>
    <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
        <!-- Search area -->
        <el-row :gutter="20">
            <el-col :span="8">
                <el-input
                placeholder="请输入内容"
                v-model="query"
                clearable
                v-on:clear="getGoodList(query)"
                >
                    <template #append>
                        <el-button :icon="Search" v-on:click="getGoodList(query)"/>
                    </template>
                </el-input>
            </el-col>
            <el-col :span="4">
                <el-button type="primary" v-on:click="drawer = true">添加商品</el-button>
            </el-col>
        </el-row>

        <!-- GoodList area -->
        <el-table :data="goodlist" style="width: 100%" border stripe>
            <el-table-column type="index"/>
            <el-table-column prop="goods_name" label="商品名称"/>
            <el-table-column prop="goods_price" label="商品价格(元)" width="95px"/>
            <el-table-column prop="goods_weight" label="商品重量" width="70px"/>
            <el-table-column label="操作" width="180px">
                <template #default="scope">
                    <!-- modify -->
                    <el-button type="primary" size="small" :icon="Edit"></el-button>
                    <!-- delete -->
                    <el-button type="danger" size="small" :icon="Delete" v-on:click="removeGoodById(scope.row.goods_id)"></el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- pagination area -->
        <el-pagination
            v-model:currentPage="pageNum"
            v-model:page-size="pageSize"
            :page-sizes="[10,50,100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />

        <el-drawer
            v-model="drawer"
            title="添加商品"
            direction="rtl"
            size="70%"
            :before-close="handleClose"
        >
            <div class="content">
                <div class="form">
                    <el-steps :space="200" :active="activeIndex - 0" align-center>
                        <el-step title="基本信息" />
                        <el-step title="商品参数" />
                        <el-step title="商品属性" />
                        <el-step title="商品图片" />
                        <el-step title="商品内容" />
                        <el-step title="完成" />
                    </el-steps>
                    <el-form
                        :inline="true"
                        :model="addGoodform"
                        :rules="addGoodRules"
                        label-position="top"
                        ref="addGoodFormRef"
                    >
                        <el-tabs tab-position="left" v-model="activeIndex" :before-leave="beforeLeave" v-on:tab-click="tabClicked">
                            <el-tab-pane label="基本信息" name="0">
                                <el-form-item label="商品名称" prop="goods_name">
                                    <el-input v-model="addGoodform.goods_name" />
                                </el-form-item>
                                <el-form-item label="商品价格" prop="goods_price">
                                    <el-input v-model="addGoodform.goods_price" />
                                </el-form-item>
                                <el-form-item label="商品重量" prop="goods_weight">
                                    <el-input v-model="addGoodform.goods_weight" />
                                </el-form-item>
                                <el-form-item label="商品数量" prop="goods_number">
                                    <el-input v-model="addGoodform.goods_number" />
                                </el-form-item>
                                <el-form-item label="商品分类" prop="goods_cat">
                                    <el-cascader
                                        :options="catelist"
                                        :props="cascaderProps"
                                        v-model="addGoodform.goods_cat"
                                        @change="handleCascaderchange"
                                    />
                                </el-form-item>
                            </el-tab-pane>
                            <el-tab-pane label="商品参数" name="1">
                                <el-form-item :label="item.attr_name" v-for="item in manyTable" :key="item.attr_id">
                                    <el-checkbox-group v-model="item.attr_vals" size="large">
                                        <el-checkbox :label="val" v-for="(val,i) in item.attr_vals" :key="i" border />
                                    </el-checkbox-group>
                                </el-form-item>
                            </el-tab-pane>
                            <el-tab-pane label="商品属性" name="2">
                                <el-form-item :label="item.attr_name" v-for="item in onlyTable" :key="item.attr_id">
                                    <el-input v-model="item.attr_vals"></el-input>
                                </el-form-item>
                            </el-tab-pane>
                            <el-tab-pane label="商品图片" name="3">
                                <el-upload
                                    class="upload-demo"
                                    action="http://127.0.0.1:8888/api/private/v1/upload"
                                    :on-preview="handlePreview"
                                    :on-remove="handleRemove"
                                    list-type="picture"
                                    :headers="{
                                        Authorization: token
                                    }"
                                    :on-success="handleSuccess"
                                >
                                    <el-button type="primary">点击上传</el-button>
                                    <template #tip>
                                        <div class="el-upload__tip">
                                            图片大小不能大于500kb
                                        </div>
                                    </template>
                                </el-upload>
                            </el-tab-pane>
                            <el-tab-pane label="商品内容" name="4">
                                <QuillEditor theme="snow" ref="editorRef" />
                            </el-tab-pane>
                        </el-tabs>

                    </el-form>
                </div>
                <div class="btns">
                    <el-button type="primary" v-on:click="submitAddForm(addGoodFormRef)">提交</el-button>
                    <el-button>取消</el-button>
                </div>
            </div>
        </el-drawer>

        <el-config-provider :locale="locale"></el-config-provider>
    </el-card>

    <el-dialog title="图片预览" v-model="previewVisible">
        <img :src="previewPath" alt="" class="previewImg"/>
    </el-dialog>
</template>

<script lang="ts" setup>
import { ArrowRight, Edit, Delete, Search } from '@element-plus/icons-vue'
import { ref, onMounted, computed } from 'vue'
import { goodsStore } from '@/store/good'
import { categoriesStore } from '@/store/category'
import { storeToRefs } from 'pinia'
import { ElMessage, ElMessageBox } from 'element-plus'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import type { FormInstance } from 'element-plus'
import {drawer,addGoodFormRef,addGoodform,  addGoodRules } from './goodhook/addGood'
import type { UploadProps } from 'element-plus'
import localCache from '@/utils/cache'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

let locale = ref(zhCn);
const store = goodsStore();
const catStore = categoriesStore();
const { goodlist, total } = storeToRefs(store);
const { catelist } = storeToRefs(catStore);
let activeIndex = ref<any>('0')
const token = localCache.getCache('token');

const cascaderProps = {
    value: 'cat_id',
    label: 'cat_name',
    children: 'children',
    expandTrigger: 'hover'    
}

const handleClose = (done: () => void) => {
    ElMessageBox.confirm('数据还未提交，关闭后清空，是否确认关闭?')
    .then(() => {
        addGoodFormRef.value?.resetFields();
        activeIndex.value = 0;
        // console.log('out');
        done();
    })
    .catch(() => {
    // catch error
    })
}

// Prevent access before cat_id selected
const beforeLeave = (activeName:string, oldActiveName:string) => {
    // console.log(activeName,oldActiveName );
    activeIndex.value = activeName;
    if(oldActiveName === '0' && addGoodform.goods_cat.length !==3 ){
        ElMessage.error('请先选择商品分类！');
        return false;
    }
    return true;
};

// Get good_cat
const handleCascaderchange = function() {
    // console.log(addGoodform.goods_cat);
    if(addGoodform.goods_cat.length !== 3) {
        addGoodform.goods_cat = [];
        return;
    }
};

// Get params
const catId = computed(function(){
    if( addGoodform.goods_cat.length === 3) {
        return addGoodform.goods_cat.slice(-1)[0];
    }
    return null;
});

const manyTable = ref([]);
const onlyTable = ref([]);

const tabClicked = async function() {
    // console.log(activeIndex.value);
    if (activeIndex.value === '1' && catId.value) {
        try {
            manyTable.value = await catStore.getCateById({id: catId.value,sel:'many'});

        } catch (err:any) {
            ElMessage.error(`${err.message}`)
        }
        return;
    }
    if (activeIndex.value === '2' && catId.value) {
        try {
            onlyTable.value = await catStore.getCateById({id: catId.value,sel:'only'});

        } catch (err:any) {
            ElMessage.error(`${err.message}`)
        }
        return;        
    }
}

// Upload picture
const handleRemove: UploadProps['onRemove'] = (file:any) => {
    const filePath = file.response.data.tmp_path;
    const index = addGoodform.pics.findIndex(i => i.pic === filePath);
    addGoodform.pics.splice(index,1);
    // console.log(addGoodform);
}

const previewPath = ref('');
const previewVisible = ref(false);
const handlePreview: UploadProps['onPreview'] = (file:any) => {
    // console.log(file);
    previewPath.value = file.response.data.url;
    previewVisible.value = true;
//   console.log(addGoodform);
}
;
const handleSuccess: UploadProps['onSuccess'] = (response) => {
    const picInfo = { pic: response.data.tmp_path };

    addGoodform.pics.push(picInfo);
    // console.log(addGoodform);
};

let query = ref('');

let pageSize = ref(10) //每页显示条数
let pageNum = ref(1) //当前页码


// Pagination
const handleSizeChange = function(newSize: number) {
    logGoods(pageNum.value, newSize);
    pageSize.value = newSize;
};

const handleCurrentChange = function(newPage: number) {
    logGoods(newPage, pageSize.value);
    pageNum.value = newPage;
};

const getGoodList = async function (query: string) {
    await logGoods(1, 10, query);
};


// Delete good
const removeGoodById = async function(id: number) {
    const confirmResult = await ElMessageBox.confirm(
        '此操作将永久删除该商品，是否继续？',
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
        await store.deleteGoodById(id);
        logGoods();
        ElMessage.success('删除商品成功！');
    } catch(err: any) {
        ElMessage.error(`${err.message}`);
    }
};

// Add Good
const editorRef = ref();
const submitAddForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid) => {
        if (valid) {
        addGoodform.goods_introduce = editorRef.value.getText();
        const catStr = addGoodform.goods_cat.join(',');
        addGoodform.goods_introduce = editorRef.value.getText();
        manyTable.value.forEach((item:any) => {
            const newInfo = {
                attr_id: item.attr_id,
                attr_value: item.attr_vals.join(' ')
            }
            addGoodform.attrs.push(newInfo);
        });
        onlyTable.value.forEach((item:any) => {
            const newInfo = {
                attr_id: item.attr_id,
                attr_value: item.attr_vals
            }
            addGoodform.attrs.push(newInfo);
        });

        store.addGood({
            goods_name: addGoodform.goods_name,
            goods_cat: catStr,
            goods_price: Number(addGoodform.goods_price),
            goods_number: Number(addGoodform.goods_number),
            goods_weight:Number(addGoodform.goods_weight),
            goods_introduce: addGoodform.goods_introduce,
            pics: addGoodform.pics,
            attrs: addGoodform.attrs
        })
        .then(() => {
            logGoods();
            addGoodFormRef.value?.resetFields();
            drawer.value = false;
            editorRef.value.setText('');
            activeIndex.value = 0;
            ElMessage.success('添加商品成功');
        })
        .catch(err => ElMessage.error(`${err.message}`));
        // console.log(addGoodform);
        } else {
            ElMessage.error('请正确填写表单！');
        }
    })
};

// get Goodlist
const logGoods = async(num = 1, size = 10, query?:string) => {
  try {
    await store.getGoods({ pagenum: num, pagesize: size , query});
    ElMessage.success('获取商品列表成功');
  } catch(err: any) {
    ElMessage.error(`${err.message}`);
  }
};

const logCate = async function () {
    try{
        await catStore.getCatelist({});
        // console.log(catelist);
    } catch (err:any) {
        ElMessage.error(`${err.message}`);
    }
}

onMounted(() => {
  logGoods();
  logCate();
})

</script>

<style lang="less" scoped>
.content {
    display: flex;
    flex-direction: column;
    height: 100%;
    .btns {
        height: 50px;
        margin-left: 20px;
    }
    .form{
        flex: 1;
        overflow-y: auto;
    }
}

.el-steps{
    margin: 15px 0;
}

.el-step__title {
    font-size: 13px;
}

.el-checkbox {
    margin: 0 5px 5px 0;
}

.previewImg{
    width: 100%;
}

.ql-container{
    min-height: 300px;
}

</style>
