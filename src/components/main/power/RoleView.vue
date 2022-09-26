<template>
    <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
        <el-row :gutter="20">
            <el-col :span="4">
                <el-button type="primary" v-on:click="addDialogVisible = true">添加角色</el-button>
            </el-col>
        </el-row>
        
        <el-table :data="roles" style="width: 100%" border stripe>
            <el-table-column type="expand">
                <template #default="scope">
                    <el-row v-for="(level1, index1) in scope.row.children" v-bind:key="level1.id"
                    v-bind:class="['bdbottom', index1 === 0 ? 'bdtop' : '', 'vcenter']"
                    >
                        <el-col :span="5">
                            <el-tag closable
                                v-on:close="removeRightById(scope.row.id, level1.id)"
                                >{{level1.authName}}</el-tag>
                            <el-icon><CaretRight /></el-icon>
                        </el-col>
                        <el-col :span="19">
                            <el-row v-bind:class="[index2 !== 0 ? 'bdtop' : '', 'vcenter']" v-for="(level2, index2) in level1.children" v-bind:key="level2.id">
                                <el-col :span="6">
                                    <el-tag closable
                                        v-on:close="removeRightById(scope.row.id, level2.id)"
                                        type="success">{{level2.authName}}</el-tag>
                                    <el-icon><CaretRight /></el-icon>
                                </el-col>
                                <el-col :span="18">
                                    <el-tag closable
                                        v-on:close="removeRightById(scope.row.id, level3.id)"
                                        v-for="(level3) in level2.children" v-bind:key="level3.id" type="warning">{{level3.authName}}</el-tag>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </template>
            </el-table-column>
            <el-table-column type="index"/>
            <el-table-column prop="roleName" label="角色名称"/>
            <el-table-column prop="roleDesc" label="角色描述"/>
            <el-table-column label="操作" width="300px">
                <template #default="scope">
                    <!-- modify -->
                    <el-button type="primary" size="small" :icon="Edit" v-on:click="openEdit(scope.row.id)">编辑</el-button>
                    <!-- delete -->
                    <el-button type="danger" size="small" :icon="Delete" v-on:click="removeRole(scope.row.id)">删除</el-button>
                    <!-- assign rights -->
                    <el-button type="warning" size="small" :icon="Setting" v-on:click="showRightDialog(scope.row)">分配权限</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog
        v-model="addDialogVisible"
        title="添加用户"
        width="50%"
        v-on:close="resetForm(addRoleFormRef)"
        >
            <!-- Main info -->
            <el-form
                ref="addRoleFormRef"
                :model="addRoleform"
                :rules="addRoleRules"
                label-width="80px"
            >
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="addRoleform.roleName" />
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="addRoleform.roleDesc" />
                </el-form-item>
            </el-form>
            <!-- Footer -->
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="submitRoleForm(addRoleFormRef)" 
                        >确定</el-button
                    >
                    <el-button  @click="addDialogVisible = false">取消</el-button>
                </span>
            </template>
        </el-dialog>

        <el-dialog
        v-model="editDialogVisible"
        title="修改角色"
        width="50%"
        v-on:close="resetForm(editRoleFormRef)"
        >
            <!-- Main info -->
            <el-form
                ref="editRoleFormRef"
                :model="editRoleform"
                :rules="editRoleRules"
                label-width="70px"
            >
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="editRoleform.roleName"/>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="editRoleform.roleDesc" />
                </el-form-item>
            </el-form>
            <!-- Footer -->
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="submitEdit(editRoleFormRef)"
                    >确认</el-button
                    >
                    <el-button @click="editDialogVisible = false">取消</el-button>
                </span>
            </template>
        </el-dialog>

        <el-dialog
            v-if="assignDialogVisible"
            v-model="assignDialogVisible"
            title="分配权限"
            width="50%"
            v-on:close="resetRightDialog"
            
        >
            <el-tree
                ref="treeRef"
                :data="rights"
                :props="treeProps"
                show-checkbox
                node-key="id"
                default-expand-all
                :default-checked-keys="defKeys"
            />
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="assignRights"
                    >确认</el-button
                    >
                    <el-button @click="assignDialogVisible = false">取消</el-button>
                </span>
            </template>
        </el-dialog>

    </el-card>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { ArrowRight, CaretRight } from '@element-plus/icons-vue'
