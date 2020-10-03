<template>
  <div class="flex items-center my-auto">
    <vs-dropdown class="ffam">
      <div class="flex items-center mt-2 pr-1" href="#">
        Roles
        <i class="pl-1 material-icons">expand_more</i>
      </div>

      <vs-dropdown-menu v-if="roleList">
        <vs-dropdown-item
          class="px-4 py-2"
          divider
          v-for="(param, index) in params.value"
          :key="index"
        >{{param.name}}</vs-dropdown-item>
      </vs-dropdown-menu>
      <vs-dropdown-menu v-else>
        <vs-dropdown-item class="px-2 py-1" divider>No Roles to display</vs-dropdown-item>
      </vs-dropdown-menu>
    </vs-dropdown>
  </div>
</template>

<script>
export default {
  name: "CellRendererRoles",
  data() {
    return {
      fdata: ["role 2", "role 3", "role 4", "role 5"],
    };
  },
  computed: {
    roleList() {
      return this.params.value.length > 0;
    },
  },
};
</script>
<style >
.ffam {
  font-family: "Montserrat", Helvetica, Arial, sans-serif;
}
</style>
