<template>
  <vs-chip class="ag-grid-cell-chip" :color="chipColor(params.data)">
    <span>{{params.data.hasOwnProperty('deleted_at')? "Desactiver": "Actif"}}</span>
  </vs-chip>
</template>

<script>
export default {
  name: "CellRendererStatus",
  computed: {
    chipColor() {
      return (value) => {
        if (value.hasOwnProperty("deleted_at")) return "danger";
        else return "success";
      };
    },
  },
};
</script>

<style lang="scss" scpoped>
.ag-grid-cell-chip {
  &.vs-chip-success {
    background: rgba(var(--vs-success), 0.15);
    color: rgba(var(--vs-success), 1) !important;
    font-weight: 500;
  }
  &.vs-chip-warning {
    background: rgba(var(--vs-warning), 0.15);
    color: rgba(var(--vs-warning), 1) !important;
    font-weight: 500;
  }
  &.vs-chip-danger {
    background: rgba(var(--vs-danger), 0.15);
    color: rgba(var(--vs-danger), 1) !important;
    font-weight: 500;
  }
}
</style>
