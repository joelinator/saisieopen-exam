<template>
  <div class="flex justify-center w-full">
    <div class="mainholder w-3/5 flex-grow">
      <div class="flex items-center">
        <vs-input
          icon-pack="feather"
          icon="icon-search"
          placeholder="search"
          v-model="filterText"
          class="mr-2"
        />
        <div class="demo-alignment">
          <vs-dropdown :color="colorx">
            <a class="flex items-center" href="#">
              {{Clabel}}
              <i class="material-icons">expand_more</i>
            </a>

            <vs-dropdown-menu>
              <vs-dropdown-item
                divider
                v-for="(label, idx) in subjectNames"
                :key="idx"
                @click="Clabel=label"
              >{{label}}</vs-dropdown-item>
            </vs-dropdown-menu>
          </vs-dropdown>
        </div>
      </div>
      <div class="mb-4" v-for="(postulation, indx) in filteredPostulations" :key="indx">
        <router-link :to="{path:'/postulations/'+postulation.id, query:postulation}">
          <div class="my-2 font-bold">
            {{postulation.name}}
            <span v-for="(sub, sidx) in postulation.matieres" :key="sidx">{{" - " + sub.name}}</span>
          </div>
          <div class="pl-4 text-sm">{{postulation.created_at}}</div>
        </router-link>
        <hr />
      </div>
    </div>
  </div>
</template>


<script>
import moduleDataList from "@/store/data-list/moduleDataList.js";
import axios from "axios";

export default {
  name: "Postulations",
  data() {
    return {
      postulationList: null,
      filterText: "",
      subjectNames: [],
      Clabel: "All Subjects",
    };
  },
  // components: {
  //   flatPickr,
  //   Datepicker,
  //   "v-select": vSelect,
  //   OrganisationOfDoc,
  // },
  computed: {
    filteredPostulations() {
      return this.filteredBySub.filter((element) => {
        return element.name.toLowerCase().match(this.filterText.toLowerCase());
      });
    },
    filteredBySub() {
      let that = this;
      if (that.Clabel != "All Subjects") {
        return that.postulationList.filter((element) => {
          // if(that.Clabel!="All Subjects"){return that.fruits.filter((element) => {
          // return element.subject.toLowerCase().match(that.Clabel.toLowerCase());
          let subs = "";
          element.matieres.forEach((sub) => {
            subs = subs + sub.name;
          });
          console.log(subs);
          console.log(that.Clabel);
          return subs.toLowerCase().match(that.Clabel.toLowerCase());
        });
      } else {
        return that.postulationList;
      }
    },
    // this returns an  object of all countries
  },
  watch: {},
  methods: {
    formatDuration(d) {
      return helpers.formatDuration(d);
    },
  },

  mounted() {},
  async created() {
    let that = this;
    await axios
      .get(`/api/teachers/recruit/`)
      .then((res) => {
        that.postulationList = res.data;
        console.log(res.data);
      })
      .catch((error) => console.log(error));

    await that.postulationList.forEach((postu) => {
      postu.matieres.forEach((mat) => {
        if (that.subjectNames.includes(mat.name)) {
        } else {
          that.subjectNames.push(mat.name);
        }
      });
    });
    if (that.subjectNames.length > 0) {
      that.subjectNames.push("All Subjects");
    }
    console.log("posts", this.postulationList);
    console.log("subs", this.subjectNames);
  },
};
</script>

<style lang="scss">
//styling for v-select

@media (max-width: 600px) {
  .mainholder {
    width: 90% !important;
  }
}

.vs-holder {
  margin-top: 17px;
  div {
    padding: 3px 0;
  }
  .label {
    padding-left: 5px;
    font-size: 0.85rem;
    color: rgba(0, 0, 0, 0.7);
  }
}
//
.buy-now {
  position: fixed;
  bottom: 5%;
  right: 79px;
  z-index: 51000;
  box-shadow: 0 1px 20px 1px rgb(251, 67, 79);
}
.buy-now1 {
  position: fixed;
  bottom: 5%;
  right: 250px;
  z-index: 51000;
  box-shadow: 0 1px 20px 1px rgb(16, 76, 155);
}
.buy-now2 {
  position: fixed;
  bottom: 5%;
  right: 380px;
  z-index: 51000;
  box-shadow: 0 1px 20px 1px rgb(12, 134, 114);
}
.buy-now3 {
  position: fixed;
  bottom: 5%;
  right: 480px;
  z-index: 51000;
  box-shadow: 0 1px 20px 1px rgb(251, 67, 79);
}
.dropdown-button-container {
  display: flex;
  align-items: center;

  .btnx {
    border-radius: 5px 0px 0px 5px;
  }

  .btn-drop {
    border-radius: 0px 5px 5px 0px;
    border-left: 1px solid rgba(255, 255, 255, 0.2);
  }
}
// section bellow is for animations
/* Enter and leave animations can use different */
/* durations and timing functions.              */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>