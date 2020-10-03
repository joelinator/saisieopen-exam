<template>
  <div class="mb-8">
    <vs-card>
      <div class="text-xl">ORGANISATION DE DOCUMENT</div>
      <div class="flex flex-wrap">
        <div class="w-1/3 text-left">
          <!-- level one of draggable is for each subject -->
          <draggable :list="Subjects" group="subjectName" class="p-2 cursor-move">
            <div v-for="(subject, index) in Subjects" :key="index">
              <div>{{subject.subjectName}}</div>
              <div class="ml-2">
                <!-- level two of draggable is for each sequence -->
                <draggable
                  :list="subject.exams"
                  :group="'examName'+subject.subjectName"
                  class="p-2 cursor-move"
                >
                  <div v-for="(exam, sub_index) in subject.exams" :key="sub_index">
                    <div>{{exam.name}}</div>
                    <div class="ml-2">
                      <!-- level three of draggable is for each exam paper -->
                      <draggable
                        :list="exam.exam"
                        :group="'paperName'+subject.subjectName+sub_index"
                        class="p-2 cursor-move"
                      >
                        <div v-for="(exampaper, sub_sub_index) in exam.exam" :key="sub_sub_index">
                          <div>{{exampaper}}</div>
                        </div>
                      </draggable>
                    </div>
                  </div>
                </draggable>
              </div>
            </div>
          </draggable>

          <draggable :list="concours" :group="'paperName'" class="p-2 cursor-move">
            <div v-for="(conc, index) in concours" :key="index">
              <div>{{conc.name}}</div>
            </div>
          </draggable>
        </div>

        <div class="w-2/3 borderDiv p-2">
          <div class="text-center text-xl font-bold">Niveaux d'hierarchie</div>
          <div class="ml-4 sm:ml-8">
            <div class="flex items-center flex-wrap">
              <div class="w-1/2 text-left">classe(s)</div>
              <div class="centerx">
                <vs-input-number min="2" max="6" v-model="form.classnum" />
              </div>
            </div>
            <div class="flex items-center flex-wrap">
              <div class="w-1/2 text-left">Matiere(s)</div>
              <div class="centerx">
                <vs-input-number min="2" max="6" v-model="form.matierenum" />
              </div>
            </div>

            <div class="flex items-center flex-wrap">
              <div class="w-1/2 text-left">Annee</div>
              <div class="centerx">
                <vs-input-number min="2" max="6" v-model="form.sessionnum" />
              </div>
            </div>

            <div class="flex items-center flex-wrap">
              <div class="w-1/2 text-left">Pays</div>
              <div class="centerx">
                <vs-input-number min="1" max="1" v-model="form.paysnum" />
              </div>
            </div>

            <div class="flex items-center flex-wrap">
              <div class="w-1/2 text-left">Region(s)</div>
              <div class="centerx">
                <vs-input-number min="2" max="6" v-model="form.regionnum" />
              </div>
            </div>

            <div class="flex items-center flex-wrap">
              <div class="w-1/2 text-left">Establissement(s)</div>
              <div class="centerx">
                <vs-input-number min="2" max="6" v-model="form.establissementnum" />
              </div>
            </div>
          </div>
          <div class="flex justify-end mt-2">
            <vs-button type="border" color="danger" @click="initValues">Reinitialiser</vs-button>
          </div>
        </div>
      </div>

      <div class="flex justify-end mt-2">
        <vs-button class="justify-right mr-4" type="border" color="danger">Annuler</vs-button>
        <vs-button>Suivant</vs-button>
      </div>
      <!-- <pre>{{tempObject[this.order[0]]}}</pre> -->
      <vs-button @click="distributeVals">show vals</vs-button>
      <vs-button @click="hh">show vals</vs-button>
      <vs-button @click="h">show</vs-button>
    </vs-card>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import cameroon from "./cameroon.json";
