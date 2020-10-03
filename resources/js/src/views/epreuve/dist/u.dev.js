"use strict";

function header(object) {
  var mode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "normal";

  if (object.type == 'exams') {
    return " <ul style=\"margin:auto; list-style-type:none;\">\n\t\t<li>\n        <table style=\"border:1px solid black; width:100%; border-collapse:collapse;\">\n\t\t    <tbody>\n\t\t        <tr>\n\t\t            <td style=\"text-align:center;border-collapse:collapse; margin:auto\" colspan=\"6\">".concat(object.body.etablissement.name, "</td>\n\t\t        </tr>\n\t\t        <tr>\n\t\t            <td style=\"border:1px solid black; border-collapse:collapse;\">EXAMEN</td>\n\t\t            <td style=\"border:1px solid black; border-collapse:collapse;\">").concat(object.body.name, "</td>\n\t\t            <td style=\"border:1px solid black; border-collapse:collapse;\">CLASSE</td>\n\t\t            <td style=\"border:1px solid black; border-collapse:collapse;\">").concat(object.body.classe, "</td>\n\t\t            <td style=\"border:1px solid black; border-collapse:collapse;\">SESSION</td>\n\t\t            <td style=\"border:1px solid black; border-collapse:collapse;\">").concat(object.body.anne_scolaire, "</td>\n\t\t        </tr>\n\t\t        <tr>\n\t\t            <td style=\"border:1px solid black; border-collapse:collapse;\">EPREUVE</td>\n\t\t            <td style=\"border:1px solid black; border-collapse:collapse;\">").concat(object.body.matiere.name, "</td>\n\t\t            <td style=\"border:1px solid black; border-collapse:collapse;\">COEFFICIENT</td>\n\t\t            <td style=\"border:1px solid black; border-collapse:collapse;\"></td>\n\t\t            <td style=\"border:1px solid black; border-collapse:collapse;\">DUREE</td>\n\t\t            <td style=\"border:1px solid black; border-collapse:collapse;\">").concat(object.body.duration.split(':')[0], "h").concat(object.body.duration.split(':')[1] != '00' ? object.body.duration.split(':')[1] : '', "</td>\n\t\t        </tr>\n\t\t\t</tbody>\n\t\t</table> </li>\n\t\t<li>\n\t\t<div style=\"margin:auto;\">").concat(object.body.intitule, "</div></li></ul>");
  } else if (object.type == 'part') {
    return "\n\t\t\t<ul style=\"list-style-type:none\"> \n            <li><h".concat(object.h, ">").concat(object.body.title, ":").concat(object.body.text, "  ").concat(object.body.points ? '(' + object.body.points + 'pts)' : '', " </h").concat(object.h, "></li>\n\t\t\t<li>").concat(object.body.intitule, "</li>\n\t\t\t</ul>\n\t\t\t");
  } else if (object.type == 'exercise') {
    return "\n\t\t\t<ul style=\"list-style-type:none\">\n\t\t\t<li><h".concat(object.h, ">").concat(object.body.title, ":").concat(object.body.text, " ").concat(object.body.points ? '(' + object.body.points + 'pts)' : '', "</h").concat(object.h, "></li>\n            <li>").concat(object.body.intitule, "</li>\n\t\t\t</ul>\n            ");
  } else if (object.type == 'question') {
    var text = object.body.text;

    if (mode == 'qcm' || mode == 'correctionQCM') {
      text = object.body.qcm ? object.body.text : object.body.qcmquestiontext;

      if (object.body.qcm == false && object.body.has_qcm == false) {
        return '';
      }
    }

    var bo = "<span style=\"display:inline-block; float:right\">\n\t\t\t (".concat(object.body.points ? object.body.points : '', ") pts</span>");
    var head = object.body.title ? "<li><h".concat(object.h, ">\n\t\t\t").concat(object.num, "-  <span style=\"display:inline-block;\">\n\t\t\t").concat(object.body.title, "</span></h").concat(object.h, "></li>") : "<h".concat(object.h, ">").concat(object.num, "-  </h").concat(object.h, ">");
    return "\n\t\t\t<ul style=\"list-style-type:none\">\n\t\t\t".concat(head, "\n\t\t\t<li  style=\"overflow:hidden\"><span style=\"display:inline-block;\">").concat(text, "</span>").concat(bo, "</li>\n\t\t\t</ul>");
  } else if (object.type == 'text') {
    return "".concat(object.body.text);
  }
}

function body(object, mode) {
  if (object.type == 'exams' || object.type == 'part') {
    var content = '';
    var h = object.type == 'exams' ? '2' : '3';
    var cont = 1;
    object.children.forEach(function (item) {
      item.h = h;

      if (item.type == "question") {
        item.num = cont++;
      }

      content = content + "<li>".concat(html(item, mode), "</li>");
    });
    return "\n\t\t<ul style=\"list-style-type:none\">".concat(content, "</ul>\n\t\t");
  } else if (object.type == 'exercise' || object.type == 'question') {
    var content = '';
    var cont = 1;
    var h = object.type == 'exercise' ? '3' : '4';
    object.children.forEach(function (item) {
      item.h = h;
      item.num = cont++;
      content = content + "<li>".concat(html(item, mode), "</li>");
    });

    if (object.type == "question") {
      if (mode == "qcm" && object.body.has_qcm || mode != "correction" && mode != "correctionQCM" && object.body.qcm) {
        var qcms = '';
        object.body.options.forEach(function (item) {
          qcms = qcms + "<li>".concat(item.value, "</li>");
        });
        content = content + "<ol style=\"list-style-type:lower-alpha;\">".concat(qcms, "</ol>");
      } else if (mode == 'correction') {
        if (object.body.qcm) {
          var reps = '';
          object.body.options.forEach(function (item) {
            if (item.response == true) {
              reps = reps + "<li>".concat(item.value, "</li>");
            }
          });
          content = content + "<ol style=\"list-style-type:lower-alpha;\">".concat(reps, "</ol>");
        }

        content = content + "<b>".concat(object.body.exactresponse, "</b>");
      } else if (mode == 'correctionQCM') {
        if (object.body.qcm || object.body.has_qcm) {
          var reps = '';
          object.body.options.forEach(function (item) {
            if (item.response == true) {
              reps = reps + "<li>".concat(item.value, "</li>");
            }
          });
          content = content + "<ol style=\"list-style-type:lower-alpha;\">".concat(reps, "</ol>");
        }
      }
    }

    return "<ul style=\"list-style-type:none\">".concat(content, "</ul>");
  } else if (object.type == 'text') {
    return '';
  }
}

function Footer(object) {}

function html(object, mode) {
  return "\n\t\t<ul style=\"list-style-type:none;\">\n\t\t<li>".concat(header(object, mode), "</li>\n\t\t<li>").concat(body(object, mode), "</li>\n\t\t</ul>");
}

function gethtml(object) {
  var mode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'normal';
  return "\n\t\t<div style=\"margin:1cm auto; width:21cm;\">\n\t\t\t<div style=\"margin:1cm; width:19cm;  overflow:hidden;\">\n\t\t\t\t".concat(html(object, mode), "\n\t\t\t</div>\n\t\t</div>\n\t\t");
} //import html2canvas from 'html2canvas'
//var o=require('./ep.json')
//console.log()