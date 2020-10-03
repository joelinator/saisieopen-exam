function header(object, mode="normal"){
	if (object.type=='exams'){
		return ` <ul style="margin:auto; list-style-type:none;">
		<li>
        <table style="border:1px solid black; width:100%; border-collapse:collapse;">
		    <tbody>
		        <tr>
		            <td style="text-align:center;border-collapse:collapse; margin:auto" colspan="6">${object.body.etablissement.name}</td>
		        </tr>
		        <tr>
		            <td style="border:1px solid black; border-collapse:collapse;">EXAMEN</td>
		            <td style="border:1px solid black; border-collapse:collapse;">${object.body.name}</td>
		            <td style="border:1px solid black; border-collapse:collapse;">CLASSE</td>
		            <td style="border:1px solid black; border-collapse:collapse;">${object.body.classe}</td>
		            <td style="border:1px solid black; border-collapse:collapse;">SESSION</td>
		            <td style="border:1px solid black; border-collapse:collapse;">${object.body.anne_scolaire}</td>
		        </tr>
		        <tr>
		            <td style="border:1px solid black; border-collapse:collapse;">EPREUVE</td>
		            <td style="border:1px solid black; border-collapse:collapse;">${object.body.matiere.name}</td>
		            <td style="border:1px solid black; border-collapse:collapse;">COEFFICIENT</td>
		            <td style="border:1px solid black; border-collapse:collapse;"></td>
		            <td style="border:1px solid black; border-collapse:collapse;">DUREE</td>
		            <td style="border:1px solid black; border-collapse:collapse;">${object.body.duration.split(':')[0]}h${object.body.duration.split(':')[1]!='00'?object.body.duration.split(':')[1]:''}</td>
		        </tr>
			</tbody>
		</table> </li>
		<li>
		<div style="margin:auto;">${object.body.intitule}</div></li></ul>` 
	}
	else if (object.type=='part'){
		return `
			<ul style="list-style-type:none"> 
            <li><h${object.h}>${object.body.title}:${object.body.text}  ${object.body.points?'('+object.body.points+'pts)':''} </h${object.h}></li>
			<li>${object.body.intitule}</li>
			</ul>
			`
			

    }
	else if (object.type=='exercise'){
		return `
			<ul style="list-style-type:none">
			<li><h${object.h}>${object.body.title}:${object.body.text} ${object.body.points?'('+object.body.points+'pts)':''}</h${object.h}></li>
            <li>${object.body.intitule}</li>
			</ul>
            `
	}
	else if (object.type=='question'){
		var text=object.body.text
		if(mode=='qcm' || mode=='correctionQCM'){
			text=object.body.qcm?object.body.text:object.body.qcmquestiontext
			if (object.body.qcm==false && object.body.has_qcm==false){
				return ''
			}
		}
		var bo=`<span style="display:inline-block; float:right">
			 (${object.body.points?object.body.points:''}) pts</span>`
		var head=object.body.title?`<li><h${object.h}>
			${object.num}-  <span style="display:inline-block;">
			${object.body.title}</span></h${object.h}></li>`:`<h${object.h}>${object.num}-  </h${object.h}>`  
		
		
		return `
			<ul style="list-style-type:none">
			<li> ${head}</li>
			<li  style="overflow:hidden"><span style="display:inline-block;">${text}</span>${bo}</li>
			</ul>`
		
	}
	else if (object.type=='text'){return `${object.body.text}`}
}
function body(object, mode){
	if(object.type=='exams' || object.type=='part'){
		var content=''
		var h=object.type=='exams'?'2':'3'
		var cont=1
		object.children.forEach(function(item){
			item.h=h
			if(item.type=="question"){item.num=cont++}
			content=content+`<li>${html(item, mode)}</li>`
		})
		return `
		<ul style="list-style-type:none">${content}</ul>
		`
	} 
	else if(object.type=='exercise' || object.type=='question'){
		var content=''
		var cont=1
		var h=object.type=='exercise'?'3':'4'
		object.children.forEach(function(item){
			item.h=h
			item.num=cont++
			content=content+`<li>${html(item, mode)}</li>`
			})
		if(object.type=="question"){
			if((mode=="qcm" && object.body.has_qcm)||(mode != "correction" && mode !="correctionQCM" && object.body.qcm)){
			var qcms=''
			object.body.options.forEach(function(item){
			qcms=qcms+`<li>${item.value}</li>`
			})
			content=content+`<ol style="list-style-type:lower-alpha;">${qcms}</ol>`
		}
			else if(mode=='correction'){
				if(object.body.qcm){
					var reps=''
					object.body.options.forEach(function(item){
						if(item.response==true){
							reps=reps+`<li>${item.value}</li>`
						}
					})
					content=content+`<ol style="list-style-type:lower-alpha;">${reps}</ol>`
				}
				content=content+`<li><b>${object.body.exactresponse}</b></li>`
			}
			else if(mode=='correctionQCM'){
				if(object.body.qcm || object.body.has_qcm){
				var reps=''
					object.body.options.forEach(function(item){
						if(item.response==true){
							reps=reps+`<li>${item.value}</li>`
						}
					})
					content=content+`<ol style="list-style-type:lower-alpha;">${reps}</ol>`
			}}
		}
		return `<ul style="list-style-type:none">${content}</ul>`
	}
	else if(object.type=='text'){
		return ''
	}
 }
function Footer(object){}
function html(object, mode){
	return `
		<ul style="list-style-type:none;">
		<li>${header(object, mode)}</li>
		<li>${body(object, mode)}</li>
		</ul>`
}
function gethtml(object, mode='normal'){
	return `
		<div style="margin:1cm auto; width:21cm;">
			<div style="margin:1cm; width:19cm;  overflow:hidden;">
				${html(object, mode)}
			</div>
		</div>
		`
}
export default {
	jsonToHTML: gethtml
	}
//import html2canvas from 'html2canvas'
//var o=require('./ep.json')
//console.log()
()