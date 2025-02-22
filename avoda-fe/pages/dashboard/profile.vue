<template>
  <div class="profile-container">
    <Card class="profile-card">
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
        <CardDescription>View your account details</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="profile-info" v-if="user">
          <div class="info-item">
            <span class="label">ID:</span>
            <span class="value">{{ user.id }}</span>
          </div>
          <div class="info-item">
            <span class="label">Name:</span>
            <span class="value"
              >{{ user.first_name }} {{ user.last_name }}</span
            >
          </div>
          <div class="info-item">
            <span class="label">Email:</span>
            <span class="value">{{ user.email }}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import axios from 'axios';
import { useRuntimeConfig } from '#imports';

const config = useRuntimeConfig();
const route = useRoute();
const user = ref(null);

const fetchUserProfile = async () => {
  try {
    const { id } = route.params;
    const response = await axios.get(
      `${config.public.BASE_URL}/organizations/${id}/members/profile`,
      {
        withCredentials: true,
      }
    );
    user.value = response.data;
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
  }
};

onMounted(fetchUserProfile);
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
