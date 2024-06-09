<template>
  <div class="registration-container">
    <div class="forms-container">
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
    
    <div class="footer-text">@FIPU FittBuddy Aplikacija</div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '', 
      password: '', 
      email: '', 
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
          this.$store.dispatch('loginUser', { email: this.email, password: this.password });
          this.$router.push('/main');
          console.log('Registracija uspješna:', response.data);
        }
      } catch (error) {
        console.error('Greška prilikom registracije:', error);
        if (error.response) {
          console.error('Status:', error.response.status);
          console.error('Poruka:', error.response.data);
        } else if (error.request) {
          console.error('Detalji o zahtjevu:', error.request);
        } else {
          
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
          this.$store.dispatch('loginUser', { email: this.loginEmail, password: this.loginPassword });
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
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  max-width: 100%;
  margin: 40px auto; 
  padding: 20px;
}

.forms-container {
  display: flex;
  justify-content: space-around; 
  width: 100%;
}

.registration-form,
.login-form {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  width: 45%; 
  box-sizing: border-box;
}

.footer-text {
  text-transform: uppercasee;
  font-size: 12px; 
  color: #888;
  margin-top: 200px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  font-weight: bold;
}

.input-field {
  padding: 12px; 
  border: none;
  border-radius: 8px;
  box-shadow: inset 2px 2px 5px #bababe, inset -5px -5px 10px #fff; 
  transition: box-shadow 0.3s ease; 
  width: calc(100% - 24px); 
}

.input-field:focus {
  box-shadow: inset 1px 1px 2px #bababe, inset -1px -1px 2px #fff; 
}

.submit-button {
  padding: 12px;
  border: none;
  border-radius: 8px;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s ease; 
}

.submit-button:hover {
  background-color: #0056b3; 
  transform: translateY(-2px); 
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); 
}


@media only screen and (max-width: 768px) {
  .forms-container {
    flex-direction: column; 
    align-items: center; 
  }

  .registration-form,
  .login-form {
    width: 90%; 
  }
}
</style>
