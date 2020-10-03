<template>
  <div>
    <div class="mb-4">
      <div class="my-2 font-bold">
        {{postulation.name}}
        <span
          v-for="(sub, sidx) in postulation.matieres"
          :key="sidx"
        >{{" - " + sub.name}}</span>
      </div>
      <div class="pl-4 text-sm">{{postulation.created_at}}</div>

      <hr />
    </div>

    <div class="m-4 text-sm sizingBox w-full sm:w-2/4 md:w-1/4">
      <div>birthday: {{postulation.birthday}}</div>
      <div>first_name: {{postulation.first_name}}</div>
      <div>gender: {{postulation.gender}}</div>
      <div>email: {{postulation.email}}</div>
      <div>phone_number: {{postulation.phone_number}}</div>
      <div>updated_at: {{postulation.updated_at}}</div>
      <div>birthday: {{postulation.birthday}}</div>
    </div>
    <div class="flex justify-end mt-2">
      <vs-button class="justify-right mr-4" @click="accept">Recruter</vs-button>
      <vs-button type="border" color="danger" @click="popupActive=true">Decliner</vs-button>
      <vs-popup
        classContent="popup-example"
        title="Lorem ipsum dolor sit amet"
        :active.sync="popupActive"
      >
        <vs-input class="inputx mb-3" placeholder="declined message" v-model="declinedMessage" />
        <div class="flex justify-end">
          <vs-button type="border" @click="decline">Done</vs-button>
        </div>
      </vs-popup>
    </div>
  </div>
</template>


<script>
import moduleDataList from "@/store/data-list/moduleDataList.js";
var moment = require("moment");
import axios from "axios";

export default {
  name: "ExportationId",
  data() {
    return {
      postulation: null,
      declinedMessage: "",
      popupActive: false,
    };
  },
  methods: {
    accept() {
      let that = this;
      axios
        .get(`/api/teachers/recruit/${that.postulation.id}/accept`)
        .then((res) => {})
        .catch((error) => console.log(error));
    },
    async decline() {
      const data = { decline_msg: this.declinedMessage };

      let that = this;
      await axios
        .post(`/api/teachers/recruit/${that.postulation.id}/decline`, data)
        .then((res) => {})
        .catch((error) => console.log(error));
      that.popupActive = false;
    },
  },
  mounted() {},
  created() {
    // this.postulation = this.$route.params.postulationId;
    this.postulation = this.$route.query;
    // console.log(this.$route.query)
  },
};
</script>

<style lang="scss">
//styling for v-select
.sizingBox {
  padding: 10px 5px;
  border: 1px solid black;
}
</style>