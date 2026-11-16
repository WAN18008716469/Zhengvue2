<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { ArrowLeft, Location, StarFilled, CircleCheck, ChatDotRound, Lock } from '@element-plus/icons-vue'
import { getProductById } from '../data/products'

const route = useRoute()
const router = useRouter()
const activeImage = ref(0)
const product = computed(() => getProductById(route.params.id))
watch(() => route.params.id, () => { activeImage.value = 0 })

const buyNow = async () => {
  if (!product.value) return
  try {
    await ElMessageBox.confirm(
      `确认以 ¥${product.value.price.toLocaleString()} 购买「${product.value.title}」？此操作仅为前端演示，不会产生真实订单或支付。`,
      '确认购买',
      { confirmButtonText: '确认模拟购买', cancelButtonText: '再想想', type: 'warning' },
    )
    ElMessage.success('模拟订单已确认，未发起真实支付')
  } catch {
    // User cancelled the simulated purchase.
  }
}
</script>

<template>
  <main v-if="product" class="detail-page page-shell">
    <button class="back-link" @click="router.back()"><el-icon><ArrowLeft /></el-icon>返回</button>
    <div class="detail-grid">
      <section class="gallery" aria-label="商品图库">
        <div class="main-image"><img :src="product.images[activeImage]" :alt="product.title" /></div>
        <div v-if="product.images.length > 1" class="thumbnail-list">
          <button v-for="(image, index) in product.images" :key="image" :class="{ active: activeImage === index }" @click="activeImage = index">
            <img :src="image" :alt="`${product.title} 图 ${index + 1}`" />
          </button>
        </div>
      </section>

      <section class="product-summary">
        <div class="summary-tags"><span>{{ product.category }}</span><span>{{ product.condition }}</span></div>
        <h1>{{ product.title }}</h1>
        <div class="detail-location"><el-icon><Location /></el-icon>{{ product.location }} · 发布于 {{ product.listedAt }}</div>
        <div class="detail-price"><strong><small>¥</small>{{ product.price.toLocaleString() }}</strong><del>原价 ¥{{ product.originalPrice.toLocaleString() }}</del></div>
        <p class="detail-description">{{ product.description }}</p>

        <div class="seller-row">
          <div class="seller-avatar">{{ product.seller.slice(0, 1) }}</div>
          <div><strong>{{ product.seller }}</strong><span>个人卖家 · 已完成身份验证</span></div>
          <div class="seller-rating"><el-icon><StarFilled /></el-icon>{{ product.sellerRating }}</div>
        </div>

        <div class="assurance-list">
          <div><el-icon><CircleCheck /></el-icon><span><strong>信息保障</strong><small>卖家承诺如实描述商品状态</small></span></div>
          <div><el-icon><CircleCheck /></el-icon><span><strong>购买确认</strong><small>下单前再次核对商品与价格</small></span></div>
          <div><el-icon><Lock /></el-icon><span><strong>演示说明</strong><small>本站不会发起真实支付或交易</small></span></div>
        </div>

        <div class="detail-actions">
          <el-button size="large" :icon="ChatDotRound" @click="ElMessage.info('聊天功能为前端演示')">联系卖家</el-button>
          <el-button type="primary" size="large" @click="buyNow">立即购买</el-button>
        </div>
      </section>
    </div>
  </main>
  <main v-else class="page-shell missing-page">
    <el-empty description="这件商品已经离开集市"><el-button type="primary" @click="router.push('/')">回到首页</el-button></el-empty>
  </main>
</template>
