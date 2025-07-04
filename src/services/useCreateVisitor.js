import apiClient from "@/plugins/axios";
import { ref } from "vue";

export function useCreateVisitor() {
  const statusCode = ref(null);
  const errorMessage = ref(null);
  const visitorId = ref(null);
  const uidn = ref(null); // Add uidn
  const firstname = ref(null);
  const lastname = ref(null);
  const address = ref(null);
  const state = ref(null);
  const country = ref(null);
  const city = ref(null);
  const zipcode = ref(null);

  const createVisitor = async (visitorData) => {
    try {
      const formData = new FormData();
      
      // Append visitor data to FormData
      Object.keys(visitorData).forEach((key) => {
        if (visitorData[key] !== undefined) {
          formData.append(key, visitorData[key]);
        }
      });
  
      // Append file if available
      if (visitorData.file) {
        formData.append("request_image", visitorData.file);
      }
  
      const response = await apiClient.post("/visitor/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      console.log("statusCode1213", response);
      statusCode.value = response.status;
      visitorId.value = response.data.data.visitor_id;
      uidn.value = response.data.data.uidn;
      firstname.value = response.data.data.firstname;
      lastname.value = response.data.data.lastname;
      address.value = response.data.data.address;
      state.value = response.data.data.state;
      country.value = response.data.data.country;
      city.value = response.data.data.city;
      zipcode.value = response.data.data.zipcode;
  
      console.log("visitor uidn:", uidn.value, {
        data___: response.data,
        visitorId___: visitorId.value,
        uidn___: uidn.value, // Log uidn
      });
  
      return response.data;
    } catch (error) {
      statusCode.value = error.response?.status;
      errorMessage.value =
        error.response?.data?.message || "An unexpected error occurred";
      throw new Error(errorMessage.value);
    }
  };

  return {
    createVisitor,
    statusCode,
    errorMessage,
    visitorId,
    uidn,
    firstname,
    lastname,
    address,
    state,
    country,
    city,
    zipcode,

  };
}
