(this.webpackJsonpbeedlez=this.webpackJsonpbeedlez||[]).push([[17],{1505:function(e,t,a){"use strict";var n=a(0),r=a.n(n),i=a(21);t.a=function(e){var t=e.name;return r.a.createElement("div",{style:{color:"red"}},r.a.createElement(i.a,{name:t}))}},1509:function(e,t,a){"use strict";a.d(t,"a",(function(){return n}));var n=function(e,t){if(null!==e&&null!==t&&""!==e&&""!==t&&void 0!==e&&void 0!==t){var a=new Date(e),n=new Date(t);return{sDate:a.getFullYear()+"-"+(a.getMonth()+1)+"-"+a.getDate(),eDate:n.getFullYear()+"-"+(n.getMonth()+1)+"-"+n.getDate()}}return{sDate:"",eDate:""}}},1518:function(e,t,a){},1640:function(e,t,a){},1740:function(e,t,a){"use strict";a.r(t);var n=a(14),r=a(49),i=a(7),o=a.n(i),l=a(26),c=a(13),m=a(41),s=a(0),d=a.n(s),u=a(1476),p=a(5),g=a.n(p),b=a(564),f=a(21),x=a(43),v=a(1505),E=a(1485),h=a(32),z=a(15),y=a(30),S=(a(222),a(1687)),C=a(216),N=a.n(C),P=a(1650),w=a.n(P),O=(a(1640),a(1652),a(1509),a(218)),F=a.n(O),k=(a(1518),a(80)),j=a.n(k),R=Object(u.a)((function(e){return{root:{flexWrap:"wrap"},margin:{margin:e.spacing(1)},extendedIcon:{marginRight:e.spacing(1)},paperHeading:{padding:"1rem 0rem"},table:{minWidth:650},textMiddle:{verticalAlign:"middle !important"},iconMargin:{margin:"0.5rem",color:"#696969",backgroundColor:"#fff"},iconcolor:{margin:"0.5rem",color:"#fff",backgroundColor:"#0e3f37 !important"},headingButton:{display:"flex",flexDirection:"row",justifyContent:"space-around",padding:"10px"},headingAlignment:Object(m.a)({display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap"},"@media (max-width:780px)",{flexDirection:"column",width:"100%",gap:"1rem",justifyContent:"center",textAlign:"center"}),addNewCategory:Object(m.a)({display:"flex",alignItems:"center",flexWrap:"wrap"},"@media (max-width:780px)",{flexDirection:"column",width:"100%",gap:"1rem",justifyContent:"center",textAlign:"center"}),addNewCategoryHeading:Object(m.a)({textAlign:"center",flex:1,paddingBottom:"0 !important"},"@media (max-width:780px)",{flexDirection:"column",width:"100%",gap:"1rem",justifyContent:"center",textAlign:"center"}),MarginControl:Object(m.a)({},"@media (max-width:780px)",{margin:"0 !important"}),Marginbutton:{margin:"0.5rem"},container:{maxHeight:"58vh"},paperPaddingRightLeft:{padding:"0rem 1rem"}}}));t.default=function(e){var t,a=R(),i=e.location.state,m=e.history;console.log(i,"state here");var u=Object(s.useState)([]),p=Object(c.a)(u,2),C=p[0],P=p[1],O=Object(s.useState)([]),k=Object(c.a)(O,2),B=k[0],W=k[1],A=d.a.useState({min:i.result[0].rangeStart,max:i.result[0].rangeEnd}),I=Object(c.a)(A,2),T=I[0],q=I[1],D=d.a.useState({min:i.result[1].rangeStart,max:i.result[1].rangeEnd}),_=Object(c.a)(D,2),M=_[0],V=_[1],H=d.a.useState({min:i.result[2].rangeStart,max:i.result[2].rangeEnd}),L=Object(c.a)(H,2),G=L[0],U=L[1],J=(Object(s.useRef)(null),Object(s.useState)("")),Y=Object(c.a)(J,2),K=(Y[0],Y[1],Object(s.useState)({0:!1,1:!1,2:!1,3:!1})),Q=Object(c.a)(K,2),X=Q[0],Z=Q[1],$=x.c({bookingFee:x.b().typeError("Only Number Accepted").required("Booking Fee is required"),distanceRate:x.b().typeError("Only Number Accepted").required("Distance Rate is required"),adminCommission:x.b().typeError("Only Number Accepted").min(0,"Min value 0.").max(99,"Max value 99.").required("Admin Commission is required"),cancellationFee:x.b().typeError("Only Number Accepted").required("Cancellation Fee is required"),timeRate:x.b().typeError("Only Number Accepted").required("Time Rate is required"),petPrize1:x.b().typeError("Only Number Accepted").required("Pet Prize is required"),petPrize2:x.b().typeError("Only Number Accepted").required("Pet Prize is required"),petPrize3:x.b().typeError("Only Number Accepted").required("Pet Prize is required"),cargePrize1:x.b().lessThan(x.d("petPrize1"),"Cage price should be less than pet price").typeError("Only Number Accepted").required("Cage Prize is required"),cargePrize2:x.b().lessThan(x.d("petPrize2"),"Cage price should be less than pet price").typeError("Only Number Accepted").required("Cage Prize is required"),cargePrize3:x.b().lessThan(x.d("petPrize3"),"Cage price should be less than pet price").typeError("Only Number Accepted").required("Cage Prize is required"),adminCancellationFee:x.b().typeError("Only Number Accepted").min(0,"Min value 0.").max(99,"Max value 99.").required("Admin Cancellation Fee is required"),driverCancellationFee:x.b().typeError("Only Number Accepted").min(0,"Min value 0.").max(99,"Max value 99.").required("Driver Cancellation Fee is required")});Object(s.useEffect)((function(){ee(),console.log(i.vehicleId)}),[]),Object(s.useEffect)((function(){console.log(C),te()}),[C]);var ee=function(){var e=Object(l.a)(o.a.mark((function e(){var t,a,n;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,h.a.get("/private/vehicaleList");case 2:t=e.sent,a=t.data,console.log(a),n=a.data.map((function(e){return{label:e.title,value:e._id}})),P(n);case 7:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),te=function(){var e=Object(l.a)(o.a.mark((function e(){return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:void 0!==i.vehicleId||i.vehicleId!==[]?W(null===C||void 0===C?void 0:C.filter((function(e){return i.vehicleId.some((function(t){return e.value===t._id}))}))):W([]);case 1:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),ae=function(){var e=Object(l.a)(o.a.mark((function e(){var t;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,h.a.get("/private/petManageAdminFare");case 2:t=e.sent,console.log(t.data.data),ee(),m.replace({pathname:"/adminPanel/FarePet",state:t.data.data});case 6:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),ne=function(){var t=Object(l.a)(o.a.mark((function t(a){var n,r;return o.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,console.log(a),t.next=4,h.a.put("/private/petCategoryAdminManageFare/".concat(i.adminFare._id),{bookingFee:a.bookingFee||i.adminFare.bookingFee,distanceRate:a.distanceRate||i.adminFare.distanceRate,adminCommission:a.adminCommission||i.adminFare.adminCommission,cancellationFee:a.cancellationFee||i.adminFare.cancellationFee,timeRate:a.timeRate||i.adminFare.timeRate,adminCancellationFee:a.adminCancellationFee||i.adminCancellationFee,driverCancellationFee:a.driverCancellationFee||i.driverCancellationFee});case 4:n=t.sent,r=n.data,e.history.push({pathname:"/adminPanel/PetCategoryManagement"}),z.b.success("Updated Successfully",{position:z.b.POSITION.TOP_RIGHT}),console.log(r),t.next=14;break;case 11:t.prev=11,t.t0=t.catch(0),console.log(t.t0);case 14:case"end":return t.stop()}}),t,null,[[0,11]])})));return function(e){return t.apply(this,arguments)}}(),re=function(){var e=Object(l.a)(o.a.mark((function e(t,a){var n,l,c,m,s,d,u;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:e.t0=a,e.next=0===e.t0?3:1===e.t0?18:2===e.t0?31:3===e.t0?44:57;break;case 3:return e.prev=3,console.log(t),e.next=7,h.a.put("/private/petCategoryManageFare/".concat(i.result[0]._id),{petSize:t.petSize1||i.result[0].petSize,rangeStart:T.min||i.result[0].rangeStart,rangeEnd:T.max||i.result[0].rangeEnd,petPrize:t.petPrize1||i.result[0].petPrize,cargePrize:t.cargePrize1||i.result[0].cargePrize,adminFareSet:i.adminFare._id});case 7:n=e.sent,l=n.data,z.b.success(l.messages,{position:z.b.POSITION.TOP_RIGHT}),ae(),console.log(l),e.next=17;break;case 14:e.prev=14,e.t1=e.catch(3),console.log(e.t1);case 17:return e.abrupt("break",58);case 18:return e.prev=18,e.next=21,h.a.put("/private/petCategoryManageFare/".concat(i.result[1]._id),{petSize:t.petSize2||i.result[1].petSize,rangeStart:M.min||i.result[1].rangeStart,rangeEnd:M.max||i.result[1].rangeEnd,petPrize:t.petPrize2||i.result[1].petPrize,cargePrize:t.cargePrize2||i.result[1].cargePrize,adminFareSet:i.adminFare._id});case 21:c=e.sent,m=c.data,z.b.success(m.messages,{position:z.b.POSITION.TOP_RIGHT}),ae(),e.next=30;break;case 27:e.prev=27,e.t2=e.catch(18),console.log(e.t2);case 30:return e.abrupt("break",58);case 31:return e.prev=31,e.next=34,h.a.put("/private/petCategoryManageFare/".concat(i.result[2]._id),{petSize:t.petSize3||i.result[2].petSize,rangeStart:G.min||i.result[2].rangeStart,rangeEnd:G.max||i.result[2].rangeEnd,petPrize:t.petPrize3||i.result[2].petPrize,cargePrize:t.cargePrize3||i.result[2].cargePrize,adminFareSet:i.adminFare._id});case 34:s=e.sent,d=s.data,z.b.success(d.messages,{position:z.b.POSITION.TOP_RIGHT}),ae(),e.next=43;break;case 40:e.prev=40,e.t3=e.catch(31),console.log(e.t3);case 43:return e.abrupt("break",58);case 44:return e.prev=44,e.next=47,h.a.put("/private/rideVehicleUpdate/62d53ad1bf652aa3778946d0",{vehicleId:Object(r.a)(B.map((function(e){return e.value})))});case 47:u=e.sent,u.data,z.b.success("Success",{position:z.b.POSITION.TOP_RIGHT}),ae(),e.next=56;break;case 53:e.prev=53,e.t4=e.catch(44),console.log(e.t4);case 56:case 57:return e.abrupt("break",58);case 58:case"end":return e.stop()}}),e,null,[[3,14],[18,27],[31,40],[44,53]])})));return function(t,a){return e.apply(this,arguments)}}();return console.log(i),console.log(C.filter((function(e){return i.vehicleId.some((function(t){return e.value===t._id}))}))),d.a.createElement(d.a.Fragment,null,d.a.createElement("div",{className:"page-content"},d.a.createElement("div",{className:a.root},d.a.createElement(b.a,null,d.a.createElement("div",{className:a.paperPaddingRightLeft},d.a.createElement("div",{className:"py-4"},d.a.createElement(b.a,{elevation:0,className:g()(a.paperHeading,a.addNewCategory)},d.a.createElement("div",{className:a.headingSellerDetails},d.a.createElement(E.a,{onClick:function(){j.a.fire({showClass:{popup:"animate__animated animate__fadeInDown"},hideClass:{popup:"animate__animated animate__fadeOutUp"},title:"Do you want to save the changes?",showConfirmButton:!1,showDenyButton:!0,showCloseButton:!0,showCancelButton:!1,denyButtonText:"Don't save"}).then((function(t){console.log(t),t.isDenied?e.history.push({pathname:"/adminPanel/PetCategoryManagement"}):t.isCancelled&&j.a.fire("Changes are not saved","","info")}))}},d.a.createElement(F.a,null),"BACK")),d.a.createElement("div",{className:g()(a.addNewCategoryHeading)}," ",d.a.createElement("h3",{className:g()(a.MarginControl),style:{marginBottom:"-0.5rem",marginLeft:"-135px"}},console.log(i),"MANAGE FARE"))),d.a.createElement(b.a,{elevation:0,style:{display:"flex",flexDirection:"column"}},d.a.createElement("div",{style:{margin:"2rem 0 2rem 0"}},d.a.createElement(f.d,{validationSchema:$,initialValues:{cargePrize1:i.result[0].cargePrize,petPrize1:i.result[0].petPrize,petSize1:i.result[0].petSize,cargePrize2:i.result[1].cargePrize,petPrize2:i.result[1].petPrize,petSize2:i.result[1].petSize,cargePrize3:i.result[2].cargePrize,petPrize3:i.result[2].petPrize,petSize3:i.result[2].petSize,distanceRate:null===i||void 0===i||null===(t=i.adminFare)||void 0===t?void 0:t.distanceRate,adminCommission:Object(y.get)(null===i||void 0===i?void 0:i.adminFare,"adminCommission",""),cancellationFee:Object(y.get)(null===i||void 0===i?void 0:i.adminFare,"cancellationFee",""),timeRate:Object(y.get)(null===i||void 0===i?void 0:i.adminFare,"timeRate",""),bookingFee:Object(y.get)(null===i||void 0===i?void 0:i.adminFare,"bookingFee",""),adminCancellationFee:Object(y.get)(null===i||void 0===i?void 0:i.adminFare,"adminCancellationFee",""),driverCancellationFee:Object(y.get)(null===i||void 0===i?void 0:i.adminFare,"driverCancellationFee","")},onSubmit:function(e){console.log(e,"OOOO"),i&&""!==i?ne(e):console.log("gadbad")}},(function(e){var t=e.values,a=(e.setFieldValue,e.errors);return d.a.createElement(f.c,null,d.a.createElement("div",{className:"container"},d.a.createElement("div",{className:"row my-4 mx-1"},d.a.createElement("h4",null," Edit Size (in USD) :")),d.a.createElement("div",{className:"row"},d.a.createElement("div",{className:"col-3"},d.a.createElement("span",{style:{fontSize:"16px",fontWeight:"bold"}},"Pet Size")),d.a.createElement("div",{className:"col-3"},d.a.createElement("span",{style:{fontSize:"16px",fontWeight:"bold"}},"Range")),d.a.createElement("div",{className:"col-3"},d.a.createElement("span",{style:{fontSize:"16px",fontWeight:"bold"}},"Pet Price")),d.a.createElement("div",{className:"col-3"},d.a.createElement("span",{style:{fontSize:"16px",fontWeight:"bold"}},"Cage Price"))),d.a.createElement("div",{className:"row align-items-center"},d.a.createElement("div",{className:"col-2 d-flex flex-column"}," ",d.a.createElement(f.b,{style:{borderRadius:"5px",border:"1px solid #ccc",padding:"0.5rem",width:"100%",fontSize:"1.2rem",fontWeight:"500",color:"rgba(0, 0, 0, 0.87)",backgroundColor:"white",outline:"none",boxSizing:"border-box",marginBottom:"1rem",textTransform:"capitalize",cursor:"not-allowed"},className:"",name:"petSize1",type:"text",readOnly:!0}),d.a.createElement(v.a,{name:"petSize1"})),d.a.createElement("div",{className:"col-3"},d.a.createElement(w.a,{step:1,formatLabel:function(e){return e+"lbs"},draggableTrack:!1,allowSameValues:!1,maxValue:100,minValue:0,value:T,onChange:q,onChangeComplete:function(e){return console.log(e)}})),d.a.createElement("div",{className:"col-3 d-flex flex-column"},d.a.createElement(f.b,{style:{borderRadius:"5px",border:"1px solid #ccc",padding:"0.5rem",width:"100%",fontSize:"1.2rem",fontWeight:"500",color:"rgba(0, 0, 0, 0.87)",backgroundColor:"white",outline:"none",boxSizing:"border-box",marginBottom:"1rem"},className:"",name:"petPrize1",type:"text",readOnly:!X[0]}),d.a.createElement(v.a,{name:"petPrize1"})),d.a.createElement("div",{className:"col-3 d-flex flex-column"},d.a.createElement(f.b,{style:{borderRadius:"5px",border:"1px solid #ccc",padding:"0.5rem",width:"100%",fontSize:"1.2rem",fontWeight:"500",color:"rgba(0, 0, 0, 0.87)",backgroundColor:"white",outline:"none",boxSizing:"border-box",marginBottom:"1rem"},className:"",name:"cargePrize1",type:"text",readOnly:!X[0]}),d.a.createElement(v.a,{name:"cargePrize1"})),d.a.createElement("div",{className:"col-1 d-flex"},d.a.createElement("button",{type:"button",className:"FarePackageSmallEditButton",onClick:function(){Z(Object(n.a)(Object(n.a)({},X),{},{0:!0}))}},d.a.createElement(N.a,null)),X[0]?d.a.createElement("button",{type:"button",className:"FarePackageSmallSaveButton",onClick:function(){a.cargePrize1?z.b.error("Incorrect Value",{position:"top-right"}):re(t,0),Z(Object(n.a)(Object(n.a)({},X),{},{0:!1}))}},d.a.createElement(S.a,null)):"")),d.a.createElement("div",{className:"row align-items-center"},d.a.createElement("div",{className:"col-2 d-flex flex-column"}," ",d.a.createElement(f.b,{style:{borderRadius:"5px",border:"1px solid #ccc",padding:"0.5rem",width:"100%",fontSize:"1.2rem",fontWeight:"500",color:"rgba(0, 0, 0, 0.87)",backgroundColor:"white",outline:"none",boxSizing:"border-box",marginBottom:"1rem",textTransform:"capitalize",cursor:"not-allowed"},className:"",name:"petSize2",type:"text",readOnly:!0}),d.a.createElement(v.a,{name:"petSize2"})),d.a.createElement("div",{className:"col-3"},d.a.createElement(w.a,{step:1,formatLabel:function(e){return e+"lbs"},draggableTrack:!1,allowSameValues:!1,maxValue:100,minValue:0,value:M,onChange:V,onChangeComplete:function(e){return console.log(e)}})),d.a.createElement("div",{className:"col-3 d-flex flex-column"},d.a.createElement(f.b,{style:{borderRadius:"5px",border:"1px solid #ccc",padding:"0.5rem",width:"100%",fontSize:"1.2rem",fontWeight:"500",color:"rgba(0, 0, 0, 0.87)",backgroundColor:"white",outline:"none",boxSizing:"border-box",marginBottom:"1rem"},className:"",name:"petPrize2",type:"text",readOnly:!X[1]}),d.a.createElement(v.a,{name:"petPrize2"})),d.a.createElement("div",{className:"col-3 d-flex flex-column"},d.a.createElement(f.b,{style:{borderRadius:"5px",border:"1px solid #ccc",padding:"0.5rem",width:"100%",fontSize:"1.2rem",fontWeight:"500",color:"rgba(0, 0, 0, 0.87)",backgroundColor:"white",outline:"none",boxSizing:"border-box",marginBottom:"1rem"},className:"",name:"cargePrize2",type:"text",readOnly:!X[1]}),d.a.createElement(v.a,{name:"cargePrize2"})),d.a.createElement("div",{className:"col-1 d-flex"},d.a.createElement("button",{type:"button",className:"FarePackageSmallEditButton",onClick:function(){Z(Object(n.a)(Object(n.a)({},X),{},{1:!0}))}},d.a.createElement(N.a,null)),X[1]?d.a.createElement("button",{type:"button",className:"FarePackageSmallSaveButton",onClick:function(){a.cargePrize2?z.b.error("Incorrect Value",{position:"top-right"}):re(t,1),Z(Object(n.a)(Object(n.a)({},X),{},{1:!1}))}},d.a.createElement(S.a,null)):"")),d.a.createElement("div",{className:"row align-items-center"},d.a.createElement("div",{className:"col-2 d-flex flex-column"}," ",d.a.createElement(f.b,{style:{borderRadius:"5px",border:"1px solid #ccc",padding:"0.5rem",width:"100%",fontSize:"1.2rem",fontWeight:"500",color:"rgba(0, 0, 0, 0.87)",backgroundColor:"white",outline:"none",boxSizing:"border-box",marginBottom:"1rem",textTransform:"capitalize",cursor:"not-allowed"},className:"",name:"petSize3",type:"text",readOnly:!0}),d.a.createElement(v.a,{name:"petSize3"})),d.a.createElement("div",{className:"col-3"},d.a.createElement(w.a,{step:1,formatLabel:function(e){return e+"lbs"},draggableTrack:!1,allowSameValues:!1,maxValue:100,minValue:0,value:G,onChange:U,onChangeComplete:function(e){return console.log(e)}})),d.a.createElement("div",{className:"col-3 d-flex flex-column"},d.a.createElement(f.b,{style:{borderRadius:"5px",border:"1px solid #ccc",padding:"0.5rem",width:"100%",fontSize:"1.2rem",fontWeight:"500",color:"rgba(0, 0, 0, 0.87)",backgroundColor:"white",outline:"none",boxSizing:"border-box",marginBottom:"1rem"},className:"",name:"petPrize3",type:"text",readOnly:!X[2]}),d.a.createElement(v.a,{name:"petPrize3"})),d.a.createElement("div",{className:"col-3 d-flex flex-column"},d.a.createElement(f.b,{style:{borderRadius:"5px",border:"1px solid #ccc",padding:"0.5rem",width:"100%",fontSize:"1.2rem",fontWeight:"500",color:"rgba(0, 0, 0, 0.87)",backgroundColor:"white",outline:"none",boxSizing:"border-box",marginBottom:"1rem"},className:"",name:"cargePrize3",type:"text",readOnly:!X[2]}),d.a.createElement(v.a,{name:"cargePrize3"})),d.a.createElement("div",{className:"col-1 d-flex "},d.a.createElement("button",{type:"button",className:"FarePackageSmallEditButton",onClick:function(){Z(Object(n.a)(Object(n.a)({},X),{},{2:!0}))}},d.a.createElement(N.a,null)),X[2]?d.a.createElement("button",{type:"button",className:"FarePackageSmallSaveButton",onClick:function(){a.cargePrize3?z.b.error("Incorrect Value",{position:"top-right"}):re(t,2),Z(Object(n.a)(Object(n.a)({},X),{},{2:!1}))}},d.a.createElement(S.a,null)):"")),d.a.createElement("div",{className:"row my-4 mx-1"},d.a.createElement("h4",null,"Edit Fare (in USD):")),d.a.createElement("div",{className:"row my-2"},d.a.createElement("div",{className:"col-6 d-flex flex-column "},d.a.createElement("span",{style:{fontSize:"16px",fontWeight:"bold"}},"Distance Rate(per mile):"),d.a.createElement(f.b,{style:{borderRadius:"5px",border:"1px solid #ccc",padding:"0.5rem",width:"100%",fontSize:"1.2rem",fontWeight:"500",color:"rgba(0, 0, 0, 0.87)",backgroundColor:"white",outline:"none",boxSizing:"border-box",marginBottom:"1rem"},className:"",name:"distanceRate",type:"text"}),d.a.createElement(v.a,{name:"distanceRate"})),d.a.createElement("div",{className:"col-6 d-flex flex-column"},d.a.createElement("span",{style:{fontSize:"16px",fontWeight:"bold"}},"Time Rate(per min):"),d.a.createElement(f.b,{style:{borderRadius:"5px",border:"1px solid #ccc",padding:"0.5rem",width:"100%",fontSize:"1.2rem",fontWeight:"500",color:"rgba(0, 0, 0, 0.87)",backgroundColor:"white",outline:"none",boxSizing:"border-box",marginBottom:"1rem"},className:"",name:"timeRate",type:"text"}),d.a.createElement(v.a,{name:"timeRate"}))),d.a.createElement("div",{className:"row my-2"},d.a.createElement("div",{className:"col-6 d-flex flex-column"},d.a.createElement("span",{style:{fontSize:"16px",fontWeight:"bold"}},"Booking Fee(per mile):"),d.a.createElement(f.b,{style:{borderRadius:"5px",border:"1px solid #ccc",padding:"0.5rem",width:"100%",fontSize:"1.2rem",fontWeight:"500",color:"rgba(0, 0, 0, 0.87)",backgroundColor:"white",outline:"none",boxSizing:"border-box",marginBottom:"1rem"},className:"",name:"bookingFee",type:"text"}),d.a.createElement(v.a,{name:"bookingFee"})),d.a.createElement("div",{className:"col-6 d-flex flex-column"},d.a.createElement("span",{style:{fontSize:"16px",fontWeight:"bold"}},"Admin Commission(in %):"),d.a.createElement(f.b,{style:{borderRadius:"5px",border:"1px solid #ccc",padding:"0.5rem",width:"100%",fontSize:"1.2rem",fontWeight:"500",color:"rgba(0, 0, 0, 0.87)",backgroundColor:"white",outline:"none",boxSizing:"border-box",marginBottom:"1rem"},className:"",name:"adminCommission",type:"text"}),d.a.createElement(v.a,{name:"adminCommission"}))),d.a.createElement("div",{className:"row my-2"},d.a.createElement("div",{className:"col-6 d-flex flex-column"},d.a.createElement("span",{style:{fontSize:"16px",fontWeight:"bold"}},"Cancellation Fee:"),d.a.createElement(f.b,{style:{borderRadius:"5px",border:"1px solid #ccc",padding:"0.5rem",width:"100%",fontSize:"1.2rem",fontWeight:"500",color:"rgba(0, 0, 0, 0.87)",backgroundColor:"white",outline:"none",boxSizing:"border-box",marginBottom:"1rem"},className:"",name:"cancellationFee",type:"text"}),d.a.createElement(v.a,{name:"cancellationFee"})),d.a.createElement("div",{className:"col-6 d-flex flex-column"},d.a.createElement("span",{style:{fontSize:"16px",fontWeight:"bold"}},"Admin Cancellation Fee(in %):"),d.a.createElement(f.b,{style:{borderRadius:"5px",border:"1px solid #ccc",padding:"0.5rem",width:"100%",fontSize:"1.2rem",fontWeight:"500",color:"rgba(0, 0, 0, 0.87)",backgroundColor:"white",outline:"none",boxSizing:"border-box",marginBottom:"1rem"},className:"",name:"adminCancellationFee",type:"text"}),d.a.createElement(v.a,{name:"adminCancellationFee"}))),d.a.createElement("div",{className:"row my-2"},d.a.createElement("div",{className:"col-6 d-flex flex-column"},d.a.createElement("span",{style:{fontSize:"16px",fontWeight:"bold"}},"Driver Cancellation Fee:"),d.a.createElement(f.b,{style:{borderRadius:"5px",border:"1px solid #ccc",padding:"0.5rem",width:"100%",fontSize:"1.2rem",fontWeight:"500",color:"rgba(0, 0, 0, 0.87)",backgroundColor:"white",outline:"none",boxSizing:"border-box",marginBottom:"1rem"},className:"",name:"driverCancellationFee",type:"text"}),d.a.createElement(v.a,{name:"driverCancellationFee"})))),d.a.createElement("div",{style:{display:"flex",justifyContent:"center"}},d.a.createElement("button",{type:"submit",className:"buttoncss",style:{borderRadius:"1.5rem",border:"none",fontSize:"1rem",width:"15vw",height:"5vh",backgroundColor:"#0059cd",color:"#fff"}},"SAVE")))}))))))))))}}}]);
//# sourceMappingURL=17.62beb8ac.chunk.js.map