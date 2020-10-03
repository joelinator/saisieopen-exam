<template>
  <div class="row">
    <div :class="newtest ? 'offset-md-3 col-md-6': 'col-md-4'">
      <form class="card shadow-2" data-provide="validation" v-on:submit.prevent="submitform">
        <div class="card-header">
          <h4 class="card-title">{{newtest?'Creation d\'une epreuve':'Informations sur l\'epreuve'}}</h4>
          <label v-if="!newtest" class="switch switch-lg switch-success">
            <span class="switch-description">{{fiview?"Mode Vue": "Mode Edition"}}</span>
            <input v-model="fiview" type="checkbox" :disabled="newtest" />
            <span class="switch-indicator"></span>
          </label>
        </div>
        <div class="card-body">
          <!-- My add -->
          <div class="vx-col w-1/2">
            <vs-select
              v-validate="'included:1,5'"
              v-model="form.subject"
              name="included"
              label="Matière"
              required
              data-provide="selectpicker"
              :disabled="!newtest && fiview"
              class="select-large mt-5 w-full"
            >
              <vs-select-item
                :key="index"
                :value="item.value"
                :text="item.text"
                v-for="(item,index) in options1"
              />
            </vs-select>
            <span
              class="text-danger text-sm"
              v-show="errors.has('included')"
            >{{ errors.first('included') }}</span>
          </div>
          <!-- My add end -->
          <div class="form-group">
            <label>Matière</label>
            <select
              v-model="form.subject"
              required
              data-provide="selectpicker"
              :disabled="!newtest && fiview"
              class="form-control show-tick"
            >
              <template v-for="(subject,i) in subjects">
                <option :value="subject.value" :key="i" :selected="i===0">{{subject.label}}</option>
              </template>
            </select>
            <div class="invalid-feedback"></div>
          </div>
          <div class="form-group">
            <label>Classe</label>
            <select
              v-model="form.class"
              required
              data-provide="selectpicker"
              :disabled="!newtest && fiview"
              class="form-control show-tick"
            >
              <template v-for="(c,i) in classes">
                <option :value="c.value" :key="i" :selected="i===0">{{c.label}}</option>
              </template>
            </select>
            <div class="invalid-feedback"></div>
          </div>
          <div class="form-group">
            <label>Durée</label>
            <small class="sidetitle">hh:mm</small>
            <input
              :data-format="'{{9}}:{{99}}'"
              :disabled="!newtest && fiview"
              class="form-control"
              required
              type="text"
            />
            <div class="invalid-feedback"></div>
          </div>
          <div class="form-group">
            <label>Séquence</label>
            <input
              v-model="form.sequence"
              class="form-control"
              type="number"
              min="1"
              max="6"
              :disabled="!newtest && fiview"
            />
            <div class="invalid-feedback"></div>
          </div>
          <div class="form-group">
            <label>Session</label>
            <input
              v-model="form.session"
              class="form-control"
              type="text"
              :disabled="!newtest && fiview"
            />
            <div class="invalid-feedback"></div>
          </div>
          <div class="form-group">
            <label>Etablissement</label>
            <input
              v-model="form.school"
              required
              class="form-control"
              type="text"
              :disabled="!newtest && fiview"
            />
            <div class="invalid-feedback"></div>
          </div>
          <div class="form-group">
            <label>Année scolaire</label>
            <select
              v-model="form.schoolyear"
              required
              data-provide="selectpicker"
              :disabled="!newtest && fiview"
              class="form-control show-tick"
            >
              <option value="2018/2019" selected>2018/2019</option>
              <option value="2017/2018">2017/2018</option>
              <option value="2016/2017">2016/2017</option>
            </select>
            <div class="invalid-feedback"></div>
          </div>
          <div class="form-group">
            <label>Date de composition</label>
            <input
              type="text"
              class="form-control"
              required
              :disabled="!newtest && fiview"
              data-provide="datepicker"
              id="date_of_composition"
            />
          </div>
        </div>
        <footer class="card-footer text-right" v-if="!fiview">
          <button class="btn btn-success" type="submit">Enregistrer</button>
        </footer>
        <div :class="'card-loading '+ (submitting?'reveal':'')">
          <div class="spinner-dots">
            <span class="dot1"></span>
            <span class="dot2"></span>
            <span class="dot3"></span>
          </div>
        </div>
      </form>
    </div>
    <div v-if="!newtest" class="col-md-8">
      <div class="fab fab-dir-left fab-fixed">
        <button class="btn btn-float btn-danger" data-toggle="button">
          <i class="fab-icon-default ti-plus"></i>
          <i class="fab-icon-active ti-close"></i>
        </button>

        <ul class="fab-buttons">
          <li>
            <a
              @click="addblock('title')"
              class="btn btn-round btn-sm btn-info"
              data-provide="tooltip"
              data-placement="top"
              data-original-title="Ajouter une partie ou un titre"
              href="#"
            >Titre</a>
          </li>
          <li>
            <a
              @click="addblock('text')"
              class="btn btn-round btn-sm btn-info"
              data-provide="tooltip"
              data-placement="top"
              title="Ajouter un énoncé"
              href="#"
            >Texte</a>
          </li>
          <li>
            <a
              @click="addblock('question')"
              class="btn btn-round btn-sm btn-info"
              data-provide="tooltip"
              data-placement="top"
              title="Ajouter une question"
              href="#"
            >Question</a>
          </li>
        </ul>
      </div>
      <div v-if="form.blocks.length===0" class="card shadow-2" style="border-radius: 10px">
        <p class="card-body text-center fs-20">Aucun block disponible</p>
      </div>
      <draggable
        @end="reprocess2"
        v-model="form.blocks"
        :options="{draggable: '.card', handle: '.sortable-dot', dragImage: null,ghostClass:'sortable-placeholder'}"
      >
        <template v-for="(block,idx) in form.blocks">
          <div
            :class="'card shadow-1 radius-3 '+(block.sub===true?'ml-20':'')"
            :data-idx="idx"
            style="border-top-left-radius: 3px; border-bottom-right-radius: 3px"
            :key="idx"
          >
            <div class="card-header bg-lighter p-10">
              <template v-if="block.type==='title'">
                <input
                  type="text"
                  v-if="block.edit"
                  v-model="block.text"
                  :placeholder="'Titre de '+ (block.part?'la partie':'l\'exercice')"
                  class="form-control w-300px"
                  @keyup.enter="edit(block)"
                />
                <h4 class="card-title" @dblclick="edit(block)" v-else>{{block.text}}</h4>
              </template>
              <h4
                class="card-title"
                v-else
              >{{block.type==='text'?'Texte':'Intitulé de la question'}}</h4>
              <ul class="card-controls">
                <li class="w-10px">
                  <a class="p-0" href="#">
                    <span class="sortable-dot"></span>
                  </a>
                </li>
                <li>
                  <a class="card-btn-close" @click="deleteblock(idx)" href="#"></a>
                </li>
                <li v-if="block.type!=='title'">
                  <a class="card-btn-slide" href="#"></a>
                </li>
                <li v-if="block.type!=='title'">
                  <a class="card-btn-fullscreen" href="#"></a>
                </li>
                <li class="topbar-divider"></li>
                <li>
                  <a
                    href="#"
                    @click="block.type!=='question' ? edit(block, $event) : edit(block, $event, 'q')"
                  >
                    <i v-if="block.type!=='question' ? block.edit : block.qedit" class="ti ti-save"></i>
                    <i v-else class="ti ti-pencil"></i>
                  </a>
                </li>
                <li class="topbar-divider"></li>
                <li v-if="block.type==='title'">
                  <label class="switch switch-lg switch-success">
                    <span class="switch-description">{{block.part?"Partie": "Exercice"}}</span>
                    <input v-model="block.part" type="checkbox" />
                    <span class="switch-indicator"></span>
                  </label>
                </li>
                <li v-if="block.type==='question'">
                  <label class="switch switch-lg switch-success">
                    <span class="switch-description">QCM</span>
                    <input v-model="block.qcm" type="checkbox" />
                    <span class="switch-indicator"></span>
                  </label>
                  <label class="switch switch-lg switch-success">
                    <span class="switch-description">Sous-question</span>
                    <input v-model="block.sub" type="checkbox" />
                    <span class="switch-indicator"></span>
                  </label>
                </li>
              </ul>
            </div>
            <div class="card-content">
              <div class="card-body p-0">
                <template v-if="block.type==='text'">
                  <div
                    v-html="block.text"
                    v-on:dblclick="edit(block,$event)"
                    class="text mathjax p-10"
                  ></div>
                </template>
                <template v-if="block.type==='question'">
                  <div
                    v-html="block.text"
                    @dblclick="edit(block,$event, 'q')"
                    class="text mathjax pb-0 p-10"
                  ></div>
                  <div class="card-header bg-lighter bt-1 p-10">
                    <h4 class="card-title">Réponse détaillée</h4>
                    <ul class="card-controls">
                      <li>
                        <a href="#" @click="edit(block, $event, 'er')">
                          <i v-if="block.eredit" class="ti ti-save"></i>
                          <i v-else class="ti ti-pencil"></i>
                        </a>
                      </li>
                      <li class="topbar-divider"></li>
                      <li>
                        <input
                          type="number"
                          min="0"
                          max="10"
                          v-model="block.points"
                          v-if="block.eredit"
                        />
                        <span v-else>{{block.points+(block.points>1?' pts':' pt')}}</span>
                      </li>
                    </ul>
                  </div>
                  <div
                    @dblclick="edit(block, $event, 'er')"
                    v-html="block.exactresponse"
                    class="text mathjax pb-0 p-10"
                  ></div>

                  <template v-if="block.qcm">
                    <div class="card-header bg-lighter bt-1 p-10">
                      <h4 class="card-title">Intitulé de la question(QCM)</h4>
                      <ul class="card-controls">
                        <li v-if="!block.qcmquestion">
                          <a href="#" @click="edit(block, $event, 'qq')">
                            <i v-if="block.qqedit" class="ti ti-save"></i>
                            <i v-else class="ti ti-pencil"></i>
                          </a>
                        </li>
                        <li v-if="!block.qcmquestion" class="topbar-divider"></li>
                        <label class="switch switch-lg switch-success">
                          <span
                            class="switch-description"
                          >{{block.qcmquestion?'Même intitulé': 'Intitulé différent'}}</span>
                          <input
                            v-model="block.qcmquestion"
                            :disabled="block.qqedit"
                            type="checkbox"
                          />
                          <span class="switch-indicator"></span>
                        </label>
                      </ul>
                    </div>

                    <div
                      v-if="!block.qcmquestion"
                      @dblclick="edit(block, $event, 'qq')"
                      v-html="block.qcmquestiontext"
                      class="text mathjax pb-0 p-10"
                    ></div>

                    <div class="card-header bg-lighter bt-1 p-10">
                      <h4 class="card-title">Réponse au QCM</h4>
                      <ul class="card-controls">
                        <li>
                          <a href="#" @click="edit(block, $event, 'r');choice(block,$event)">
                            <i v-if="block.redit" class="ti ti-save"></i>
                            <i v-else class="ti ti-pencil"></i>
                          </a>
                        </li>
                        <li class="topbar-divider"></li>
                        <label class="switch switch-lg switch-success">
                          <span class="switch-description">Choix</span>
                          <input
                            v-model="block.list"
                            :disabled="block.redit"
                            @change="choice(block,$event)"
                            type="checkbox"
                          />
                          <span class="switch-indicator"></span>
                        </label>
                      </ul>
                    </div>
                    <template v-if="block.list">
                      <div class="row">
                        <div class="col-md-6">
                          <table class="table">
                            <thead>
                              <tr>
                                <th>
                                  <i class="ti ti-check"></i>
                                </th>
                                <th>Choix</th>
                                <th v-if="block.redit" class="text-center w-100px">Actions</th>
                              </tr>
                            </thead>
                            <tbody v-if="block.options.length===0">
                              <tr>
                                <td class="text-center" colspan="3">Aucune option disponible</td>
                              </tr>
                            </tbody>
                            <tbody v-for="(option,idx) in block.options" :key="idx">
                              <tr>
                                <th class="w-40px">
                                  <label class="custom-control custom-checkbox">
                                    <input
                                      :disabled="!block.redit"
                                      v-model="option.response"
                                      type="checkbox"
                                      class="custom-control-input"
                                    />
                                    <span class="custom-control-indicator"></span>
                                  </label>
                                </th>
                                <td
                                  class="mathjax"
                                  @dblclick="block.redit?editoption(block.options,option,$event):''"
                                  v-html="option.value"
                                ></td>
                                <td v-if="block.redit" class="text-right table-actions">
                                  <a
                                    @click="editoption(block.options,option,$event)"
                                    class="table-action hover-primary"
                                    href="#"
                                  >
                                    <i v-if="option.edit" class="ti ti-save"></i>
                                    <i v-else class="ti-pencil"></i>
                                  </a>
                                  <a
                                    class="table-action hover-danger"
                                    v-if="!option.edit"
                                    @click="deleteoption(block.options, idx)"
                                    href="#"
                                  >
                                    <i class="ti-trash"></i>
                                  </a>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div class="col-md-6" v-if="block.redit">
                          <div data-placeholder="Texte de l'option" class="text"></div>
                          <button
                            class="btn btn-success float-right mt-10"
                            v-if="!isEditingOption(block.options)"
                            @click="addoption(block, $event)"
                          >Ajouter à la liste</button>
                        </div>
                      </div>
                    </template>
                    <template v-else>
                      <input
                        type="text"
                        @keydown.enter="edit(block, $event, 'r')"
                        :disabled="!block.redit"
                        class="form-control"
                        v-model="block.value"
                        @dblclick="edit(block, $event, 'r')"
                      />
                    </template>
                  </template>
                </template>
              </div>
            </div>
          </div>
        </template>
      </draggable>
      <div class="text-center" v-if="form.blocks.length>0">
        <a href="#" :download="'Epreuve '+form.id+'.json'" id="export"></a>
        <button @click="parse" class="btn mr-20 btn-outline-primary">Exporter</button>
        <button @click="saveAll" class="btn btn-outline-success">Enregistrer</button>
      </div>
      <div class="h-100px"></div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import draggable from "vuedraggable";
