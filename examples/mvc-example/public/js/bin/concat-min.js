"use strict";var router=new VueRouter,aboutComponent=Vue.extend({template:templatizer.about.index({}),data:function(){return{ready:!1}},methods:{fetchData:function(t){t&&"function"==typeof t&&t(null)}},ready:function(){},route:{data:function(t){var e=this;e.fetchData(function(a){a?(e.$root.alert(a,"error"),router.go("/")):(e.ready=!0,t.next())})},waitForData:!0}}),dashboardComponent=Vue.extend({template:templatizer.dashboard.index({}),data:function(){return{ready:!1}},methods:{fetchData:function(t){t&&"function"==typeof t&&t(null)}},ready:function(){},route:{data:function(t){var e=this;e.fetchData(function(a){a?(e.$root.alert(a,"error"),router.go("/")):(e.ready=!0,t.next())})},waitForData:!0}}),sessionComponent=Vue.extend({template:templatizer.session.create({}),data:function(){return{email:"",password:"",ready:!1}},methods:{login:function(){var t=this;validate.async({email:t.email,password:t.password},{email:{presence:!0},password:{presence:!0}}).then(function(e){t.$root.$sc.emit("session",{method:"store",email:e.email,password:e.password},function(e){return e?(console.log(e),t.$root.alert(e,"error")):void(t.$root.authenticated=!0)})},function(e){var a=null;for(var o in e){a=e[o][0];break}t.$root.alert(a,"error")})}},ready:function(){},route:{data:function(t){var e=this;e.ready=!0,t.next()}}}),usersComponent=Vue.extend({template:templatizer.users.create({}),data:function(){return{first:"",last:"",email:"",password:"",ready:!1}},methods:{fetchData:function(t){t&&"function"==typeof t&&t(null)},clearFields:function(){this.first="",this.last="",this.email="",this.password=""},create:function(){var t=this;validate.async({first:t.first,last:t.last,email:t.email,password:t.password,visible:1},{first:{presence:!0},last:{presence:!0},email:{presence:!0},password:{presence:!0}}).then(function(e){t.$root.$sc.emit("users",{method:"store",user:e},function(e,a){return e?t.$root.alert(e,"error"):(t.$root.alert("Successfully created account "+a.email+"! Please log in.","success"),void router.go({path:"/session/create"}))})},function(e){var a=null;for(var o in e){a=e[o][0];break}t.$root.alert(a,"error")})}},ready:function(){},route:{data:function(t){var e=this;e.fetchData(function(a){a?t.abort():(e.ready=!0,e.clearFields(),t.next())})},waitForData:!0}});Vue.use(VueRouter),Vue.use(VueSocketcluster),router.map({"/dashboard":{component:dashboardComponent,auth:!0},"/about":{component:aboutComponent,auth:!0},"/session/create":{component:sessionComponent,auth:!1},"/users/create":{component:usersComponent,auth:!1}}),router.redirect({"/":"/dashboard","*":"/dashboard"}),router.beforeEach(function(t){router.app.loading=!0,t.to.auth&&"authenticated"!=router.app.$sc.authState?(router.app.loading=!1,t.redirect("/session/create")):"authenticated"!=router.app.$sc.authState||t.to.auth?t.next():(router.app.loading=!1,t.redirect("/dashboard"))}),router.afterEach(function(t){setTimeout(function(){router.app.loading=!1},router.app.loading_delay)}),router.start(Vue.extend({data:function(){return{loading_delay:20,show_success:!1,success_msg:"",show_error:!1,error_msg:"",started:!1,loading:!0,authenticated:!1,first:"",last:"",email:""}},watch:{authenticated:function(t,e){t?(this.setUserData(),router.go({path:"/dashboard"})):router.go({path:"/session/create"})}},methods:{setUserData:function(){var t=this,e=t.$sc.getAuthToken();t.first=e.first,t.last=e.last,t.email=e.email},alert:function(t,e){var a=this;try{a[e+"_msg"]=t,a["show_"+e]=!0,setTimeout(function(){a[e+"_msg"]=null},3e3)}catch(t){console.log(t)}},logout:function(){var t=this;t.$root.$sc.emit("session",{method:"destroy"},function(e){return e?(console.log(e),t.$root.alert(e,"error")):void(t.$root.authenticated=!1)})}},sockets:{connect:function(t){var e=this;console.log("Connected to server!"),"authenticated"==e.$sc.authState?(e.authenticated=!0,e.setUserData()):e.authenticated=!1},authenticate:function(){this.authenticated=!0},deauthenticate:function(){this.authenticated=!1}},components:{alert:VueStrap.alert,navbar:VueStrap.navbar},ready:function(){var t=this;t.started=!0}}),"#app");