export default {
  components: {
    draggable,
  },
  data() {
    return {
      newData: null,
      builtObject: null,
      result: null,
      order: ["pays", "region", "schools", "classes", "matieres", "session"],
      country: cameroon,
      regions: [],
      schools: [],
      classes: [],
      matieres: [],
      annees: [],
      concours: [],
      entrances: [],
      exams: [],

      form: {
        paysnum: 1,
        regionnum: 2,
        establissementnum: 3,
        classnum: 4,
        matierenum: 5,
        sessionnum: 6,
      },
      Subjects: [
        {
          subjectName: "Maths",
          exams: [
            { name: "Sequence1", exam: ["Epreuve 1", "Epreuve 2"] },
            { name: "Sequence 2", exam: ["Epreuve 1", "Epreuve 2"] },
            { name: "Examens", exam: ["Epreuve 1", "Epreuve 2"] },
          ],
        },
        {
          subjectName: "Physique",
          exams: [
            { name: "Sequence1", exam: ["Epreuve 1", "Epreuve 2"] },
            { name: "Sequence 2", exam: ["Epreuve 1", "Epreuve 2"] },
            { name: "Examens", exam: ["Epreuve 1", "Epreuve 2"] },
          ],
        },
        {
          subjectName: "Chemin",
          exams: [
            { name: "Sequence1", exam: ["Epreuve 1", "Epreuve 2"] },
            { name: "Sequence 2", exam: ["Epreuve 1", "Epreuve 2"] },
            { name: "Examens", exam: ["Epreuve 1", "Epreuve 2"] },
          ],
        },
      ],
    };
  },
  // mounted(){
  //   this.distributeVals()
  // },
  watch: {
    "form.regionnum"() {
      if (this.form.regionnum >= 2 && this.form.regionnum < 7) {
        const temp = this.order[this.form.regionnum - 1];

        const currentIndx = this.order.indexOf("region");

        this.order[this.form.regionnum - 1] = "region";
        this.order[currentIndx] = temp;
        this.rejustOrder();
      }
    },
    "form.establissementnum"() {
      if (this.form.establissementnum >= 2 && this.form.establissementnum < 7) {
        const temp = this.order[this.form.establissementnum - 1];

        const currentIndx = this.order.indexOf("schools");

        this.order[this.form.establissementnum - 1] = "schools";
        this.order[currentIndx] = temp;
        this.rejustOrder();
      }
    },
    "form.classnum"() {
      if (this.form.classnum >= 2 && this.form.classnum < 7) {
        const temp = this.order[this.form.classnum - 1];

        const currentIndx = this.order.indexOf("classes");

        this.order[this.form.classnum - 1] = "classes";
        this.order[currentIndx] = temp;
        this.rejustOrder();
      }
    },
    "form.matierenum"() {
      if (this.form.matierenum >= 2 && this.form.matierenum < 7) {
        const temp = this.order[this.form.matierenum - 1];

        const currentIndx = this.order.indexOf("matieres");

        this.order[this.form.matierenum - 1] = "matieres";
        this.order[currentIndx] = temp;
        this.rejustOrder();
      }
    },

    "form.sessionnum"() {
      if (this.form.sessionnum >= 2 && this.form.sessionnum < 7) {
        const temp = this.order[this.form.sessionnum - 1];

        const currentIndx = this.order.indexOf("session");

        this.order[this.form.sessionnum - 1] = "session";
        this.order[currentIndx] = temp;
        this.rejustOrder();
      }
    },
  },
  computed: {
    countryData() {
      return {
        code: this.country.code,
        updated_at: this.country.updated_at,
        name: this.country.name,
        created_at: this.country.created_at,
        id: this.country.id,
      };
    },
    jsonOrg() {
      let tempObject = {
        pays: this.countryData,
        region: this.regions,
        schools: this.schools,
        classes: this.classes,
        matieres: this.matieres,
        annees: this.annees,
        concours: this.concours,
        entrances: this.entrances,
        exams: this.exams,
      };
      // tempObject[this.order[0]][this.order[1]] = tempObject[this.order[1]]
      this.builtObject = tempObject;
      return tempObject;

      // return tempObject[this.order[0]]
    },
  },
  methods: {
    // the technique here is that we are going to fill from buttom
    // and in this method bellow the lable session is representing annees
    getChildren(parent, child) {
      //1
      //
      //
      //
      if (this.order[parent] == "region" && this.order[child] == "schools") {
        let that = this;
        this.builtObject.region.forEach((region) => {
          region.schools = [];
          that.builtObject.schools.forEach((school) => {
            if (school["key"].startsWith(region["key"])) {
              region.schools.push(school);
            }
          });
        });
        if (parent == 0) {
          return this.builtObject.region;
        } else {
          this.getChildren(parent - 1, child - 1);
        }
        //
      }
      //2
      if (this.order[parent] == "region" && this.order[child] == "classes") {
        //
        let that = this;
        this.builtObject.region.forEach((region) => {
          region.classes = [];
          that.builtObject.classes.forEach((cls) => {
            if (cls["key"].startsWith(region["key"])) {
              region.classes.push(cls);
            }
          });
        });
        if (parent == 0) {
          return this.builtObject.region;
        } else {
          this.getChildren(parent - 1, child - 1);
        }
        //
      }
      //3
      if (this.order[parent] == "region" && this.order[child] == "matieres") {
        //
        let that = this;
        this.builtObject.region.forEach((region) => {
          region.matieres = [];
          that.builtObject.matieres.forEach((mat) => {
            if (mat["key"].startsWith(region["key"])) {
              region.matieres.push(mat);
            }
          });
        });
        if (parent == 0) {
          return this.builtObject.region;
        } else {
          this.getChildren(parent - 1, child - 1);
        }
        //
      }
      //4
      if (this.order[parent] == "region" && this.order[child] == "session") {
        let that = this;
        this.builtObject.region.forEach((region) => {
          region.annees = [];
          that.builtObject.annees.forEach((yr) => {
            if (yr["key"].startsWith(region["key"])) {
              region.annees.push(yr);
            }
          });
        });
        if (parent == 0) {
          return this.builtObject.region;
        } else {
          this.getChildren(parent - 1, child - 1);
        }
      }
      //5
      if (this.order[parent] == "schools" && this.order[child] == "classes") {
        let that = this;
        this.builtObject.schools.forEach((school) => {
          school.classes = [];
          that.builtObject.classes.forEach((cls) => {
            if (cls["key"].startsWith(school["key"])) {
              school.classes.push(cls);
            }
          });
        });
        if (parent == 0) {
          return this.builtObject.schools;
        } else {
          this.getChildren(parent - 1, child - 1);
        }
      }
      //6
      if (this.order[parent] == "schools" && this.order[child] == "matieres") {
        let that = this;
        this.builtObject.schools.forEach((school) => {
          school.matieres = [];
          that.builtObject.matieres.forEach((mat) => {
            if (mat["key"].startsWith(school["key"])) {
              school.matieres.push(mat);
            }
          });
        });
        if (parent == 0) {
          return this.builtObject.schools;
        } else {
          this.getChildren(parent - 1, child - 1);
        }
      }

      //7
      if (this.order[parent] == "schools" && this.order[child] == "session") {
        let that = this;
        this.builtObject.schools.forEach((school) => {
          school.annees = [];
          that.builtObject.annees.forEach((yr) => {
            if (yr["key"].startsWith(school["key"])) {
              school.annees.push(yr);
            }
          });
        });
        if (parent == 0) {
          return this.builtObject.schools;
        } else {
          this.getChildren(parent - 1, child - 1);
        }
      }
      //8
      if (this.order[parent] == "schools" && this.order[child] == "region") {
        let that = this;
        this.builtObject.schools.forEach((school) => {
          school.region = [];
          that.builtObject.region.forEach((reg) => {
            if (school["key"].startsWith(reg["key"])) {
              school.region.push(reg);
            }
          });
        });
        if (parent == 0) {
          return this.builtObject.schools;
        } else {
          this.getChildren(parent - 1, child - 1);
        }
      }
      //9
      if (this.order[parent] == "classes" && this.order[child] == "matieres") {
        let that = this;
        this.builtObject.classes.forEach((cls) => {
          cls.matieres = [];
          that.builtObject.matieres.forEach((mat) => {
            if (mat["key"].startsWith(cls["key"])) {
              cls.matieres.push(mat);
            }
          });
        });
        if (parent == 0) {
          return this.builtObject.classes;
        } else {
          this.getChildren(parent - 1, child - 1);
        }
      }

      //10
      if (this.order[parent] == "classes" && this.order[child] == "session") {
        let that = this;
        this.builtObject.classes.forEach((cls) => {
          cls.annees = [];
          that.builtObject.annees.forEach((yr) => {
            if (yr["key"].startsWith(cls["key"])) {
              cls.annees.push(yr);
            }
          });
        });
        if (parent == 0) {
          return this.builtObject.classes;
        } else {
          this.getChildren(parent - 1, child - 1);
        }
      }
      //11
      if (this.order[parent] == "classes" && this.order[child] == "region") {
        let that = this;
        this.builtObject.classes.forEach((cls) => {
          cls.region = [];
          that.builtObject.region.forEach((reg) => {
            if (cls["key"].startsWith(reg["key"])) {
              cls.region.push(reg);
            }
          });
        });
        if (parent == 0) {
          return this.builtObject.classes;
        } else {
          this.getChildren(parent - 1, child - 1);
        }
      }
      //12
      if (this.order[parent] == "classes" && this.order[child] == "schools") {
        let that = this;
        this.builtObject.classes.forEach((cls) => {
          cls.schools = [];
          that.builtObject.schools.forEach((skl) => {
            if (cls["key"].startsWith(skl["key"])) {
              cls.schools.push(skl);
            }
          });
        });
        if (parent == 0) {
          return this.builtObject.classes;
        } else {
          this.getChildren(parent - 1, child - 1);
        }
      }

      //13
      if (this.order[parent] == "matieres" && this.order[child] == "session") {
        let that = this;
        that.builtObject.matieres.forEach((mat) => {
          mat.annees = [];
          that.builtObject.annees.forEach((yr) => {
            if (yr["key"].startsWith(mat["key"])) {
              mat.annees.push(yr);
            }
          });
        });
        if (parent == 0) {
          return this.builtObject.matieres;
        } else {
          this.getChildren(parent - 1, child - 1);
        }
      }
      //14
      if (this.order[parent] == "matieres" && this.order[child] == "region") {
        let that = this;
        that.builtObject.matieres.forEach((mat) => {
          mat.region = [];
          that.builtObject.region.forEach((reg) => {
            if (mat["key"].startsWith(reg["key"])) {
              mat.region.push(reg);
            }
          });
        });
        if (parent == 0) {
          return this.builtObject.matieres;
        } else {
          this.getChildren(parent - 1, child - 1);
        }
      }
      //15
      if (this.order[parent] == "matieres" && this.order[child] == "schools") {
        let that = this;
        that.builtObject.matieres.forEach((mat) => {
          mat.schools = [];
          that.builtObject.schools.forEach((skl) => {
            if (mat["key"].startsWith(skl["key"])) {
              mat.schools.push(skl);
            }
          });
        });
        if (parent == 0) {
          return this.builtObject.matieres;
        } else {
          this.getChildren(parent - 1, child - 1);
        }
      }
      //16
      if (this.order[parent] == "matieres" && this.order[child] == "classes") {
        let that = this;
        that.builtObject.matieres.forEach((mat) => {
          mat.classes = [];
          that.builtObject.classes.forEach((cls) => {
            if (mat["key"].startsWith(cls["key"])) {
              mat.classes.push(cls);
            }
          });
        });
        if (parent == 0) {
          return this.builtObject.matieres;
        } else {
          this.getChildren(parent - 1, child - 1);
        }
      }

      //17
      if (this.order[parent] == "session" && this.order[child] == "region") {
        let that = this;
        this.builtObject.annees.forEach((yr) => {
          yr.region = [];
          that.builtObject.region.forEach((reg) => {
            if (yr["key"].startsWith(reg["key"])) {
              yr.region.push(reg);
            }
          });
        });
        if (parent == 0) {
          return this.builtObject.annees;
        } else {
          this.getChildren(parent - 1, child - 1);
        }
      }
      //18
      if (this.order[parent] == "session" && this.order[child] == "schools") {
        let that = this;
        that.builtObject.annees.forEach((yr) => {
          yr.schools = [];
          that.builtObject.schools.forEach((skl) => {
            if (yr["key"].startsWith(skl["key"])) {
              yr.schools.push(skl);
            }
          });
        });
        if (parent == 0) {
          return this.builtObject.annees;
        } else {
          this.getChildren(parent - 1, child - 1);
        }
      }
      //19
      if (this.order[parent] == "session" && this.order[child] == "classes") {
        let that = this;
        that.builtObject.annees.forEach((yr) => {
          yr.classes = [];
          that.builtObject.classes.forEach((cls) => {
            if (yr["key"].startsWith(cls["key"])) {
              yr.classes.push(cls);
            }
          });
        });
        if (parent == 0) {
          return this.builtObject.annees;
        } else {
          this.getChildren(parent - 1, child - 1);
        }
      }
      //20
      if (this.order[parent] == "session" && this.order[child] == "matieres") {
        let that = this;
        that.builtObject.annees.forEach((yr) => {
          yr.matieres = [];
          that.builtObject.matieres.forEach((mat) => {
            if (yr["key"].startsWith(mat["key"])) {
              yr.matieres.push(mat);
            }
          });
        });
        if (parent == 0) {
          return this.builtObject.annees;
        } else {
          this.getChildren(parent - 1, child - 1);
        }
      }
    },
    hh() {
      this.result = this.getChildren(4, 5);
    },
    h() {},
    rejustOrder() {
      this.form = {
        paysnum: 1,
        regionnum: this.order.indexOf("region") + 1,
        establissementnum: this.order.indexOf("schools") + 1,
        classnum: this.order.indexOf("classes") + 1,
        matierenum: this.order.indexOf("matieres") + 1,
        sessionnum: this.order.indexOf("session") + 1,
      };

      //
    },

    distributeVals() {
      //to get regions
      this.country.regions.forEach((element) => {
        this.regions.push({
          updated_at: element.updated_at,
          name: element.name,
          created_at: element.created_at,
          id: element.id,
          key: element.key,
        });
        //to get schools
        element.schools.forEach((skl) => {
          this.schools.push({
            updated_at: skl.updated_at,
            name: skl.name,
            created_at: skl.created_at,
            id: skl.id,
            key: skl.key,
          });
          //to get classes
          skl.classes.forEach((cls) => {
            this.classes.push({
              updated_at: cls.updated_at,
              name: cls.name,
              created_at: cls.created_at,
              id: cls.id,
              key: cls.key,
            });

            //to get subjects
            cls.matieres.forEach((sub) => {
              this.matieres.push({
                updated_at: sub.updated_at,
                name: sub.name,
                created_at: sub.created_at,
                description: sub.description,
                id: sub.id,
                key: sub.key,
              });

              //to get all the years
              sub.annees.forEach((yr) => {
                this.annees.push({
                  updated_at: yr.updated_at,
                  active: yr.active,
                  created_at: yr.created_at,
                  annee: yr.annee,
                  id: yr.id,
                  key: yr.key,
                });
                yr.entrances.forEach((entr) => {
                  this.entrances.push(entr);
                });
                yr.concours.forEach((concour) => {
                  this.concours.push(concour);
                });
                yr.exams.forEach((exam) => {
                  this.exams.push(exam);
                });
              });
            });
          });
        });
      });
      // return subjects;
    },
    initValues() {
      this.form = {
        paysnum: 1,
        regionnum: 2,
        establissementnum: 3,
        classnum: 4,
        matierenum: 5,
        sessionnum: 6,
      };
      this.order = [
        "pays",
        "region",
        "schools",
        "classes",
        "matieres",
        "session",
      ];
    },
  },
};
</script>

<style lang="scss" scoped>
.borderDiv {
  border: 1px solid black;
}
</style>