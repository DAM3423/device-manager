<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <span>Device Manager</span>
    </v-app-bar>

    <v-main>
      <DeviceManager />
    </v-main>
  </v-app>
</template>

<script>
import DeviceManager from './components/DeviceManager';

export default {
  name: 'App',

  components: {
    DeviceManager,
  },

  data: () => ({
    //
  }),
};
</script>
