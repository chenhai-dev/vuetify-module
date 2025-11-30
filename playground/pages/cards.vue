<script setup lang="ts">
import {ref} from "vue";

const loading = ref(false)

const toggleLoading = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 2000)
}
</script>

<template>
  <div>
    <h1 class="text-h4 mb-6">Cards Demo</h1>

    <v-row>
      <!-- Product Card -->
      <v-col cols="12" md="4">
        <v-card :loading="loading">
          <v-img
              src="https://picsum.photos/seed/product/400/200"
              height="200"
              cover
          />
          <v-card-item>
            <v-card-title>Product Card</v-card-title>
            <v-card-subtitle>E-commerce style</v-card-subtitle>
          </v-card-item>
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <span class="text-h5 text-primary font-weight-bold">$99.99</span>
              <v-rating :model-value="4.5" color="amber" density="compact" half-increments readonly size="small" />
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" block>Add to Cart</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- Blog Card -->
      <v-col cols="12" md="4">
        <v-card :loading="loading">
          <v-img
              src="https://picsum.photos/seed/blog/400/200"
              height="200"
              cover
          />
          <v-card-item>
            <v-card-title>Blog Post</v-card-title>
            <v-card-subtitle>
              <v-icon size="small" class="mr-1">mdi-account</v-icon>
              John Doe
              <v-icon size="small" class="ml-2 mr-1">mdi-calendar</v-icon>
              Nov 15, 2025
            </v-card-subtitle>
          </v-card-item>
          <v-card-text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </v-card-text>
          <v-card-actions>
            <v-btn variant="text" color="primary">Read More</v-btn>
            <v-spacer />
            <v-btn icon size="small"><v-icon>mdi-heart-outline</v-icon></v-btn>
            <v-btn icon size="small"><v-icon>mdi-share-variant</v-icon></v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- Profile Card -->
      <v-col cols="12" md="4">
        <v-card :loading="loading" class="text-center">
          <v-card-text class="pt-6">
            <v-avatar size="100">
              <v-img src="https://picsum.photos/seed/avatar/100/100" />
            </v-avatar>
            <h3 class="text-h6 mt-4">Jane Smith</h3>
            <p class="text-body-2 text-medium-emphasis">Senior Developer</p>
            <v-row class="mt-4" no-gutters>
              <v-col cols="6">
                <div class="text-h6">12.5K</div>
                <div class="text-caption text-medium-emphasis">Followers</div>
              </v-col>
              <v-col cols="6">
                <div class="text-h6">856</div>
                <div class="text-caption text-medium-emphasis">Following</div>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="justify-center">
            <v-btn color="primary">
              <v-icon class="mr-1">mdi-account-plus</v-icon>
              Follow
            </v-btn>
            <v-btn variant="outlined">Message</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Card Variants -->
    <h2 class="text-h5 mt-8 mb-4">Card Variants</h2>

    <v-row>
      <v-col cols="12" sm="6" md="3">
        <v-card variant="elevated">
          <v-card-title>Elevated</v-card-title>
          <v-card-text>Default elevated card</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card variant="flat">
          <v-card-title>Flat</v-card-title>
          <v-card-text>Flat card without shadow</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card variant="tonal" color="primary">
          <v-card-title>Tonal</v-card-title>
          <v-card-text>Tonal card with color</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card variant="outlined">
          <v-card-title>Outlined</v-card-title>
          <v-card-text>Card with border only</v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12">
        <v-btn color="primary" @click="toggleLoading">
          Toggle Loading State
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>