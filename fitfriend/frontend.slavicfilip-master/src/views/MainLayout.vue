<template>
  <div class="main-layout">
    <nav class="navbar">
      <ul>
        <li v-if="isRegistered && currentUser" class="user-info">
          <button @click="navigateToProfile" class="username-button">
            {{ currentUser && currentUser.email }}
          </button>
        </li>
        <router-link to="/main/chat" class="nav-link">Chat</router-link>
        <router-link to="/main/pretraga" class="nav-link">Pretraga</router-link>
        <router-link to="/main/planiranje" class="nav-link">Planiranje</router-link>
        <router-link to="/main/profile" class="nav-link">Profil</router-link>
        <button @click="logout" class="logout-button">Odjava</button>
      </ul>
    </nav>

    
    <router-view />

    
    <div class="footer-container">
      <div class="footer-text">@FIPU FittBuddy Aplikacija</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'MainLayout',
  computed: {
    ...mapState({
      isRegistered: state => state.isUserRegistered,
      currentUser: state => state.currentUser
    })
  },

  methods: {
    logout() {
      
      this.$store.commit('setUserRegistered', false);
     
      this.$store.commit('setCurrentUser', null);
      
      this.$store.commit('RESET_USER_DATA');
      
      this.$router.push('/register');
    },
    navigateToProfile() {
     
      this.$router.push('/main/profile');
    }
  }
}
</script>

<style scoped>
.main-layout {
  position: relative;
  min-height: 100vh; 
  display: flex;
  flex-direction: column;
  background-image: url('@/assets/slikazateretanu.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.navbar {
  background-color: #007bff; 
  padding: 15px 0; 
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
}

.navbar ul {
  list-style: none;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center; 
}

.navbar li {
  margin-right: 20px;
}

.nav-link {
  text-decoration: none;
  color: #fff;
  font-weight: bold;
  padding: 10px 15px; 
  transition: background-color 0.3s ease, color 0.3s ease;
  border-radius: 4px;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1); 
}

.logout-button,
.username-button {
  padding: 10px 15px; 
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.3s ease; 
}

.logout-button {
  background-color: #dc3545;
  color: #fff;
}

.logout-button:hover {
  background-color: #c82333;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); 
}

.username-button {
  background-color: #0056b3;
  color: #fff;
}

.username-button:hover {
  background-color: #004494;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); 
}

.username-button:focus {
  outline: none;
}

.footer-container {
  margin-top: auto; 
  text-align: center;
  padding: 10px;
  background: rgba(255, 255, 255, 0.8); 
  border-top: 1px solid #ccc; 
}

.footer-text {
  text-transform: uppercasee; 
  font-size: 12px; 
  color: #000; 
}
</style>
