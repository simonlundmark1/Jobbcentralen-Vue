<template>
  <div id="root">
    <NuxtRouteAnnouncer />
    <div class="main-container">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </div>
</template>

<style>
/* Import Inter font */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

/* Global reset and base styles matching React version */
#root {
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

.main-container {
  width: 100%;
  margin: 0 auto;
  background-color: white;
}

/* Global styles */
html {
  font-family: 'Inter', system-ui, sans-serif;
}

body {
  margin: 0;
  padding: 0;
}
</style>
