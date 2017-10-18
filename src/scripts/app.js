import {name} from './new_file.js';
import '../styles/index.scss';
import Vue from 'vue';
name.sayName();

console.log(Vue);
Vue.component("mycomponent",{
	template: '<div>doakjf</div>'
});
new Vue({
	el: '#root',
	data: {
		message: 'heleelo!',
		isShow:'true',
		html:'<span>dd</span>',
		courseList: [
			'html',
			'css',
			'javascript'
		]
	},
	methods:{
		showHide: function () {
			this.isShow = !this.isShow;
			console.log(this);
			
		}
	}
});




