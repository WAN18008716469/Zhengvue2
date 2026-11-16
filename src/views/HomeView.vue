<script setup>
import { ArrowRight, Search, Camera, House, ShoppingBag, Basketball, CircleCheck, Refresh, ChatDotRound } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'
import { categories, products } from '../data/products'

const router = useRouter()
const keyword = ref('')
const iconMap = { Camera, House, ShoppingBag, Basketball }
const featuredProducts = products.filter((product) => product.featured).slice(0, 4)
const latestProducts = [...products].sort((a, b) => b.listedAt.localeCompare(a.listedAt)).slice(0, 4)

const search = () => {
  router.push({ path: '/search', query: keyword.value.trim() ? { q: keyword.value.trim() } : {} })
}
const browseCategory = (category) => router.push({ path: '/search', query: { category } })
</script>

<template>
  <main>
    <section class="hero-section">
      <div class="page-shell hero-grid">
        <div class="hero-copy">
          <h1>让喜欢的好物，<br />继续被认真使用。</h1>
          <p>发现可信、好看又有温度的闲置商品。轻松转手，也轻松遇见下一件心头好。</p>
          <form class="hero-search" @submit.prevent="search">
            <el-input v-model="keyword" size="large" placeholder="搜相机、沙发、球拍……" :prefix-icon="Search" clearable />
            <el-button type="primary" size="large" native-type="submit">搜索</el-button>
          </form>
          <div class="hero-trust">
            <span><el-icon><CircleCheck /></el-icon>信息透明</span>
            <span><el-icon><Refresh /></el-icon>闲置循环</span>
            <span><el-icon><ChatDotRound /></el-icon>沟通顺畅</span>
          </div>
        </div>
        <div class="hero-visual">
          <img :src="products[0].images[0]" alt="精选复古微单相机" />
          <div class="hero-product-note">
            <span>今日精选</span>
            <strong>富士 X-T30 II</strong>
            <em>¥5,299</em>
          </div>
        </div>
      </div>
    </section>

    <section class="page-shell section-block category-section">
      <div class="section-heading">
        <div><h2>从喜欢的分类开始</h2><p>四类日常好物，快速找到你的目标。</p></div>
      </div>
      <div class="category-grid">
        <button v-for="category in categories" :key="category.name" class="category-item" @click="browseCategory(category.name)">
          <span class="category-icon"><el-icon><component :is="iconMap[category.icon]" /></el-icon></span>
          <span><strong>{{ category.name }}</strong><small>{{ category.description }}</small></span>
          <el-icon class="category-arrow"><ArrowRight /></el-icon>
        </button>
      </div>
    </section>

    <section class="page-shell section-block">
      <div class="section-heading">
        <div><h2>本周推荐</h2><p>成色、价格和审美都刚刚好的选择。</p></div>
        <RouterLink to="/search?sort=recommended">查看全部 <el-icon><ArrowRight /></el-icon></RouterLink>
      </div>
      <div class="product-grid"><ProductCard v-for="product in featuredProducts" :key="product.id" :product="product" /></div>
    </section>

    <section class="latest-band">
      <div class="page-shell section-block">
        <div class="section-heading">
          <div><h2>刚刚上新</h2><p>新鲜发布，喜欢就别错过。</p></div>
          <RouterLink to="/search?sort=newest">查看上新 <el-icon><ArrowRight /></el-icon></RouterLink>
        </div>
        <div class="product-grid"><ProductCard v-for="product in latestProducts" :key="product.id" :product="product" /></div>
      </div>
    </section>
  </main>
</template>
