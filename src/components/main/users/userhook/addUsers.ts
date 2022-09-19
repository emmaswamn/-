import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

export const addDialogVisible = ref(false);

export const addUserFormRef = ref<FormInstance>();

export const addUserform = reactive({
    username: '',
    password: '',
    email: '',
    mobile: ''
});

export const addUserRules = reactive<FormRules>({
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 3, max: 10, message: '用户名必须在3到10位之间', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 5, max: 10, message: '密码必须在5到10位之间', trigger: 'blur' }
    ],
    email: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { min: 10, max: 30, message: '请输入正确的邮箱', trigger: 'blur' },
      {
        pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
        message: '请输入正确的邮箱'
      }
    ],
    mobile: [
      { required: true, message: '请输入手机号码', trigger: 'blur' },
      { min: 11, max: 11, message: '请输入11位手机号码', trigger: 'blur' },
      {
        pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
        message: '请输入正确的手机号码'
      }
    ]
});

