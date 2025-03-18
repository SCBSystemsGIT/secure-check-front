
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import apiClient from '@/plugins/axios';
  
  export default {
    name: 'EmployeeListView',
    setup() {
      const route = useRoute();
      const router = useRouter();
      const companyId = route.params.slug;  // Assuming companyId is passed in the route params
      const company = ref({});
      const employeeList = ref([]);
      const formatRole = (role) => {
        if (Array.isArray(role) && role.length) {
          return role[0].replace('ROLE_', '').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
        }
        return 'No Role Assigned';
      };
  
      // Fetch company details and employees
      const fetchEmployees = async () => {
        try {
          const companyResponse = await apiClient.get(`/company/${companyId}`);
          company.value = companyResponse.data;  
          
          const employeesResponse = await apiClient.get(`/user/list/${companyId}`);
          employeeList.value = employeesResponse.data;  
          console.log('employeeList',employeeList)
        } catch (err) {
          console.error('Error fetching employees:', err);
        }
      };
  
      // Go back to the previous page
      const goBack = () => {
        router.go(-1);  // Go back to the previous page
      };
  
      // Fetch employee data when the component is mounted
      onMounted(() => {
        fetchEmployees();
      });
  
      return {
        company,
        employeeList,
        formatRole,
        goBack,
      };
    },
  };
  </script>


<template>
  <section class="secure-datatable-heading-back">
    <div class="container">
      <div class="row align-items-center">
        <div class="col col-12 col-md-12 col-sm-12">
            <div class="left-back">
              <button class="employee_back" @click="goBack()"><img src="@/assets/back-arrow-table.png" alt="back-arrow" /></button>
            </div>
        </div>
      </div>
    </div>
  </section>
    <div class="container">
      <div class="d-flex justify-content-center align-items-center mb-4">
       
        <h3 class="mt-3">{{ company.name }} Employee List</h3>
      </div>
  
      <div v-if="employeeList.length">
        <table class="mdc-data-table__table">
          <thead>
            <tr class="mdc-data-table__header-row">
              <th class="mdc-data-table__header-cell">ID</th>
              <th class="mdc-data-table__header-cell">Name</th>
              <th class="mdc-data-table__header-cell">Role</th>
              <th class="mdc-data-table__header-cell">Email</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="employee in employeeList" :key="employee.id" class="mdc-data-table__row">
              <td class="mdc-data-table__cell">{{ employee.id }}</td>
              <td class="mdc-data-table__cell">{{ employee.name }}</td>
              <td class="mdc-data-table__cell">{{ formatRole(employee.role) }}</td>
              <td class="mdc-data-table__cell">{{ employee.email }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else>
        <p>No employees found for this company.</p>
      </div>
    </div>
  </template>
  
  <style scoped>
.left-back .employee_back {
    background: transparent;
    padding: 0 !important;
}

table.mdc-data-table__table {
    background: #fff;
    margin-bottom: 40px;
    width: 100%;
    table-layout: fixed;
}
  </style>
  