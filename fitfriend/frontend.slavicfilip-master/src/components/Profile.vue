<template>
  <div class="profile">
    <h2>Korisnički Profil</h2>
    <form @submit.prevent="saveProfile">
      <label for="location">Lokacija:</label>
      <input type="text" id="location" v-model="location" required>

      <label for="interests">Interes:</label>
      <input type="text" id="interests" v-model="interests" required>

      <label for="availability">Raspoloživost:</label>
      <input type="text" id="availability" v-model="availability" required>

      <button :class="{ 'green-button': profileSaved }" type="submit">{{ profileSaved ? 'Profil uspješno spremljen' : 'Spremi Profil' }}</button>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import axios from 'axios';

export default {
  computed: {
    ...mapGetters({
      getUserProfile: 'getUserProfile',
      userEmail: 'getCurrentUserEmail'
    })
  },
  data() {
    return {
      location: '',
      interests: '',
      availability: '',
      profileSaved: false
    };
  },
  created() {
    this.loadProfile();
  },
  methods: {
    ...mapActions(['fetchUserProfile', 'updateUserProfile']),

    async loadProfile() {
      await this.fetchUserProfile();
      const profile = this.getUserProfile;
      if (profile) {
        this.location = profile.location;
        this.interests = profile.interests;
        this.availability = profile.availability;
      }
    },

    async saveProfile() {
  console.log('Saving profile...'); 
  if (!this.userEmail) {
    console.error('Email korisnika nije dostupan.');
    return;
  }

      const profileData = {
        userEmail: this.userEmail,
        location: this.location,
        interests: this.interests,
        availability: this.availability
      };

      try {
        await this.updateUserProfile(profileData);
        console.log('Profil uspješno spremljen');
        this.profileSaved = true; // Postavljamo flag da je profil spremljen
      } catch (error) {
        console.error('Greška pri spremanju profila:', error);
      }
    }
  }
};
</script>

<style scoped>
.profile {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  border-radius: 10px;
  background: #f0f0f0; 
}

.profile form {
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;
}

.profile label {
  margin-top: 12px;
  font-weight: bold;
  color: #555; 
}

.profile input, .profile button {
  width: 90%;
  padding: 12px;
  margin-top: 10px;
  border: none;
  border-radius: 8px;
  box-shadow: inset 2px 2px 5px #bababe, inset -5px -5px 10px #fff; 
  transition: all 0.3s ease;
}

.profile input:focus, .profile button:focus {
  box-shadow: inset 1px 1px 2px #bababe, inset -1px -1px 2px #fff; 
}

.profile button {
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.3s, transform 0.3s ease;
}

.profile button:hover {
  background-color: #0056b3;
  transform: translateY(-2px); 
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); 
}

.green-button {
  background-color: #28a745;
  color: white;
}

.green-button:hover {
  background-color: #1e7e34;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 128, 0, 0.2);
}
</style>
