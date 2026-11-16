<script setup>
defineProps({
  src: { type: String, default: '' },
  alt: { type: String, default: '商品图片' },
  fit: { type: String, default: 'cover' },
})
</script>

<template>
  <el-image class="product-image-safe" :src="src" :alt="alt" :fit="fit">
    <template #error>
      <img class="product-image-fallback" src="/images/products/placeholder.jpg" :alt="`${alt}加载失败`" />
    </template>
  </el-image>
</template>
