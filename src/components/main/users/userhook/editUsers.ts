import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

export const editDialogVisible = ref(false);

export const editUserFormRef = ref<FormInstance>();

export const editUserform = reactive({
    username:'',
    email: '',
    mobile: ''
});

export const editUserRules = reactive<FormRules>({
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