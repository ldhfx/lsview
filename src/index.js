
import Button from './components/button';

import Card from './components/card';
import {Select, Option, OptionGroup} from './components/select';
import Radio from './components/radio';
import RadioGroup from './components/radio-group';
import Input from './components/input';
import InputNumber from './components/input-number';

import Collapse from './components/collapse';

import locale from './locale/index';

const components = {

    Button,
    Card,
    Select,
    Option,
    OptionGroup,
    Radio,
    RadioGroup,
    Input,
    InputNumber,

    Collapse
   
};

const iview = {
    ...components,
  
};

const install = function(Vue, opts = {}) {
    if (install.installed) return;
    locale.use(opts.locale);
    locale.i18n(opts.i18n);

    Object.keys(iview).forEach(key => {
        Vue.component(key, iview[key]);
    });

    // Vue.prototype.$Loading = LoadingBar;
    // Vue.prototype.$Message = Message;
    // Vue.prototype.$Modal = Modal;
    // Vue.prototype.$Notice = Notice;
    // Vue.prototype.$Spin = Spin;
};

// auto install
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

const API = {
    version: process.env.VERSION, // eslint-disable-line no-undef
    locale: locale.use,
    i18n: locale.i18n,
    install,
    ...components
};

API.lang = (code) => {
    const langObject = window['iview/locale'].default;
    if (code === langObject.i.locale) locale.use(langObject);
    else console.log(`The ${code} language pack is not loaded.`); // eslint-disable-line no-console
};

module.exports.default = module.exports = API;   // eslint-disable-line no-undef
