import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

export const addDialogVisible = ref(false);

export const addParamFormRef = ref<FormInstance>();

export const addParamform = reactive({
    attr_name:''
});

export const addParamRules = reactive<FormRules>({
    attr_name: [
      { required: true, message:'请输入参数名称' , trigger: 'blur' }
    ],
});