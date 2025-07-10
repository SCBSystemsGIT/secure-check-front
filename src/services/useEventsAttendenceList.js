import apiClient from "@/plugins/axioss";
// services/myService.js
export default {
  async fetchData() { // Add 'async' here
    try {
      const response = await apiClient.get("/eventattendencelist"); // Replace with the correct API URL
     // console.log('i am here',response.data);
      //alert(response);
      return response.data; 
    } catch (error) {
      console.error("Error fetching visitor code data:", error);
      throw new Error("Failed to fetch visitor code data.");
    }
  },

  async fetchVisitorLogCompanyEvent(slug) { // New function added
    try {
      const response = await apiClient.get(`/event/visitorLog/${slug}`);
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
