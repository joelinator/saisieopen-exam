<!-- =========================================================================================
  File Name: AddNewDataSidebar.vue
  Description: Add New Data - Sidebar component
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
  <vs-sidebar
    click-not-close
    position-right
    parent="body"
    default-index="1"
    color="primary"
    class="add-new-data-sidebar items-no-padding"
    spacer
    v-model="isSidebarActiveLocal"
  >
    <div class="mt-6 flex items-center justify-between text-center px-6">
      <h4>{{ Cmethod=='add' ?"AJOUTER": ''}} {{ Cmethod=='view' ?"VISUALISER": ''}} UNE REGION</h4>
      <feather-icon icon="XIcon" @click.prevent="erase()" class="cursor-pointer"></feather-icon>
    </div>
    <vs-divider class="mb-6"></vs-divider>

    <component
      :is="scrollbarTag"
      class="scroll-area--data-list-add-new"
      :settings="settings"
      :key="$vs.rtl"
    >
      <div class="px-3">
        <div class="vx-row mb-6 mt-6">
          <div class="vx-col w-full">
            <div class="label mb-1 text-base pl-2">Pays</div>
            <v-select
              :dir="$vs.rtl ? 'rtl' : 'ltr'"
              :disabled="Cmethod=='view'"
              v-model="dataCountry"
              class="h-M w-full"
              name="Country"
              v-validate="'required'"
              :options="countryName"
            >/></v-select>
          </div>
          <span
            class="text-danger text-sm ml-6"
            v-show="errors.has('Country')"
          >{{ errors.first('Country') }}</span>
        </div>
        <div class="vx-row mb-6">
          <div class="vx-col w-full">
            <div class="label mb-1 text-base pl-2">Nom De La Region</div>
             <vs-input placeholder="Nom" class="mb-6" label="Nom" v-model="region.name"></vs-input>
          </div>
          <span
            class="text-danger text-sm ml-6"
            v-show="errors.has('regionName')"
          >{{ errors.first('regionName') }}</span>
        </div>

        <div class="vx-row">
          <div class="vx-col w-full">
            <div class="flex justify-end">
              <vs-button v-if="Cmethod=='add'" @click="submit()" class="mr-3 mb-2">Creer</vs-button>

              <vs-button
                v-if="Cmethod!='view'"
                @click.prevent="erase()"
                color="warning"
                type="border"
                class="mb-2"
              >Annuler</vs-button>
            </div>
          </div>
        </div>
      </div>
    </component>
  </vs-sidebar>
</template>

<script>
import vSelect from "vue-select";
import VuePerfectScrollbar from "vue-perfect-scrollbar";

var moment = require("moment");

export default {
  props: {
    isSidebarActive: {
      type: Boolean,
      required: true,
    },
    data: {
      type: Object,
      default: () => {},
    },
    country: {
      type: Array,
    },
    countryName: {
      type: Array,
    },
    Cmethod: {
      type: String,
      default: "add",
    },
  },
  components: {
    VuePerfectScrollbar,
    "v-select": vSelect,
  },
  data() {
    return {
      dataCountry: null,
      dataRegion: null,
      newData: null,
      settings: {
        // perfectscrollbar settings
        maxScrollbarLength: 60,
        wheelSpeed: 0.6,
      },
    };
  },
  computed: {
    regions() {
      var index;
      var final = [];
      let self = this;
      if (this.country != [] && this.dataCountry != null) {
        index = this.country.findIndex((element) => {
          return element.name == self.dataCountry;
        });
        this.country[index].regions.forEach((element) => {
          final.push(element.name);
        });
        return final;
      }
      return [];
    },
    isSidebarActiveLocal: {
      get() {
        return this.isSidebarActive;
      },
      set(val) {
        if (!val) {
          this.$emit("closeSidebar", false);
          // this.$validator.reset()
          // this.initValues()
        }
      },
    },

    scrollbarTag() {
      return this.$store.getters.scrollbarTag;
    },
  },
  methods: {
    submit() {},

    erase() {
      this.dataPermissions = [];
      this.roleName = null;
      this.$emit("closeSidebar", false);
    },
  },
  // UPDATED
  watch: {},
  mounted() {},
};
</script>

<style lang="scss" scoped>
.add-new-data-sidebar {
  ::v-deep .vs-sidebar--background {
    z-index: 52010;
  }

  ::v-deep .vs-sidebar {
    z-index: 52010;
    width: 400px;
    max-width: 90vw;

    .img-upload {
      margin-top: 2rem;

      .con-img-upload {
        padding: 0;
      }

      .con-input-upload {
        width: 100%;
        margin: 0;
      }
    }
  }
}

.scroll-area--data-list-add-new {
  // height: calc(var(--vh, 1vh) * 100 - 4.3rem);
  height: calc(var(--vh, 1vh) * 100 - 16px - 45px - 82px);

  &:not(.ps) {
    overflow-y: auto;
  }
}
</style>
