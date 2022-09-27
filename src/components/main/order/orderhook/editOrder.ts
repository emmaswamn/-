import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

export const editDialogVisible = ref(false);

export const addressFormRef = ref<FormInstance>();

export const addressForm = reactive({
    address1: [] as any [],
    address2: ''
});

export const addressRules = reactive<FormRules>({
    address1: [
      { required: true, message: '请选择省市区县', trigger: 'blur' }
    ],
    address2: [
      { required: true, message: '请填写详细地址', trigger: 'blur' }
    ]
});