import apiClient from "@/plugins/axios";
// services/myService.js
export default {
  async fetchData() { // Add 'async' here
    try {
      const response = await apiClient.get("/visitorlog"); // Replace with the correct API URL
      console.log('i am here',response.data);
      //alert(response);
      return response.data; 
    } catch (error) {
      console.error("Error fetching visitor code data:", error);
      throw new Error("Failed to fetch visitor code data.");
    }
  },

  anotherServiceMethod(param) {
    return `Processed ${param}`;
  }
};
