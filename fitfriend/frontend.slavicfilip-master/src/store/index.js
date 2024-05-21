import { createStore } from 'vuex';
import axios from 'axios';

const store = createStore({
  state: {
    users: [],
    isUserRegistered: false,
    currentUser: null,
    userProfile: {
      location: '',
      interests: [],
      availability: ''
    },
    tasks: [],
    friendRequests: [],
    friends: []  // Dodajte ovo za pohranu liste prijatelja
  },
  mutations: {
    setCurrentUser(state, user) {
      state.currentUser = user;
    },
    setUserProfile(state, profileData) {
      state.userProfile = { ...profileData };
    },
    setUserRegistered(state, isRegistered) {
      state.isUserRegistered = isRegistered;
    },
    setTasks(state, tasks) {
      state.tasks = tasks;
    },
    addTask(state, task) {
      state.tasks.push(task);
      
    },
    setFriendRequests(state, requests) {
      state.friendRequests = requests;
    },
    removeFriendRequest(state, requesterEmail) {
      state.friendRequests = state.friendRequests.filter(req => req.requester !== requesterEmail);
    },
    setFriends(state, friends) {  // Postavite prijatelje u stanje
      state.friends = friends;
    },
    setSelectedFriend(state, friend) {
      console.log('Attempting to set selected friend:', friend);
      if (friend && friend.email) { // Provjera postojanja atributa email
        state.userProfile.selectedFriend = friend;
        console.log('Selected friend set successfully:', state.userProfile.selectedFriend);
      } else {
        console.error('Selected friend does not have an email attribute.');
      }
    },
    RESET_USER_DATA(state) {
      state.currentUser = null;
      state.userProfile = { location: '', interests: [], availability: '' };
      state.tasks = [];
      state.friendRequests = [];
     
    }
  },
  actions: {
    fetchTasks({ commit }, userEmail) {
      axios.get(`http://localhost:3000/api/tasks/${userEmail}`)
        .then(response => commit('setTasks', response.data))
        .catch(error => console.error("Error fetching tasks:", error));
    },
    addTask({ commit }, task) {
      commit('addTask', task);  // Pretpostavlja se da zadatak već dolazi s backend-a
    },
    fetchFriendRequests({ commit, state }) {
      if (state.currentUser) {
        axios.get(`http://localhost:3000/api/friend-requests/${state.currentUser.email}`)
          .then(response => commit('setFriendRequests', response.data))
          .catch(error => console.error('Error fetching friend requests:', error));
      }
    },
    acceptFriendRequest({ commit }, { requesterEmail }) {
      const recipientEmail = state.currentUser.email;
      axios.post('http://localhost:3000/api/friend-request/accept', { recipientEmail, requesterEmail })
        .then(() => commit('removeFriendRequest', requesterEmail))
        .catch(error => console.error('Error accepting friend request:', error));
    },
    declineFriendRequest({ commit }, { requesterEmail }) {
      const recipientEmail = state.currentUser.email;
      axios.post('http://localhost:3000/api/friend-request/decline', { recipientEmail, requesterEmail })
        .then(() => commit('removeFriendRequest', requesterEmail))
        .catch(error => console.error('Error declining friend request:', error));
    },
    fetchFriends({ commit, state }) {
      if (state.currentUser) {
        axios.get(`http://localhost:3000/api/friends/${state.currentUser.email}`)
          .then(response => {
            const friends = response.data.map(email => ({
              email: email,
              name: email.split('@')[0] // Ovo je samo primjer
            }));
            console.log('Friends fetched:', response.data);
            commit('setFriends', response.data);
          })
          .catch(error => {
            console.error('Error fetching friends:', error);
          });
      }
    },
    
    
    
    fetchUserProfile({ commit, state }) {
      if (state.currentUser) {
        axios.get(`http://localhost:3000/api/profile/${state.currentUser.email}`)
          .then(response => commit('setUserProfile', response.data))
          .catch(error => console.error("Error fetching user profile:", error));
      }
    },
    updateUserProfile({ commit }, profileData) {
      axios.post('http://localhost:3000/api/profile', profileData)
        .then(response => commit('setUserProfile', profileData))
        .catch(error => console.error("Error updating user profile:", error));
    },
    loginUser({ commit }, credentials) {
      axios.post('http://localhost:3000/api/login', credentials)
        .then(response => {
          if (response.data.user) {
            commit('setCurrentUser', response.data.user);
          } else {
            console.error("Login failed, user not added to the store");
          }
        })
        .catch(error => console.error("Error during login:", error));
    }
  },
  getters: {
    getUserByEmail: (state) => (email) => {
      return state.users.find(user => user.email === email);
    },
    getUserProfile: (state) => {
      return state.userProfile;
    },
    getCurrentUserEmail: (state) => {
      return state.currentUser ? state.currentUser.email : null;
    },
    selectedFriend: (state) => {
      return state.selectedFriend;
    }
  }
});

export default store;