import uuid from "uuid/v4";
import moduleDataList from "@/store/modules/global.js";

export default {
  name: "Test",
  data() {
    return {
      newtest: true,
      fiview: false,
      submitting: false,
      form: {
        subject: "mat",
        class: "3",
        createdAt: "",
        updatedAt: "",
        school: "",
        sequence: "",
        duration: "",
        session: "",
        date_of_composition: "",
        schoolyear: "2018/2019",
        blocks: [],
      },
    };
  },
  computed: {
    ...mapGetters({
      subjects: "global/getSubjects",
      classes: "global/getClasses",
      getTest: "global/getTest",
    }),
  },
  watch: {
    fiview: function (newv, oldv) {
      this.viewchange();
    },
  },
  methods: {
    parse() {
      const self = this;
      let blocks = JSON.parse(JSON.stringify(this.form.blocks));
      let tmp1 = [];
      let tmp;
      blocks.forEach(function (block, idx) {
        if (block.type === "question") {
          if (!block.sub) {
            tmp = self.formatQuestion(block);
            tmp.content = [];
            return tmp1.push(tmp);
          } else {
            if (tmp) {
              tmp.content.push(self.formatQuestion(block));
              return;
            }
          }
        }
        if (block.type === "text" && tmp) {
          if (
            idx > 0 &&
            idx < blocks.length - 1 &&
            blocks[idx + 1].type === "question" &&
            blocks[idx + 1].sub
          ) {
            tmp.content.push(self.formatText(block));
            return;
          }
        }
        tmp = null;
        block.formated = false;
        tmp1.push(block);
      });

      blocks = tmp1;
      tmp1 = [];
      tmp = null;

      blocks.forEach(function (block, idx) {
        if (block.type === "title" && !block.part) {
          tmp = self.formatExercise(block);
          tmp.content = [];
          tmp1.push(tmp);
          return;
        }
        if (block.type === "question" && tmp) {
          return tmp.content.push(block);
        }
        if (block.type === "text" && tmp) {
          return tmp.content.push(self.formatText(block));
        }
        tmp = null;
        tmp1.push(block);
      });

      blocks = tmp1;
      tmp1 = [];
      tmp = null;

      blocks.forEach(function (block, idx) {
        if (block.type === "title" && block.part) {
          tmp = self.formatPart(block);
          tmp.content = [];
          tmp1.push(tmp);
          return;
        }
        if (block.type === "exercise" && tmp) {
          return tmp.content.push(block);
        }
        if (block.type === "text" && tmp) {
          return tmp.content.push(self.formatText(block));
        }

        tmp = null;
        tmp1.push(block);
      });

      tmp1 = {
        school: this.form.school,
        sequence: this.form.sequence,
        subject: _.find(this.subjects, (s) => s.value === self.form.subject)
          .label,
        class: _.find(this.classes, (c) => c.value === self.form.class).label,
        duration: this.form.duration,
        createdAt: this.form.createdAt,
        session: this.form.session,
        date_of_composition: this.form.date_of_composition,
        content: tmp1,
      };

      if (_.find(tmp1.content, (b) => b.formated === false)) {
      } else {
        const a = $("#export")[0];
        a.href = "data:," + JSON.stringify(tmp1, null, 2);
        a.click();
      }
    },
    saveAll() {
      axios
        .post("/api", {
          type: "update",
          json: { blocks: this.form.blocks, id: this.form.id },
        })
        .then((response) => {
          app.toast("Enregistrement éffectué");
        })
        .finally((e) => {});
    },
    isEditingOption(options) {
      return !!_.find(options, (o) => o.edit);
    },
    viewchange() {
      this.$nextTick(function () {
        if (!$.fn.selectpicker) return;
        $("select").selectpicker("refresh");
      });
    },
    choice(block, e) {
      const self = this;
      setTimeout(function () {
        const textarea = $(e.target)
          .closest(".card-header")
          .next(".row")
          .find(".text");
        if (block.list) {
          self.reprocess();
        }
        if (block.list && block.redit) {
          textarea.summernote({ focus: true });
        } else {
          textarea.summernote("destroy");
        }
      }, 300);
    },
    submitform(e) {
      const self = this;
      const $e = $(e.target);
      const $val = $e.data("bs.validator");
      $e.find("select").trigger("change");
      $val.validate();
      if ($val.hasErrors()) return;
      this.form.date_of_composition = $("#date_of_composition").val();
      this.form.duration = $e.find("[data-format]").val();
      if (!moment(this.form.date_of_composition, "dd/mm/yyyy").isValid())
        return app.toast("Veuillez insérer la date de composition");
      if (!this.form.sequence && !this.form.session)
        return app.toast("veuillez insérer le séquence ou la session");
      if (this.form.sequence && this.form.session)
        return app.toast(
          "Une epreuve ne peut pas avoir une sequence et une session"
        );
      // this.form.subject = $e.find('select').first().val()
      // this.form.class = $e.find('select').last().val()
      const obj = {
        subject: this.form.subject,
        class: this.form.class,
        school: this.form.school,
        sequence: this.form.sequence,
        duration: this.form.duration,
        schoolyear: this.form.schoolyear,
        date_of_composition: this.form.date_of_composition,
        session: this.form.session,
        id: this.form.id,
      };

      self.submitting = true;
      if (this.newtest) {
        axios
          .post("/api", {
            type: "new",
            json: obj,
          })
          .then(function (resp) {
            self.$store.dispatch("global/fetchData", function (err, data) {
              self.$router.push({
                name: "test",
                params: { id: resp.data.id },
              });
            });
          })
          .catch(function (err) {
            app.toast("error: " + err.message);
          })
          .finally(function () {
            self.submitting = false;
          });
      } else {
        axios
          .post("/api", {
            type: "update",
            json: obj,
          })
          .then((response) => {
            self.$store.dispatch("global/fetchData", (err, data) => {
              self.fiview = true;
              app.toast("Mise à jour éffectuée");
            });
          })
          .finally(() => {
            self.submitting = false;
          });
      }
    },
    deleteblock(idx) {
      const self = this;
      self.form.blocks.splice(idx, 1);
    },
    deleteoption(options, idx) {
      options.splice(idx, 1);
    },
    editoption(options, option, e) {
      const textarea = $(e.target).closest(".row").find(".text");
      if (option.edit) {
        if (textarea.summernote("isEmpty"))
          return app.toast(
            "Veillez renseigner le texte correspondant au choix"
          );
        if (
          _.find(
            options,
            (o) => o !== option && o.value === textarea.summernote("code")
          )
        )
          return app.toast("Une option a déjà cette valeur");
        option.value = textarea.summernote("code");
        option.edit = false;
        this.reprocess();
      } else {
        if (_.find(option, (o) => o.edit === true))
          return app.toast("Une option est déjà en mode édition");
        textarea.summernote("code", option.value);
        option.edit = true;
      }
    },
    addoption(block, e) {
      const textarea = $(e.target).siblings(".text");
      if (textarea.summernote("isEmpty"))
        return app.toast("Veillez renseigner le texte correspondant au choix");
      if (_.find(block.options, (o) => o.value === textarea.summernote("code")))
        return app.toast("Une option a déjà cette valeur");
      block.options.push({
        value: textarea.summernote("code"),
        edit: false,
        response: false,
      });
      this.reprocess();
    },
    reprocess() {
      setTimeout(function () {
        MathJax.Hub.PreProcess();
        MathJax.Hub.Reprocess();
      }, 200);
    },
    reprocess2() {
      MathJax.Hub.PreProcess();
      MathJax.Hub.Reprocess();
    },
    checkOther(block) {
      return !!_.find(
        this.form.blocks,
        (b) =>
          b !== block && (b.edit || b.qedit || b.reedit || b.redit || b.qqedit)
      );
    },
    edit(block, $event, type) {
      let err = "";
      if (block.type === "question") {
        const $textareas = $($event.target).closest(".card").find(".text");
        if (block[type + "edit"]) {
          let textarea;
          switch (type) {
            case "q":
              textarea = $textareas.first();
              if (textarea.summernote("isEmpty"))
                err = "Veuillez remplir l'énoncé de la question";
              break;
            case "er":
              textarea = $($textareas[1]);
              if (textarea.summernote("isEmpty"))
                err = "Veuillez remplir la réponse exacte";
              break;
            case "qq":
              textarea = $($textareas[2]);
              if (textarea.summernote("isEmpty"))
                err = "Veuillez remplir l'énoncé de la question pour le qcm";
              break;
            case "r":
              if (!block.list && !block.value)
                err = "Veuillez remplir la réponse au qcm";
              if (block.list) {
                if (block.options.length < 2)
                  err = "Veuillez ajouter au minimum 2 options pour le qcm";
                else if (!_.find(block.options, (o) => o.response))
                  err = "Veuillez selectionner au moins une réponse";
              }
          }
          if (err) return app.toast(err);
          block[type + "edit"] = false;
          switch (type) {
            case "q":
              block.text = textarea.summernote("code");
              textarea.summernote("destroy");
              this.reprocess();
              break;
            case "er":
              block.exactresponse = textarea.summernote("code");
              textarea.summernote("destroy");
              this.reprocess();
              break;
            case "qq":
              block.qcmquestiontext = textarea.summernote("code");
              textarea.summernote("destroy");
              this.reprocess();
              break;
            case "r":
              break;
          }
        } else {
          if (this.checkOther(block))
            return app.toast("Un autre bloc est en mode édition");
          if (block.qedit || block.eredit || block.redit || block.qqedit)
            return app.toast("Une autre section est en cours d'édition");
          block[type + "edit"] = true;
          switch (type) {
            case "q":
              $textareas.first().summernote("code", block.text);
              break;
            case "er":
              $($textareas[1]).summernote("code", block.exactresponse);
              break;
            case "qq":
              $($textareas[2]).summernote("code", block.qcmquestiontext);
            case "r":
              break;
          }
        }
      } else if (block.type === "text") {
        const $textarea = $($event.target).closest(".card").find(".text");
        if (block.edit) {
          block.text = $textarea.summernote("code");
          if ($textarea.summernote("isEmpty"))
            return app.toast("Veuillez remplir le texte du bloc");
          $textarea.summernote("destroy");
          this.reprocess();
          block.edit = false;
        } else {
          if (this.checkOther(block))
            return app.toast("Un autre bloc est en mode édition");
          block.edit = true;
          // $textarea.summernote({focus: true, placeholder: 'Saisir le texte du bloc'});
          $textarea.summernote("code", block.text);
        }
      } else {
        if (block.edit) {
          if (!block.text) return app.toast("Veuillez remplir le titre");
          block.edit = false;
        } else {
          if (this.checkOther(block))
            return app.toast("Un autre bloc est en mode édition");
          block.edit = true;
        }
      }
    },
    formatQuestion(block) {
      return {
        id: block.id,
        type: "question",
        sub: block.sub,
        question_text: block.text,
        points: block.points,
        exact_response_text: block.exactresponse,
        has_qcm: block.qcm,
        qcm_same_question: block.qcmquestion,
        qcm_question_text: block.qcmquestion ? block.qcmquestiontext : null,
        qcm_list: block.list,
        qcm_response_value: block.list ? null : block.value,
        qcm_options: block.list
          ? block.options.map((o) => {
              return { option_text: o.value, is_solution: o.response };
            })
          : null,
      };
    },
    formatPart(block) {
      return {
        id: block.id,
        type: "part",
        text: block.text,
      };
    },
    formatExercise(block) {
      return {
        id: block.id,
        type: "exercise",
        text: block.text,
      };
    },
    formatText(block) {
      return { id: block.id, type: "text", text: block.text };
    },
    addblock(type, pos) {
      const self = this;
      switch (type) {
        case "question":
          self.form.blocks.push({
            id: uuid(),
            type: "question",
            sub: false,
            text: "",
            points: 1,
            exactresponse: "",
            qcm: false,
            qcmquestion: true,
            qcmquestiontext: "",
            list: false,
            value: "",
            options: [],
            qedit: false,
            eredit: false,
            qqedit: false,
            redit: false,
          });
          self.$nextTick(function () {
            const block = self.form.blocks[self.form.blocks.length - 1];
            const target = $(
              '.card[data-idx="' + (self.form.blocks.length - 1) + '"]'
            )[0];
            self.edit(block, { target }, "q");
            // self.edit(block, {target}, 'er')
          });
          break;
        case "title":
          self.form.blocks.push({
            id: uuid(),
            type: "title",
            part: true,
            text: "",
            edit: true,
          });
          break;
        case "text":
          self.form.blocks.push({
            id: uuid(),
            type: "text",
            text: "",
            edit: false,
          });
          this.$nextTick(function () {
            self.edit(self.form.blocks[self.form.blocks.length - 1], {
              target: $(
                '.card[data-idx="' + (self.form.blocks.length - 1) + '"]'
              )[0],
            });
          });
          break;
      }
    },
  },
  components: {
    draggable,
  },
  mounted() {
    const id = this.$route.params.id;

    if (!isNaN(id)) {
      this.newtest = false;
      this.fiview = true;
      const test = this.getTest(id);
      test.blocks.forEach(function (block) {
        block.edit = false;
        if (block.type === "question") {
          block.redit = false;
          block.qedit = false;
          block.eredit = false;
        }
      });
      this.form = test;
      $("#date_of_composition").val(test.date_of_composition);
      $(this.$el).find("select").trigger("change");
      $(this.$el).find("[data-format]").val(test.duration);
      this.reprocess();
    }
  },
};
</script>

<style scoped>
</style>