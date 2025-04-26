<script setup lang="ts">
import BingoView from './views/bingo-board/BingoView.vue'
import Layout from './views/Layout.vue'
import Header from './views/Header.vue'
</script>

<template>
    <Header />
    <Layout>
        <BingoView />
    </Layout>
</template>
