<template>
  <div class="bg-white border border-gray-200 rounded-lg shadow-soft p-6 animate-pulse">
    <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between">
      <!-- Main Content -->
      <div class="flex-1">
        <!-- Job Title Skeleton -->
        <div class="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>

        <!-- Company and Location Skeleton -->
        <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
          <div class="flex items-center">
            <div class="w-4 h-4 bg-gray-200 rounded mr-2"></div>
            <div class="h-4 bg-gray-200 rounded w-32"></div>
          </div>
          
          <div class="flex items-center">
            <div class="w-4 h-4 bg-gray-200 rounded mr-2"></div>
            <div class="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        </div>

        <!-- Description Skeleton -->
        <div class="space-y-2 mb-4">
          <div class="h-4 bg-gray-200 rounded w-full"></div>
          <div class="h-4 bg-gray-200 rounded w-5/6"></div>
          <div class="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>

        <!-- Tags Skeleton -->
        <div class="flex gap-2 mb-4">
          <div class="h-6 bg-gray-200 rounded-full w-20"></div>
          <div class="h-6 bg-gray-200 rounded-full w-16"></div>
          <div class="h-6 bg-gray-200 rounded-full w-24"></div>
        </div>

        <!-- Date Skeleton -->
        <div class="h-4 bg-gray-200 rounded w-48"></div>
      </div>

      <!-- Actions Skeleton -->
      <div class="mt-4 sm:mt-0 sm:ml-6 flex-shrink-0">
        <div class="flex flex-col gap-2">
          <div class="h-10 bg-gray-200 rounded w-24"></div>
          <div class="h-10 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// No props or logic needed for skeleton
</script>
