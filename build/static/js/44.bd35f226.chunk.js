(this.webpackJsonpbeedlez=this.webpackJsonpbeedlez||[]).push([[44],{1505:function(e,t,a){"use strict";var n=a(0),i=a.n(n),r=a(21);t.a=function(e){var t=e.name;return i.a.createElement("div",{style:{color:"red"}},i.a.createElement(r.a,{name:t}))}},1736:function(e,t,a){"use strict";a.r(t);var n=a(7),i=a.n(n),r=a(26),l=a(13),c=a(41),o=a(0),s=a.n(o),m=a(1476),d=a(5),p=a.n(d),u=a(564),g=a(21),f=a(43),h=a(1505),x=a(1485),b=a(32),v=a(15),y=a(30),E=a(223),w=a.n(E),C=(a(222),a(175)),N=a(81),j=a.n(N),O=a(483),k=a(218),S=a.n(k),D=a(80),I=a.n(D),T=a(84),A=Object(m.a)((function(e){return{root:{flexWrap:"wrap"},margin:{margin:e.spacing(1)},extendedIcon:{marginRight:e.spacing(1)},paperHeading:{padding:"1rem 0rem"},table:{minWidth:650},textMiddle:{verticalAlign:"middle !important"},iconMargin:{margin:"0.5rem",color:"#696969",backgroundColor:"#fff"},iconcolor:{margin:"0.5rem",color:"#fff",backgroundColor:"#0e3f37 !important"},headingButton:{display:"flex",flexDirection:"row",justifyContent:"space-around",padding:"10px"},headingAlignment:Object(c.a)({display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap"},"@media (max-width:780px)",{flexDirection:"column",width:"100%",gap:"1rem",justifyContent:"center",textAlign:"center"}),addNewCategory:Object(c.a)({display:"flex",alignItems:"center",flexWrap:"wrap"},"@media (max-width:780px)",{flexDirection:"column",width:"100%",gap:"1rem",justifyContent:"center",textAlign:"center"}),addNewCategoryHeading:Object(c.a)({textAlign:"center",flex:1,paddingBottom:"0 !important"},"@media (max-width:780px)",{flexDirection:"column",width:"100%",gap:"1rem",justifyContent:"center",textAlign:"center"}),MarginControl:Object(c.a)({},"@media (max-width:780px)",{margin:"0 !important"}),Marginbutton:{margin:"0.5rem"},container:{maxHeight:"58vh"},paperPaddingRightLeft:{padding:"0rem 1rem"}}}));t.default=function(e){var t=A(),a=e.location.state;console.log(a);var n=Object(C.a)("".concat(T.b,"/fileUpload")),c=n.isSuccess,m=n.uploadForm,d=n.progress,E=Object(o.useState)(!1),N=Object(l.a)(E,2),k=N[0],D=N[1],R=Object(o.useState)(!1),P=Object(l.a)(R,2),_=P[0],B=P[1],H=Object(o.useRef)(null),M=Object(o.useState)(""),z=Object(l.a)(M,2),V=z[0],L=z[1],W=f.c({name:f.e().matches(/^[a-zA-Z ]+$/,"Name is invalid").required("Name is Required!"),file1:f.e().required("Image is Required!")}),q=function(){var t=Object(r.a)(i.a.mark((function t(a){var n,r;return i.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,console.log(a),t.next=4,b.a.post("/private/vehicleCategory",{title:a.name,icon:a.file1,description:a.description});case 4:n=t.sent,r=n.data,e.history.push({pathname:"/adminPanel/TaxiSingleManagement"}),v.b.success(r.message,{position:v.b.POSITION.TOP_RIGHT}),console.log(r,"data gere>>>>>>>>>>>>"),t.next=14;break;case 11:t.prev=11,t.t0=t.catch(0),console.log(t.t0);case 14:case"end":return t.stop()}}),t,null,[[0,11]])})));return function(e){return t.apply(this,arguments)}}(),F=function(){var t=Object(r.a)(i.a.mark((function t(n){var r,l;return i.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,console.log(n),t.next=4,b.a.put("/private/vehicleCategory/".concat(a._id),{icon:n.file1||a.icon,title:n.name||a.title,description:n.description||a.description});case 4:r=t.sent,l=r.data,e.history.push({pathname:"/adminPanel/TaxiSingleManagement"}),v.b.success(l.message,{position:v.b.POSITION.TOP_RIGHT}),console.log(l),t.next=14;break;case 11:t.prev=11,t.t0=t.catch(0),console.log(t.t0);case 14:case"end":return t.stop()}}),t,null,[[0,11]])})));return function(e){return t.apply(this,arguments)}}(),U=function(){var e=Object(r.a)(i.a.mark((function e(){var t,n;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=a?a.image.split("/")[3]:"",console.log(t),e.prev=2,e.next=5,j.a.get("http://18.221.140.83:3000/fileDelete/".concat(t));case 5:n=e.sent,n.data,e.next=12;break;case 9:e.prev=9,e.t0=e.catch(2),console.log(e.t0);case 12:case"end":return e.stop()}}),e,null,[[2,9]])})));return function(){return e.apply(this,arguments)}}();Object(o.useEffect)((function(){_&&U()}),[_]);return s.a.createElement(s.a.Fragment,null,s.a.createElement("div",{className:"page-content"},s.a.createElement("div",{className:t.root},s.a.createElement(u.a,null,s.a.createElement("div",{className:t.paperPaddingRightLeft},s.a.createElement("div",{className:"py-4"},s.a.createElement(u.a,{elevation:0,className:p()(t.paperHeading,t.addNewCategory)},s.a.createElement(x.a,{onClick:function(){I.a.fire({showClass:{popup:"animate__animated animate__fadeInDown"},hideClass:{popup:"animate__animated animate__fadeOutUp"},title:"Do you want to save the changes?",showConfirmButton:!1,showDenyButton:!0,showCloseButton:!0,showCancelButton:!1,denyButtonText:"Don't save"}).then((function(t){console.log(t),t.isDenied?e.history.push({pathname:"/adminPanel/TaxiSingleManagement"}):t.isCancelled&&I.a.fire("Changes are not saved","","info")}))}},s.a.createElement(S.a,null),"BACK"),s.a.createElement("div",{className:p()(t.addNewCategoryHeading)}," ",s.a.createElement("h3",{className:p()(t.MarginControl),style:{marginBottom:"-0.5rem",marginLeft:"-135px"}},console.log(a),a?"EDIT VEHICLE TYPE":"ADD VEHICLE TYPE"))),s.a.createElement(u.a,{style:{display:"flex",alignItems:"center",flexDirection:"column"}},s.a.createElement("div",{style:{margin:"2rem 0 2rem 0"}},s.a.createElement(g.d,{validationSchema:W,initialValues:{name:Object(y.get)(a,"title",""),file1:Object(y.get)(a,"icon",""),description:Object(y.get)(a,"description","")},onSubmit:function(e){console.log(e,">>>>>>>>>>>values here"),a&&""!==a?F(e):q(e)}},(function(e){var t=e.values,n=e.setFieldValue;return s.a.createElement(g.c,null,s.a.createElement("div",{className:"row my-5 align-items-center"},s.a.createElement("div",{className:"col-4"},s.a.createElement("label",{className:"",style:{fontSize:"18px"}},"Vehicle Image :")),s.a.createElement("div",{className:"col-4"},s.a.createElement("input",{ref:H,name:"file1",hidden:!0,type:"file",accept:"image/png, image/jpeg , image/jpg",onChange:function(){var e=Object(r.a)(i.a.mark((function e(t){var a;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,m(t.target.files[0]);case 2:a=e.sent,console.log(a),n("file1",a),L(a);case 6:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()}),s.a.createElement("button",{type:"button",onClick:function(){H.current.click(),B(!0)},style:{borderRadius:"5px",backgroundColor:"#0059cd",color:"white",border:"none",padding:"5px"}},"Upload")),s.a.createElement("div",{className:"col-4"},c?D(100!==d):!a&&""===V&&s.a.createElement(w.a,{style:{width:"100px",height:"100px"}}),!a&&""!==V&&s.a.createElement("img",{src:V,alt:"...",style:{width:"100px",height:"100px"}}),a&&""!==t.file1&&s.a.createElement("img",{src:t.file1,alt:"...",style:{width:"100px",height:"100px"}}),s.a.createElement(h.a,{name:"file1"}))),s.a.createElement("div",{className:"row my-5 align-items-center"},s.a.createElement("div",{className:"col-4"},s.a.createElement("label",{className:"labelAddCategory",style:{fontSize:"18px"}},"Vehicle Name"," :")),s.a.createElement("div",{className:"col-8 d-flex flex-column"},s.a.createElement(g.b,{className:"",name:"name",type:"text",style:{width:"85%",height:"40px",borderRadius:"5px",border:"1px solid #c4c4c4",padding:"5px"}}),s.a.createElement(h.a,{name:"name"}))),s.a.createElement("div",{className:"row my-5 align-items-center"},s.a.createElement("div",{className:"col-4"},s.a.createElement("label",{className:"labelAddCategory",style:{fontSize:"18px"}},"Vehicle Description"," :")),s.a.createElement("div",{className:"col-8 d-flex flex-column"},s.a.createElement(g.b,{className:"fieldAddCategory",name:"description",type:"text",style:{width:"85%",height:"40px",borderRadius:"5px",border:"1px solid #c4c4c4",padding:"5px"}}),s.a.createElement(h.a,{name:"description"}))),s.a.createElement("br",null)," ",s.a.createElement("br",null),s.a.createElement("div",{style:{display:"flex",justifyContent:"center"}},s.a.createElement("button",{type:"submit",className:"buttoncss",style:{borderRadius:"1.5rem",border:"none",fontSize:"1rem",width:"15vw",height:"5vh",backgroundColor:"#0059cd",color:"#fff"}},"SAVE")))})))))))),k?s.a.createElement("div",{style:{position:"absolute",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.7)",height:"100vh",width:"100vw"}},s.a.createElement("div",{style:{marginTop:"20%",marginLeft:"20%"}}," ",s.a.createElement(O.a,null)),"//"," ",s.a.createElement("div",{style:{color:"#fff",fontSize:"20px",fontWeight:"bolder",textAlign:"center",marginTop:"10%",marginLeft:"15%"}},Math.ceil(d),"%")):""))}}}]);
//# sourceMappingURL=44.bd35f226.chunk.js.map