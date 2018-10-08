import 'es6-promise/auto';
import 'whatwg-fetch';
import Vue from 'vue';
import Yacht from './components/Yacht.vue';

// import GLOBALS from './core/GLOBALS';

import '../scss/app.scss';

const init = () => {
  // COMPONENT CREATION
  // eslint-disable-next-line no-unused-vars
  const app = new Vue({
    components: {
      yacht: Yacht,
    },
    el: '#app',
    data: {},
  });
};

export default init;
