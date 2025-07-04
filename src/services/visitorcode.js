import apiClient from "@/plugins/axios";

// services/myService.js
export default {
  async fetchData() { // Add 'async' here
    try {
      const response = await apiClient.get("/visitorlog"); // Replace with the correct API URL
      return response.data; 
    } catch (error) {
      console.error("Error fetching visitor code data:", error);
      throw new Error("Failed to fetch visitor code data.");
    }
  },

  async fetchVisitorLogCom(slug) { // New function added
    try {
      const response = await apiClient.get(`/visitorLog/${slug}`);
      console.log('hello',response);
      console.log({ response: response.data });
      return response.data; // Return the data so it can be used where needed
    } catch (error) {
      console.error("Error fetching requests by company:", error);
      throw new Error(error.response ? error.response.data : "Error fetching data");
    }
  },

  async fetchUserLog() { // Add 'async' here
    try {
      const response = await apiClient.get("/userCheckInList"); // Replace with the correct API URL
      return response.data; 
    } catch (error) {
      console.error("Error fetching visitor code data:", error);
      throw new Error("Failed to fetch visitor code data.");
    }
  },


  async fetchVisitorCheckInData(uidn) { // New function added
    try {
      const response = await apiClient.get(`/visitorLog-checkIn/${uidn}`);
      console.log('hello');
      console.log({ response: response.data });
      return response.data; // Return the data so it can be used where needed
    } catch (error) {
      console.error("Error fetching requests by company:", error);
      throw new Error(error.response ? error.response.data : "Error fetching data");
    }
  },


  async fetchUserCheckInData(uidn) { // New function added
    try {
      const response = await apiClient.get(`/userLog-checkIn/${uidn}`);
      console.log('hello');
      console.log({ response: response.data });
      return response.data; // Return the data so it can be used where needed
    } catch (error) {
      console.error("Error fetching requests by company:", error);
      throw new Error(error.response ? error.response.data : "Error fetching data");
    }
  },
  
  anotherServiceMethod(param) {
    return `Processed ${param}`;
  }
};
