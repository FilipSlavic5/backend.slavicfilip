<template>
  <div class="registration-container">
    <div class="registration-form">
      <h2>Registracija</h2>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="username">Korisničko ime:</label>
          <input type="text" id="username" v-model="username" placeholder="Unesite korisničko ime" class="input-field" />
        </div>
        <div class="form-group">
          <label for="password">Lozinka:</label>
          <input type="password" id="password" v-model="password" placeholder="Unesite lozinku" class="input-field" />
        </div>
        <div class="form-group">
          <label for="email">Email adresa:</label>
          <input type="email" id="email" v-model="email" placeholder="Unesite email adresu" class="input-field" />
        </div>
        <button type="submit" class="submit-button">Registriraj se</button>
      </form>
    </div>

    <!-- Prikaz login forme -->
    <div class="login-form">
      <h2>Prijava</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="loginEmail">Email adresa:</label>
          <input type="email" id="loginEmail" v-model="loginEmail" placeholder="Unesite email adresu" class="input-field" />
        </div>
        <div class="form-group">
          <label for="loginPassword">Lozinka:</label>
          <input type="password" id="loginPassword" v-model="loginPassword" placeholder="Unesite lozinku" class="input-field" />
        </div>
        <button type="submit" class="submit-button">Prijavi se</button>
      </form>
    </div>
  </div>
</template>


<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '', // Definicija svojstva "username"
      password: '', // Definicija svojstva "password"
      email: '', // Ostala svojstva ako su potrebna
      loginEmail: '',
      loginPassword: ''
    };
  },

  methods: {
    async handleRegister() {
      try {
        const response = await axios.post('http://localhost:3000/api/register', {
          username: this.username,
          email: this.email,
          password: this.password
        });
        if (response.data) {
          this.$store.dispatch('loginUser', {email: this.email, password: this.password});
          this.$router.push('/main');
          console.log('Registracija uspješna:', response.data);
        }
      } catch (error) {
        console.error('Greška prilikom registracije:', error);
        if (error.response) {
          console.error('Status:', error.response.status);
      console.error('Poruka:', error.response.data);
    } else if (error.request) {   console.error('Detalji o zahtjevu:', error.request);
    } else {
      // Ako se dogodila greška prilikom postavljanja zahtjeva, ispiši generičku poruku
      console.error('Došlo je do greške prilikom postavljanja zahtjeva:', error.message);
    }
  }
      
    },
    async handleLogin() {
      try {
        const response = await axios.post('http://localhost:3000/api/login', {
          email: this.loginEmail,
          password: this.loginPassword
        });
        if (response.data) {
          this.$store.dispatch('loginUser', {email: this.loginEmail, password: this.loginPassword});
          this.$router.push('/main');
          console.log('Prijava uspješna:', response.data);
        }
      } catch (error) {
        console.error('Greška pri prijavi:', error);
      }
    }
  }
};
</script>

<style scoped>
.registration-container {
  display: flex; /* Koristimo flexbox za horizontalni raspored */
  max-width: 100%;
  margin: 40px auto; /* Centriranje komponente */
  padding: 20px;
  justify-content: space-around; /* Razmak između formi */
}

.registration-form,
.login-form {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  width: 45%; /* Širina svake forme */
}

.form-group {
  margin-bottom: 15px;
}

label {
  font-weight: bold;
}

.input-field {
  padding: 12px; /* Povećavamo padding za input polje */
  border: none;
  border-radius: 8px;
  box-shadow: inset 2px 2px 5px #bababe, inset -5px -5px 10px #fff; /* Neumorfizam - unutarnje sjene */
  transition: box-shadow 0.3s ease; /* Mikro-interakcije - prijelaz */
  width: calc(100% - 24px); /* Smanjujemo širinu zbog paddinga */
}

.input-field:focus {
  box-shadow: inset 1px 1px 2px #bababe, inset -1px -1px 2px #fff; /* Neumorfizam - sjene za fokus */
}

.submit-button {
  padding: 12px;
  border: none;
  border-radius: 8px;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s ease; /* Mikro-interakcije - prijelaz */
}

.submit-button:hover {
  background-color: #0056b3; /* Promjena boje na hover */
  transform: translateY(-2px); /* Dizanje gumba na hover */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Mikro-interakcije - vanjska sjena */
}

/* Dodavanje stilova za responzivnost */
@media only screen and (max-width: 768px) {
  .registration-container {
    flex-direction: column; /* Za manje ekrane, prebacujemo na vertikalni raspored */
    align-items: center; /* Centriramo elemente */
  }

  .registration-form,
  .login-form {
    width: 90%; /* Smanjujemo širinu formi za manje ekrane */
  }
}
</style>

