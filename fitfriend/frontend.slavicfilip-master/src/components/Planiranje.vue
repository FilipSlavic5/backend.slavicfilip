<template>
  <div class="planner-container">
    <h2 class="header-title">Planiranje Aktivnosti</h2>
    <ul class="task-list">
      <li v-for="(task, index) in activeTasks" :key="index"
          :class="{ 'completed-task': task.completed, 'task-item': true }"
          @click="toggleTaskCompletion(task)">
        {{ task.name }}
      </li>
    </ul>
    <form @submit.prevent="addTask" class="task-form">
      <input type="text" v-model="newTask" placeholder="Dodaj novi zadatak..." class="input-field" />
      <button type="submit" class="add-button">Dodaj</button>
    </form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import axios from 'axios';

export default {
  data() {
    return {
      newTask: ''
    };
  },

  computed: {
    ...mapGetters(['getCurrentUserEmail']),
    activeTasks() {
      return this.$store.state.tasks.filter(task => !task.completed);
    }
  },

  methods: {
    ...mapActions(['fetchTasks']),

    addTask() {
      if (this.newTask.trim() !== '') {
        const userEmail = this.getCurrentUserEmail;
        axios.post('http://localhost:3000/api/tasks', { userEmail, name: this.newTask.trim(), completed: false })
          .then(response => {
            console.log('Task added:', response.data);
            this.$store.dispatch('addTask', response.data);
            this.fetchTasks(userEmail); // Refreshing the task list
          })
          .catch(error => {
            console.error('Error adding task:', error);
          });
        this.newTask = ''; // Resetting the input field
      }
    },

    toggleTaskCompletion(task) {
      const updatedCompletion = !task.completed;
      axios.patch(`http://localhost:3000/api/tasks/${task._id}`, { completed: updatedCompletion })
        .then(response => {
          console.log('Task completion toggled:', response.data);
          // Manually toggle completion to trigger animation without refetching
          task.completed = updatedCompletion;
        })
        .catch(error => {
          console.error('Error toggling task completion:', error);
        });
    }
  },
  
  created() {
    this.fetchTasks(this.getCurrentUserEmail);
  }
};
</script>


<style scoped>
.planner-container {
  max-width: 500px;
  margin: 20px auto;
  padding: 20px;
  background: #f0f0f0;
  border-radius: 10px;
}

.header-title {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
  font-weight: bold;
}

.task-list {
  list-style: none;
  padding: 0;
}

.task-item {
  display: flex;
  align-items: center;
  padding: 12px 10px;
  margin: 5px 0;
  background: #fff;
  border-radius: 8px;
  box-shadow: 2px 2px 5px #ccc, -2px -2px 5px #fff;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
}

.task-item:before {
  content: '•';
  margin-right: 10px;
  color: #28a745; 
  transition: color 0.3s ease;
}

.task-item.completed-task:before {
  color: #ccc; 
}

.task-item:hover {
  background-color: #e9ecef;
  transform: translateX(5px);
}

.completed-task {
  text-decoration: line-through;
  color: #b0b0b0;
}

.input-field {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-shadow: inset 2px 2px 8px #eee, inset -2px -2px 8px #fff;
  transition: box-shadow 0.3s ease;
}

.input-field:focus {
  box-shadow: inset 1px 1px 4px #ddd, inset -1px -1px 4px #fff;
}

.add-button {
  padding: 10px 20px;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  width: 100%;
}

.add-button:hover {
  background-color: #218838;
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0,128,0,0.2);
}
</style>


