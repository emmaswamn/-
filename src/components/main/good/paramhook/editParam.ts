import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

export const editDialogVisible = ref(false);

export const editParamFormRef = ref<FormInstance>();

export const editParamform = reactive({
    attr_name:''
});

export const editParamRules = reactive<FormRules>({
    attr_name: [
      { required: true, message:'请输入参数名称' , trigger: 'blur' }
    ],
});