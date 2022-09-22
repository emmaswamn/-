import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

export const editDialogVisible = ref(false);

export const editCateFormRef = ref<FormInstance>();

export const editCateform = reactive({
    cat_name:'',
    cat_id:0
});

export const editCateRules = reactive<FormRules>({
    cat_name: [
      { required: true, message: '请输入分类名称', trigger: 'blur' }
    ],
});