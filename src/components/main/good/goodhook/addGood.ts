import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

export const drawer = ref(false);

export const addGoodFormRef = ref<FormInstance>();

export const addGoodform = reactive({
    goods_name: '',
    goods_price: '',
    goods_number:'',
    goods_weight: '',
    goods_introduce:'',
    goods_cat: [],
    pics: [] as any [],
    attrs: [] as any []
});

export const addGoodRules = reactive<FormRules>({
    goods_name: [
      { required: true, message: '请输入商品名称', trigger: 'blur' }
    ],
    goods_price: [
      { required: true, message: '请输入商品价格', trigger: 'blur' }
    ],
    goods_number: [
      { required: true, message: '请输入商品数量', trigger: 'blur' }
    ],
    goods_weight: [
      { required: true, message: '请输入商品重量', trigger: 'blur' }
    ],
    goods_cat: [
      { required: true, message: '请输入商品分类', trigger: 'blur' }
    ]
});

