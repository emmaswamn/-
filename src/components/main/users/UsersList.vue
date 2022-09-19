<template>
    <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
        <!-- Search area -->
        <el-row :gutter="20">
            <el-col :span="8">
                <el-input
                placeholder="请输入内容"
                v-model="query"
                clearable
                v-on:clear="getUserList(query)"
                >
                    <template #append>
                        <el-button :icon="Search" v-on:click="getUserList(query)"/>
                    </template>
                </el-input>
            </el-col>
            <el-col :span="4">
                <el-button type="primary" v-on:click="addDialogVisible = true">添加用户</el-button>
            </el-col>
        </el-row>

        <!-- UserList area -->
        <el-table :data="users" style="width: 100%" border stripe>
            <el-table-column type="index"/>
            <el-table-column prop="username" label="姓名"/>
            <el-table-column prop="email" label="邮箱"/>
            <el-table-column prop="mobile" label="电话"/>
            <el-table-column prop="role_name" label="角色"/>
            <el-table-column label="状态">
                <template #default="scope">
                    <el-switch v-model="scope.row.mg_state" v-on:change="userStateChange(scope.row.id, scope.row.mg_state)"/>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180px">
                <template #default="scope">
                    <!-- modify -->
                    <el-button type="primary" size="small" :icon="Edit" v-on:click="findUder(scope.row.id)"></el-button>
                    <!-- delete -->
                    <el-button type="danger" size="small" :icon="Delete" v-on:click="removeUserById(scope.row.id)"></el-button>
                    <!-- change role -->
                    <el-tooltip
                        effect="dark"
                        content="分配角色"
                        placement="top"
                        v-bind:enterable="false"
                    >
                        <el-button type="warning" size="small" :icon="Setting"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>

        <!-- pagination area -->

        <el-pagination
        v-model:currentPage="pageNum"
        v-model:page-size="pageSize"
        :page-sizes="[1,2,5,10]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        />

        <!-- Add user -->
        <el-dialog
        v-model="addDialogVisible"
        title="添加用户"
        width="50%"
        v-on:close="resetForm(addUserFormRef)"
        >
            <!-- Main info -->
            <el-form
                ref="addUserFormRef"
                :model="addUserform"
                :rules="addUserRules"
                label-width="70px"
            >
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addUserform.username" />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addUserform.password" />
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addUserform.email" />
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="addUserform.mobile" />
                </el-form-item>
            </el-form>
            <!-- Footer -->
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="submitUser(addUserFormRef)" 
                        >确定</el-button
                    >
                    <el-button  @click="addDialogVisible = false">取消</el-button>
                </span>
            </template>
        </el-dialog>

        <el-dialog
        v-model="editDialogVisible"
        title="修改用户"
        width="50%"
        v-on:close="resetForm(editUserFormRef)"
        >
            <!-- Main info -->
            <el-form
                ref="editUserFormRef"
                :model="editUserform"
                :rules="editUserRules"
                label-width="70px"
            >
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="editUserform.username" disabled/>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editUserform.email" />
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="editUserform.mobile" />
                </el-form-item>
            </el-form>
            <!-- Footer -->
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="submitEdit(editUserFormRef)"
                    >确认</el-button
                    >
                    <el-button @click="editDialogVisible = false">取消</el-button>
                </span>
            </template>
        </el-dialog>

        <el-config-provider :locale="locale"></el-config-provider>
    </el-card>
</template>

<script lang="ts" setup>

import { ArrowRight } from '@element-plus/icons-vue'
import { Search } from '@element-plus/icons-vue'
import { ref, onMounted } from 'vue'
import { usersStore } from '@/store/user'
import { storeToRefs } from 'pinia'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete, Edit, Setting } from '@element-plus/icons-vue'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import { addDialogVisible, addUserFormRef, addUserform, addUserRules } from './userhook/addUsers'
import { editDialogVisible, editUserFormRef, editUserform, editUserRules} from './userhook/editUsers'
import type { FormInstance } from 'element-plus'

let locale = ref(zhCn);

const store = usersStore();
const { users, total } = storeToRefs(store);

const showScope = (scope: any): void => {
    console.log(scope);
}

let pageSize = ref(10) //每页显示条数
let pageNum = ref(1) //当前页码

// Pagination
const handleSizeChange = function(newSize: number) {
    logUsers(pageNum.value, newSize);
    pageSize.value = newSize;
};

const handleCurrentChange = function(newPage: number) {
    logUsers(newPage, pageSize.value);
    pageNum.value = newPage;
};

// Change State
const userStateChange = async function (uid: number, type:boolean) {
    try {
        await store.changeUserStatus({ uid, type });
    } catch (err: any) {
        ElMessage.error(`${err.message}`);
    }
};

// Query User
let query = ref('');

const getUserList = async function (query: string) {
    await logUsers(1, 10, query);
};

// Add User
const submitUser = async function (formEl: FormInstance | undefined) {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            // console.log(addUserform);
            store.addUser({...addUserform})
                .then(() => {
                    ElMessage.success('创建用户成功');
                    addDialogVisible.value = false;
                    logUsers();
                })
                .catch(err => ElMessage.error(`${err.message}`));
        } else {
            console.log('error submit!', fields)
        }
    })
};

// Delete User
const removeUserById = async function(id: number) {
    const confirmResult = await ElMessageBox.confirm(
        '此操作将永久删除该用户，是否继续？',
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
        await store.deleteUsersFromId(id);
        logUsers();
        ElMessage.success('删除用户成功！');
    } catch(err: any) {
        ElMessage.error(`${err.message}`);
    }
};

// Reset Userform
const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.resetFields();
}

// Edit User
// 1) find user
let userId = 0;
const findUder = async function(id: number) {
    // console.log(id);
    try {
        userId = id;
        const user = await store.getUsersById(id);
        editUserform.username = user.username;
        editUserform.email = user.email;
        editUserform.mobile = user.mobile;
        editDialogVisible.value = true;
        // console.log(user);
    } catch(err: any) {
        ElMessage.error(`${err.message}`);
    }
};
// 2) Change userinfo
const submitEdit = async function (formEl: FormInstance | undefined) {
    if (!formEl) return
        await formEl.validate((valid, fields) => {
    if (valid) {
        store.editUsersById({id:userId, mobile:editUserform.mobile, email:editUserform.email})
            .then(() => {
                ElMessage.success('更新用户成功');
                editDialogVisible.value = false;
                logUsers();
            })
            .catch(err => ElMessage.error(`${err.message}`));
    } else {
        console.log('error submit!', fields)
    }
  })    
};

// get Userlist
const logUsers = async(num = 1, size = 10, query?:string) => {
  try {
    await store.getUsers({ pagenum: num, pagesize: size , query});
    ElMessage.success('获取用户列表成功');
  } catch(err: any) {
    ElMessage.error(`${err.message}`);
  }
};

onMounted(() => {
  logUsers();
})

</script>