<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Lock, User, ArrowRight } from '@element-plus/icons-vue'
import { login } from '../utils/auth'

const route = useRoute()
const router = useRouter()
const formRef = ref()
const loading = ref(false)
const form = reactive({ username: 'admin', password: 'admin123' })
const rules = {
  username: [{ required: true, message: '请输入管理员账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入登录密码', trigger: 'blur' }, { min: 6, message: '密码至少 6 位', trigger: 'blur' }],
}

async function submit() {
  await formRef.value.validate()
  loading.value = true
  window.setTimeout(() => {
    loading.value = false
    if (!login(form.username, form.password)) {
      ElMessage.error('用户名或密码错误')
      return
    }
    ElMessage.success('登录成功')
    const redirect = typeof route.query.redirect === 'string' && route.query.redirect.startsWith('/admin/') ? route.query.redirect : '/admin/dashboard'
    router.replace(redirect)
  }, 250)
}
</script>

<template>
  <main class="login-page">
    <div class="login-decoration login-decoration-one"></div>
    <div class="login-decoration login-decoration-two"></div>
    <section class="login-layout">
      <div class="login-intro">
        <div class="login-brand"><span class="brand-mark">心</span><span>心选集市</span></div>
        <h1>让每一件闲置，<br /><strong>被认真管理。</strong></h1>
        <p>统一管理商品、订单、用户与运营内容，让平台日常工作更清晰、更高效。</p>
        <div class="login-points"><span>商品审核与上下架</span><span>订单状态跟踪</span><span>运营数据总览</span></div>
      </div>
      <el-card class="login-card" shadow="never">
        <div class="login-card-heading"><span>欢迎回来</span><h2>登录管理后台</h2><p>使用管理员账号继续工作</p></div>
        <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @submit.prevent="submit">
          <el-form-item label="管理员账号" prop="username">
            <el-input v-model="form.username" size="large" :prefix-icon="User" autocomplete="username" placeholder="请输入管理员账号" />
          </el-form-item>
          <el-form-item label="登录密码" prop="password">
            <el-input v-model="form.password" size="large" :prefix-icon="Lock" type="password" autocomplete="current-password" show-password placeholder="请输入登录密码" />
          </el-form-item>
          <el-button class="login-submit" type="primary" size="large" :loading="loading" native-type="submit" :icon="ArrowRight">进入工作台</el-button>
        </el-form>
        <div class="login-hint"><span>演示账号</span><code>admin</code><span>密码</span><code>admin123</code></div>
      </el-card>
    </section>
  </main>
</template>
