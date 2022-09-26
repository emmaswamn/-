<template>
    <div class="login_container">
        <div class="login_box">
            <div class="avator_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <el-form ref="loginFormRef" :model="loginForm" v-bind:rules="loginFormRules" class="login-form">
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" placeholder="请输入用户名" :prefix-icon="User"/>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input 
                        v-model="loginForm.password"
                        placeholder="请输入密码"
                        :prefix-icon="Lock"
                        type="password"
                    />
                </el-form-item>
                <el-form-item class="btns" justify="end">
                    <el-button v-on:click="submitForm(loginFormRef)" type="primary">登录</el-button>
                    <el-button v-on:click="resetLoginForm(loginFormRef)" type="info">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue';
import { reactive, ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { loginStore } from '@/store/login'
import { useRouter} from 'vue-router'

const router = useRouter()
const store = loginStore()

const loginFormRef = ref<FormInstance>();

const loginForm = reactive({
    username: 'admin',
    password: '123456'
});

const loginFormRules = reactive<FormRules>({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' },        
    ]
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
    //   console.log('submit!');
      store.loginAction({ ...loginForm })
        .then(() => {
            ElMessage.success('登录成功！');
            router.push('/home');
        })
        .catch(err => ElMessage.error(`${err.message}`));
    } else {
      ElMessage.error('请正确填写表单！');
    }
  })
};

const resetLoginForm = (formEl: FormInstance | undefined): void => {
    if (!formEl) return;
    formEl.resetFields();
};

</script>

<style lang="less" scoped>
.login_container {
    background-color: #2b4b6b;
    height: 100%;
}

.login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}

.avator_box {
    height: 120px;
    width: 120px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-40%);
    background-color: #fff;
    img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
    }
}

.login-form{
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    position: absolute;
    bottom: 0;
}

::v-deep .btns .el-form-item__content {
    justify-content: flex-end;
}
</style>