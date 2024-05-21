<template>
  <div v-if="selectedFriend && selectedFriend.email" class="chat-container">
    <div class="chat-header">
      <h2>Chat with {{ selectedFriend.name }}</h2>
    </div>
    <div class="message-container">
      <div v-for="(message, index) in messages" :key="index" class="message">
        <div class="message-content">
          <div class="avatar-container">
            <span v-if="message.user" class="user-avatar">
              <i class="fas fa-user-circle"></i>
            </span>
          </div>
          <div>
            <span v-if="message.user" class="username">{{ message.user.username }}</span>
            <span>{{ message.text }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="input-container">
      <input type="text" v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type your message..." class="message-input" />
      <button @click="sendMessage" class="send-button">Send</button>
    </div>
  </div>
  <div v-else>
    <p>Please select a friend to start chatting.</p>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import io from 'socket.io-client';

export default {
  data() {
    return {
      messages: [],
      newMessage: ''
    };
  },
  computed: {
    ...mapState({
      currentUser: state => state.currentUser,
      selectedFriend: state => state.userProfile.selectedFriend  // Pretpostavljamo da je ovo pravilno definirano u Vuex store-u
    })
  },
  mounted() {
    console.log('Current selected friend in Chat.vue:', this.selectedFriend);
    if (this.selectedFriend) {
      const URL = 'http://localhost:3000'; // Prilagodite URL prema potrebi
      console.log('Initializing WebSocket connection to:', URL);
      this.socket = io(URL);

      this.socket.on('connect', () => {
        console.log('WebSocket connection established');
        this.socket.emit('register', this.currentUser.email);
      });

      this.socket.on('connect_error', (error) => {
        console.error('Connection Error:', error);
      });

      this.socket.on('message', message => {
        console.log('New message received:', message);
        if (message.user.email === this.selectedFriend.email) {
          this.messages.push({
            text: message.text,
            user: message.user
          });
        }
      });

      this.socket.on('disconnect', (reason) => {
        console.log('Disconnected:', reason);
        if (reason === 'io server disconnect') {
          this.socket.connect();
        }
      });

      this.socket.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    }
  },
  methods: {
    sendMessage() {
      if (!this.selectedFriend || !this.selectedFriend.email) {
        console.error('Recipient is not selected or does not have an email attribute.');
        return;
      }

      if (this.newMessage.trim() !== '' && this.socket && this.socket.connected) {
        const messageData = {
          text: this.newMessage.trim(),
          recipientEmail: this.selectedFriend.email,
          userEmail: this.currentUser.email
        };

        this.socket.emit('message', messageData, (response) => {
          if (response && response.success) {
            console.log('Message sent successfully');
          } else {
            console.error('Failed to send message');
          }
        });

        this.messages.push({
          text: this.newMessage.trim(),
          user: { email: this.currentUser.email, username: this.currentUser.username }
        });
        this.newMessage = ''; // Reset input field
        console.log('Message sent:', messageData);
      } else {
        console.error('Message is empty, WebSocket is not open, or recipient is not selected.');
      }
    }
  },
  beforeUnmount() {
    if (this.socket) {
      this.socket.close();
    }
  }
};
</script>

<style scoped>
.chat-container {
  max-width: 600px;
  margin: 40px auto; /* Centriranje komponente */
  padding: 20px;
  background: #f0f0f0; /* Neumorfizam - blaga siva pozadina */
  border-radius: 10px;
  box-shadow: 8px 8px 20px #ccc, -8px -8px 20px #fff; /* Neumorfizam - sjene */
}

.chat-header {
  background-color: #007BFF;
  color: white;
  padding: 10px;
  border-radius: 4px 4px 0 0;
}

.message-container {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 20px;
  max-height: 300px;
  overflow-y: auto;
}

.message {
  margin-bottom: 10px;
}

.message-content {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 8px;
}

.username {
  font-weight: bold;
  margin-right: 4px;
}

.message-input {
  padding: 12px; /* Povećavamo padding za input polje */
  margin-top: 10px;
  border: none;
  border-radius: 8px;
  box-shadow: inset 2px 2px 5px #bababe, inset -5px -5px 10px #fff; /* Neumorfizam - unutarnje sjene */
  transition: all 0.3s ease; /* Mikro-interakcije - prijelaz */
}

.message-input:focus {
  box-shadow: inset 1px 1px 2px #bababe, inset -1px -1px 2px #fff; /* Neumorfizam - sjene za fokus */
}

.send-button {
  padding: 12px 24px; /* Povećavamo padding za gumb */
  background-color: #007BFF;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.3s, transform 0.3s ease; /* Mikro-interakcije - prijelaz */
}

.send-button:hover {
  background-color: #0056b3; /* Promjena boje na hover */
  transform: translateY(-2px); /* Dizanje gumba na hover */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Mikro-interakcije - vanjska sjena */
}

/* Dodavanje stilova za responzivnost */
@media only screen and (max-width: 768px) {
  .chat-container {
    max-width: 90%; /* Smanjujemo širinu komponente za manje ekrane */
  }
}
</style>
