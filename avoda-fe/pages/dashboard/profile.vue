<template>
  <div class="profile-container">
    <Card class="profile-card">
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
        <CardDescription>View your account details</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="profile-info">
          <div class="info-item">
            <span class="label">Name:</span>
            <span class="value">{{ user.name }}</span>
          </div>
          <div class="info-item">
            <span class="label">Email:</span>
            <span class="value">{{ user.email }}</span>
          </div>
          <div class="info-item">
            <span class="label">Registration Date:</span>
            <span class="value">{{ user.registrationDate }}</span>
          </div>
          <div class="info-item">
            <span class="label">Last Login:</span>
            <span class="value">{{ user.lastLogin }}</span>
          </div>
          <div class="info-item">
            <span class="label">Status:</span>
            <span class="value">{{ user.status }}</span>
          </div>
          <div class="info-item">
            <span class="label">Assigned Roles:</span>
            <span class="value">{{ user.roles.join(', ') }}</span>
          </div>
          <div class="info-item">
            <span class="label">Department:</span>
            <span class="value">{{ user.department }}</span>
          </div>
          <div class="info-item">
            <span class="label">Default Billable Rate:</span>
            <span class="value">{{ user.billableRate }}</span>
          </div>
          <div class="info-item">
            <span class="label">Hours Tracked:</span>
            <span class="value"
              >24H: {{ user.hoursTracked24h }}, 7D:
              {{ user.hoursTracked7d }}</span
            >
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

const user = ref({
  name: 'John Doe',
  email: 'johndoe@example.com',
  registrationDate: '2023-05-15',
  lastLogin: '2025-02-21 10:45 AM',
  status: 'Active',
  roles: ['Admin', 'Manager'],
  department: 'Engineering',
  billableRate: '$50/hr',
  hoursTracked24h: 8,
  hoursTracked7d: 40,
});
</script>

<style scoped>
.profile-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f9f9f9;
}
.profile-card {
  width: 400px;
  padding: 20px;
  border-radius: 8px;
}
.profile-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.info-item {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  padding: 5px 0;
}
.label {
  font-weight: bold;
  color: #333;
}
.value {
  color: #555;
}
</style>
