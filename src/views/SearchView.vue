<script setup>
import { computed, reactive, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'
import { categories, products } from '../data/products'

const route = useRoute()
const router = useRouter()
const filters = reactive({ q: '', category: '', sort: 'recommended' })
let syncingFromRoute = false

const syncFromRoute = () => {
  syncingFromRoute = true
  filters.q = String(route.query.q || '')
  filters.category = String(route.query.category || '')
  filters.sort = String(route.query.sort || 'recommended')
  queueMicrotask(() => { syncingFromRoute = false })
}

watch(() => route.query, syncFromRoute, { immediate: true, deep: true })
watch(filters, () => {
  if (syncingFromRoute) return
  const query = {}
  if (filters.q.trim()) query.q = filters.q.trim()
  if (filters.category) query.category = filters.category
  if (filters.sort !== 'recommended') query.sort = filters.sort
  router.replace({ path: '/search', query })
}, { deep: true })

const results = computed(() => {
  const keyword = filters.q.trim().toLowerCase()
  const filtered = products.filter((product) => {
    const matchesKeyword = !keyword || [product.title, product.category, product.description, product.seller].join(' ').toLowerCase().includes(keyword)
    return matchesKeyword && (!filters.category || product.category === filters.category)
  })
  return [...filtered].sort((a, b) => {
    if (filters.sort === 'newest') return b.listedAt.localeCompare(a.listedAt)
    if (filters.sort === 'price-asc') return a.price - b.price
    if (filters.sort === 'price-desc') return b.price - a.price
    return Number(b.featured) - Number(a.featured) || b.sellerRating - a.sellerRating
  })
})

const resetFilters = () => Object.assign(filters, { q: '', category: '', sort: 'recommended' })
</script>

<template>
  <main class="search-page page-shell">
    <div class="search-title">
      <div><h1>寻找你的下一件心头好</h1><p>真实闲置，清晰信息，慢慢挑也没关系。</p></div>
      <strong>{{ results.length }} 件商品</strong>
    </div>

    <section class="filter-bar" aria-label="商品筛选">
      <el-input v-model="filters.q" size="large" placeholder="搜索商品、描述或卖家" :prefix-icon="Search" clearable />
      <el-select v-model="filters.category" size="large" placeholder="全部分类" clearable>
        <el-option v-for="category in categories" :key="category.name" :label="category.name" :value="category.name" />
      </el-select>
      <el-select v-model="filters.sort" size="large" aria-label="排序方式">
        <el-option label="综合推荐" value="recommended" />
        <el-option label="最新发布" value="newest" />
        <el-option label="价格从低到高" value="price-asc" />
        <el-option label="价格从高到低" value="price-desc" />
      </el-select>
    </section>

    <div v-if="results.length" class="product-grid search-results">
      <ProductCard v-for="product in results" :key="product.id" :product="product" />
    </div>
    <el-empty v-else description="暂时没有匹配的商品">
      <el-button type="primary" @click="resetFilters">清除筛选</el-button>
    </el-empty>
  </main>
</template>
