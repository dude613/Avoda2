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
          <div class="info-item" v-if="user.organizations?.length">
            <span class="label">Organizations:</span>
            <ul class="value">
              <li v-for="org in user.organizations" :key="org.id">
                {{ org.name }}
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

const config = useRuntimeConfig();
const { get } = useApi();

interface Organization {
  id: number;
  name: string;
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  organizations?: Organization[];
}

const user = ref<User | null>(null);

const fetchUserProfile = async () => {
  try {
    const response = await get(`/users/profile/me`);
    console.log('API Response:', response);
    user.value = response.data?.user;
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
.value ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.value li {
  background: #e0e0e0;
  padding: 5px;
  margin: 3px 0;
  border-radius: 4px;
}
</style>
