<script setup>
import { Location } from '@element-plus/icons-vue'

defineProps({
  product: { type: Object, required: true },
})
</script>

<template>
  <RouterLink class="product-card" :to="`/item/${product.id}`">
    <div class="product-image-wrap">
      <img class="product-image" :src="product.images[0]" :alt="product.title" loading="lazy" />
      <span class="condition-tag">{{ product.condition }}</span>
    </div>
    <div class="product-body">
      <div class="product-category">{{ product.category }}</div>
      <h3>{{ product.title }}</h3>
      <div class="product-price-row">
        <strong><small>¥</small>{{ product.price.toLocaleString() }}</strong>
        <del>¥{{ product.originalPrice.toLocaleString() }}</del>
      </div>
      <div class="product-meta">
        <span><el-icon><Location /></el-icon>{{ product.location }}</span>
        <span>{{ product.seller }}</span>
      </div>
    </div>
  </RouterLink>
</template>
