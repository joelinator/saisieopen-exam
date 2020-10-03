<template>
  <div>
    <div class="flex justify-center pt-20" :style="{'backgroundImage':`url(${logo})`}">
      <vs-input
        label="Nom"
        @click="autofillName()"
        v-model="dataName"
        class="mt-5 w-full"
        name="item-name"
        v-validate="'required'"
      />
      <img :src="logo" alt="img" class="responsive" />
    </div>
    <div class="d-flex justify-content-center">
      <input type="file" class="hidden" ref="imagePicker" @change="imgUpdate()" accept="image/*" />
      <b-button
        squared
        variant="outline-secondary"
        class="mr-2 btn-font-size"
        @click="$refs.imagePicker.click()"
      >Changer la photo</b-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dataName: "",
      image: null,
      logo: null,
    };
  },
  methods: {
    imgUpdate() {
      this.image = this.$refs.imagePicker.files[0];
      const data = new FormData();
      data.append("avatar", this.image);

      const reader = new FileReader();
      reader.onload = (e) => {
        this.logo = e.target.result;
      };
    },
  },
};
</script>

<style lang="scss" scoped>
</style>