<template>
  <header class="bg-white shadow-sm">
    <div class="flex p-5 items-center max-w-7xl mx-auto sm:p-5">
      <p class="mr-auto font-bold capitalize">employee management system</p>
      <nav class="flex">
        <ul class="flex gap-3 *:text-neutral-400 *:capitalize">
          <li><nuxt-link to="/dashboard">dashboard</nuxt-link></li>
          <li><nuxt-link to="/about">About</nuxt-link></li>
        </ul>
      </nav>
    </div>
  </header>
</template>
