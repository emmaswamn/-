import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

export const addDialogVisible = ref(false);

export const addCateFormRef = ref<FormInstance>();

export const addCateform = reactive({
    cat_name:'',
    cat_pid: 0,
    cat_level:0
});

export const addCateRules = reactive<FormRules>({
    cat_name: [
      { required: true, message: '请输入分类名称', trigger: 'blur' }
    ],
});