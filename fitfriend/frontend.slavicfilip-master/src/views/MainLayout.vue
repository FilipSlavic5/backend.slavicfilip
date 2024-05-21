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

    <!-- Ovdje će se učitati odgovarajuća komponenta -->
    <router-view />
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
    // Postavljanje statusa registracije korisnika na false
    this.$store.commit('setUserRegistered', false);
    // Resetovanje trenutnog korisnika na null
    this.$store.commit('setCurrentUser', null);
    // Resetovanje svih korisničkih podataka, uključujući zahtjeve za prijateljstvo
    this.$store.commit('RESET_USER_DATA');
    // Preusmjeravanje korisnika na stranicu za registraciju
    this.$router.push('/register');
  },
  navigateToProfile() {
    // Navigacija na korisnički profil
    this.$router.push('/main/profile');
  }
}
}

</script>

<style scoped>
/* Vaš CSS ovdje */
/* Stilovi za komponentu */
.navbar {
  background: linear-gradient(135deg, #007bff, #0056b3); /* Dodan lagani gradijent */
  padding: 15px 0; /* Povećana visina navbara */
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Dodano: neumorfizam za navbar */
}

.navbar ul {
  list-style: none;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center; /* Centriranje linkova */
}

.navbar li {
  margin-right: 20px;
}

.nav-link {
  text-decoration: none;
  color: #fff;
  font-weight: bold;
  padding: 10px 15px; /* Povećana veličina navigacijskih linkova */
  transition: background-color 0.3s ease, color 0.3s ease;
  border-radius: 4px;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1); /* Promijenjena boja pozadine na hover */
}

.logout-button,
.username-button {
  padding: 10px 15px; /* Povećana veličina gumba */
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.3s ease; /* Dodano: mikro-interakcija za boju i sjenu */
}

.logout-button {
  background-color: #dc3545;
  color: #fff;
}

.logout-button:hover {
  background-color: #c82333;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Dodano: neumorfizam za gumb */
}

.username-button {
  background-color: #007bff;
  color: #fff;
}

.username-button:hover {
  background-color: #0056b3;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Dodano: neumorfizam za gumb */
}

.username-button:focus {
  outline: none;
}
</style>
