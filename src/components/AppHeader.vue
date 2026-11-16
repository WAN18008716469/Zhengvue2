<script setup>
import { Search, User, Plus, Menu } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const keyword = ref(String(route.query.q || ''))
const mobileOpen = ref(false)

const submitSearch = () => {
  router.push({ path: '/search', query: keyword.value.trim() ? { q: keyword.value.trim() } : {} })
  mobileOpen.value = false
}
</script>

<template>
  <header class="app-header">
    <div class="header-inner">
      <RouterLink class="brand" to="/" aria-label="回到心选集市首页">
        <span class="brand-mark">心</span>
        <span>心选集市</span>
      </RouterLink>

      <form class="header-search" @submit.prevent="submitSearch">
        <el-input v-model="keyword" size="large" placeholder="搜索闲置好物" :prefix-icon="Search" clearable />
      </form>

      <nav class="desktop-nav" aria-label="主导航">
        <RouterLink to="/search">逛好物</RouterLink>
        <el-button text :icon="User">登录</el-button>
        <el-button type="primary" :icon="Plus" round @click="$message.info('发布功能为前端演示')">发布闲置</el-button>
      </nav>

      <el-button class="mobile-menu-button" text :icon="Menu" aria-label="打开菜单" @click="mobileOpen = !mobileOpen" />
    </div>
    <div v-if="mobileOpen" class="mobile-panel">
      <form @submit.prevent="submitSearch">
        <el-input v-model="keyword" placeholder="搜索闲置好物" :prefix-icon="Search" />
      </form>
      <RouterLink to="/search" @click="mobileOpen = false">逛好物</RouterLink>
      <span>登录</span>
    </div>
  </header>
</template>