import { Delete, Edit, Setting } from '@element-plus/icons-vue'
import { roleStore } from '@/store/role';
import { storeToRefs } from 'pinia';
import { ElMessage, ElMessageBox, ElTree } from 'element-plus'
import { addDialogVisible, addRoleFormRef, addRoleform, addRoleRules } from './rolehook/addrole'
import { editDialogVisible, editRoleFormRef, editRoleform, editRoleRules} from './rolehook/editrole'
import { assignDialogVisible, treeProps, getDefKeys } from './rolehook/assignright'
import type { FormInstance } from 'element-plus'


interface Tree {
  label: string
  children?: Tree[]
}

const store = roleStore();
const { roles, rights } = storeToRefs(store);

// Reset Form
const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.resetFields();
}

// Add role
const submitRoleForm = async function (formEl: FormInstance | undefined) {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            // console.log(addRoleform);
            store.addRoles({...addRoleform})
                .then(() => {
                    ElMessage.success('创建用户成功');
                    addDialogVisible.value = false;
                    getRoles();
                })
                .catch(err => ElMessage.error(`${err.message}`));
        } else {
            ElMessage.error('请正确填写表单！');
        }
    })
};

// Edit Role
// 1) passid
let roleId = 0;
const openEdit = function(id: number) {
    editDialogVisible.value = true;
    roleId = id;
};

const submitEdit = async function (formEl: FormInstance | undefined) {
    if (!formEl) return
        await formEl.validate((valid, fields) => {
    if (valid) {
        store.editRoles({id:roleId, roleName:editRoleform.roleName, roleDesc:editRoleform.roleDesc})
            .then(() => {
                ElMessage.success('更新角色成功');
                editDialogVisible.value = false;
                getRoles();
            })
            .catch(err => ElMessage.error(`${err.message}`));
    } else {
        ElMessage.error('请正确填写表单！');
    }
  })    
};

// Delete Role
const removeRole = async function(id: number) {
    const confirmResult = await ElMessageBox.confirm(
        '此操作将永久删除该角色,是否继续？',
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
        await store.deleteRoles(id);
        getRoles();
        ElMessage.success('删除角色成功！');
    } catch(err: any) {
        ElMessage.error(`${err.message}`);
    }
};

// Delete role's right by id
const removeRightById = async function(roleId: number, rightId: number) {
    const confirmResult = await ElMessageBox.confirm(
        '此操作将永久删除该权限,是否继续？',
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
        await store.deleteRoleRight({roleId,rightId});
        getRoles();
        ElMessage.success('删除权限成功！');
    } catch(err: any) {
        ElMessage.error(`${err.message}`);
    }
};

// Assign Rights
const defKeys = reactive([]);
const treeRef = ref<InstanceType<typeof ElTree>>();

const showRightDialog = async function (role: any) {
    try {
        roleId = role.id;
        await store.getRightsTree();
        getDefKeys(role, defKeys);
        // console.log(defKeys);
        assignDialogVisible.value = true;
    } catch (err:any ) {
        ElMessage.error(`${err.message}`);
    }
};

const resetRightDialog = () => {
    defKeys.splice(0);
};

const assignRights = async function () {
    try { 
        if (treeRef.value) {
            const keys = [...treeRef.value.getCheckedKeys(), ...treeRef.value.getHalfCheckedKeys()];
            const rightIds = keys.join(',');
            // console.log({roleId,rightIds});
            await store.assignRoleRights({roleId,rightIds});
            getRoles();
            assignDialogVisible.value = false
        }
    } catch (err:any) {
        ElMessage.error(`${err.message}`);
    }
}

const getRoles = async function () {
    try {
        await store.getRolesList();
        ElMessage.success('获取角色列表成功');
        // console.log(roles);
    } catch (err:any ) {
        ElMessage.error(`${err.message}`);
    }
}

onMounted(() => {
  getRoles();
});

</script>

<style lang="less" scoped>
.el-tag{
    margin: 7px;
}

.bdtop{
    border-top: 1px solid #eee;
}

.bdbottom{
    border-bottom: 1px solid #eee;
}

.vcenter{
    display: flex;
    align-items: center;
}

</style>