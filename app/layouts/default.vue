<template>
  <div>
    <!-- Modern responsive header -->
    <header class="header">
      <div class="header-container">
        <NuxtLink to="/" class="logo-link">
          <img src="/images/logo.png" alt="Jobbcentralen" class="logo" />
        </NuxtLink>
        
        <!-- Desktop Navigation -->
        <nav class="desktop-nav">
          <div class="auth-section">
            <NuxtLink to="/signin" class="login-link">
              <span class="login-text">Logga in</span>
              <img src="/pil.svg" alt="Arrow" class="arrow-icon" />
            </NuxtLink>
            <NuxtLink to="/signup" class="register-link">
              <span class="register-text">Registrera dig</span>
            </NuxtLink>
          </div>
        </nav>

        <!-- Mobile Menu Button -->
        <button 
          class="mobile-menu-btn"
          @click="mobileMenuOpen = !mobileMenuOpen"
          :aria-expanded="mobileMenuOpen"
        >
          <svg v-if="!mobileMenuOpen" class="menu-icon" viewBox="0 0 24 24" fill="none">
            <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <svg v-else class="menu-icon" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <!-- Mobile Navigation -->
      <nav v-show="mobileMenuOpen" class="mobile-nav">
        <NuxtLink to="/signin" class="mobile-nav-link" @click="mobileMenuOpen = false">
          <span>Logga in</span>
          <svg class="mobile-arrow" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </NuxtLink>
        <NuxtLink to="/signup" class="mobile-nav-link" @click="mobileMenuOpen = false">
          <span>Registrera dig</span>
        </NuxtLink>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const mobileMenuOpen = ref(false)
</script>

<style scoped>
.header {
  width: 1364px;
  height: 120px;
  border: 1px solid black;
  padding: 6px;
  box-sizing: border-box;
  margin: 6px auto;
  position: relative;
  top: 0;
  background-color: #1D6453;
  z-index: 50;
}

.header-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  height: 6rem;
  cursor: pointer;
}

.logo-link {
  text-decoration: none;
  display: flex;
  align-items: center;
}

/* Desktop Navigation */
.desktop-nav {
  display: flex;
  align-items: center;
}

.auth-section {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  margin-right: 2rem;
  margin-top: 1rem;
}

.login-link {
  display: flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  color: white;
}

.register-link {
  text-decoration: none;
  color: white;
}

.login-text {
  font-family: 'Inter', sans-serif;
  font-weight: bold;
  font-size: 24px;
  color: white;
  cursor: pointer;
}

.register-text {
  font-family: 'Inter', sans-serif;
  font-weight: bold;
  font-size: 13px;
  color: white;
  cursor: pointer;
  margin-right: 1rem;
}

.arrow-icon {
  width: 32px;
  height: 32px;
  filter: brightness(0) invert(1);
}

/* Mobile Menu Button */
.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.mobile-menu-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.menu-icon {
  width: 1.5rem;
  height: 1.5rem;
}

/* Mobile Navigation */
.mobile-nav {
  background-color: #1a5b4a;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.mobile-nav-link {
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  color: white;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  transition: all 0.2s ease;
}

.mobile-nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.mobile-arrow {
  width: 1rem;
  height: 1rem;
  color: white;
  opacity: 0.7;
}

.main-content {
  max-width: 1024px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .desktop-nav {
    display: none;
  }
  
  .mobile-menu-btn {
    display: block;
  }
  
  .header-container {
    padding: 0.75rem 1rem;
    min-height: 70px;
  }
  
  .logo {
    height: 2.5rem;
  }
}

@media (max-width: 480px) {
  .header-container {
    padding: 0.5rem 0.75rem;
    min-height: 60px;
  }
  
  .logo {
    height: 2rem;
  }
  
  .main-content {
    padding: 0 0.75rem;
  }
}
</style>
