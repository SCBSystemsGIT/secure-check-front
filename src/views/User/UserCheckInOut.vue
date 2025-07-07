<script>
  export default {
    data() {
      return {
        user: null,
      };
    },
    created() {
      const userId = this.$route.query.user_id;
  
      // Replace this with your actual logic to get user data
      // For example, an API call or from Vuex
      this.fetchUserData(userId);
    },
    methods: {
      async fetchUserData(userId) {
        // Simulate or replace with your API call:
        const userList = [/* Your users with check_logs */];
        this.user = userList.find((u) => u.id == userId);
      },
      formatDate(dateStr) {
        return new Date(dateStr).toLocaleString();
      },
    },
  };
  </script>


<template>
    <div>
      <h2>{{ user?.user_name }}'s Check-In/Out Times</h2>
      <ul style="padding-left: 0; list-style: none; margin-top: 1rem;">
        <li v-for="(log, i) in user?.check_logs" :key="i">
          <b>Check In Time</b>: {{ formatDate(log.check_in) }} <br>
          <b>Check Out Time</b>: {{ formatDate(log.check_out) }}
        </li>
      </ul>
    </div>
  </template>
  