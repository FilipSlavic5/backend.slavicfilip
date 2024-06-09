<template>
  <div class="search-container">
    <h2>Pretraga korisnika</h2>
    <form @submit.prevent="handleSearch">
      <input type="text" v-model="location" placeholder="Lokacija" class="input-field" />
      <input type="text" v-model="interests" placeholder="Interesi" class="input-field" />
      <input type="text" v-model="availability" placeholder="Raspoloživost" class="input-field" />
      <button type="submit" class="search-button">Pretraži</button>
    </form>

    <!-- Prikaz rezultata pretrage -->
    <div v-if="users.length">
      <h3>Rezultati pretrage:</h3>
      <ul>
        <li v-for="user in users" :key="user._id">
          Email: {{ user.userEmail }}
          <span v-if="isFriend(user.userEmail)">- Prijatelj</span>
          <button v-if="!isFriend(user.userEmail)" @click="sendFriendRequest(user.userEmail)" class="friend-button">Send Friend Request</button>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>Nema pronađenih korisnika</p>
    </div>

    <!-- Prikaz zahtjeva za prijateljstvo -->
    <div v-if="friendRequests.length">
      <h3>Pending Friend Requests</h3>
      <ul>
        <li v-for="request in friendRequests" :key="request._id">
          <span>{{ request.requester }} requested friendship</span>
          <div>
            <button @click="acceptRequest(request.requester)" class="accept-button">Accept</button>
            <button @click="declineRequest(request.requester)" class="decline-button">Decline</button>
          </div>
        </li>
      </ul>
    </div>

    <!-- Prikaz prijatelja -->
    <div v-if="friends.length">
      <h3>Prijatelji:</h3>
      <ul class="friends-list">
        <li v-for="friend in friends" :key="friend" @click="selectFriend(friend)" :class="{ 'selected': friend === selectedFriend }">
          {{ friend }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';

export default {
  data() {
    return {
      location: '',
      interests: '',
      availability: '',
      users: [],
      friendRequests: [],
      selectedFriend: null
    };
  },
  computed: {
    ...mapState(['friends']),
  },
  methods: {
    selectFriend(friend) {
      console.log('Friend object before email check:', friend);
      // Ako je friend string, napravimo objekt s email atributom
      if (typeof friend === 'string') {
        friend = { email: friend, name: friend.split('@')[0] };
      } else if (!friend.email) {
        friend.email = friend.userEmail; // ili kako god se zove atribut u backend odgovoru
      }
      console.log('Friend object after email check:', friend);
      this.selectedFriend = friend;
      this.$store.commit('setSelectedFriend', friend);
      this.$router.push({ name: 'Chat' });
    },
    isFriend(email) {
      return this.friends.includes(email);
    },
    async handleSearch() {
      try {
        const response = await axios.post('http://localhost:3000/api/search-users', {
          location: this.location,
          interests: this.interests,
          availability: this.availability
        });
        this.users = response.data;
      } catch (error) {
        console.error('Error searching for users:', error);
        this.users = [];
      }
    },
    async sendFriendRequest(recipientEmail) {
      if (!this.$store.state.currentUser || !recipientEmail) {
        console.error("Requester email or recipient email is missing");
        alert('Requester email or recipient email is missing');
        return;
      }

      const requesterEmail = this.$store.state.currentUser.email;

      try {
        await axios.post('http://localhost:3000/api/friend-request/send', { requesterEmail, recipientEmail });
        alert('Friend request sent!');
      } catch (error) {
        console.error('Error sending friend request:', error.response.data);
        alert('Failed to send friend request.');
      }
    },
    async acceptRequest(requesterEmail) {
      const recipientEmail = this.$store.state.currentUser.email;
      try {
        const response = await axios.post('http://localhost:3000/api/friend-request/accept', { recipientEmail, requesterEmail });
        if (response.status === 200) {
          this.friendRequests = this.friendRequests.filter(req => req.requester !== requesterEmail);
          alert('Request accepted');
        }
      } catch (error) {
        console.error('Error accepting friend request:', error);
      }
    },
    async declineRequest(requesterEmail) {
      const recipientEmail = this.$store.state.currentUser.email;
      try {
        const response = await axios.post('http://localhost:3000/api/friend-request/decline', { recipientEmail, requesterEmail });
        if (response.status === 200) {
          this.friendRequests = this.friendRequests.filter(req => req.requester !== requesterEmail);
          alert('Request declined');
        }
      } catch (error) {
        console.error('Error declining friend request:', error);
      }
    },
    async fetchFriendRequests() {
      try {
        const userEmail = this.$store.state.currentUser.email;
        const response = await axios.get(`http://localhost:3000/api/friend-requests/${userEmail}`);
        console.log('Friend requests received:', response.data);
        this.friendRequests = response.data;
      } catch (error) {
        console.error('Error fetching friend requests:', error);
      }
    }
  },
  created() {
    this.fetchFriendRequests();
    if (this.$store.state.currentUser) {
      this.$store.dispatch('fetchFriends');
    }
  }
}
</script>

<style scoped>
.search-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background: #f0f0f0;
  border-radius: 10px;
}

.input-field {
  width: calc(100% - 20px);
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.input-field:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.search-button,
.friend-button,
.accept-button,
.decline-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
}

.search-button:hover,
.friend-button:hover,
.accept-button:hover,
.decline-button:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.friends-list {
  padding: 0;
  list-style: none;
  margin-top: 20px;
}

.friends-list li {
  background: #fff;
  margin-bottom: 10px;
  padding: 10px 15px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s, box-shadow 0.3s;
}

.friends-list li:hover {
  background-color: #e9ecef;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.friends-list li:active {
  background-color: #007bff; /* Change background color when clicked */
  color: white; /* Change text color */
  transform: scale(0.98); /* Slightly scale down for a pressing effect */
}

@media screen and (max-width: 600px) {
  .search-container {
    max-width: 100%;
    padding: 0 20px;
  }
}
</style>
