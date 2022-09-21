import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

export const addDialogVisible = ref(false);

export const addRoleFormRef = ref<FormInstance>();

export const addRoleform = reactive({
    roleName: '',
    roleDesc: '',
});

export const addRoleRules = reactive<FormRules>({
    roleName: [
      { required: true, message: '请输入角色名称', trigger: 'blur' },
      { min: 3, max: 10, message: '角色名称必须在3到10位之间', trigger: 'blur' }
    ],
    roleDesc: [
      { required: true, message: '请输入角色描述', trigger: 'blur' },
      { min: 5, max: 10, message: '角色描述必须在5到10位之间', trigger: 'blur' }
    ]
});