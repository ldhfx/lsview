<template>
    <div
        tabindex="0"
        :class="classes"
        v-clickoutside="handleClose">
        <div
            :class="selectionCls"
            ref="reference"
            @focus="handleFocus"
            @blur="handleBlur"
            @click="toggleMenu">
            <slot name="input">
                <input type="hidden" :name="name" :value="model">
                <div :class="[prefixCls+'-tag '+ prefixCls+'-tag-checked']" v-for="(item, index) in selectedMultiple" :key="index">
                    <span class="iView-tag-tag-text">{{ item.label }}</span>
                    <Icon type="ios-close-empty" @click.native.stop="removeTag(index)"></Icon>
                </div>
                <span :class="[prefixCls + '-placeholder']" v-show="showPlaceholder && !filterable">{{ localePlaceholder }}</span>
                <span :class="[prefixCls + '-selected-value']" v-show="!showPlaceholder  && !multiple && !filterable">{{ selectedSingle }}</span>
                <i :class="stateIConClass"></i>
                <input 
                  ref="input"
                  v-if="filterable"
                  v-model="query"
                  :placeholder="showPlaceholder ? localePlaceholder : ''"
                  type="text"
                  :class="[prefixCls + '-input']"
                  autocomplete="off"
                  spellcheck="false"
                  @blur="handleBlur"
                  @keydown="resetInputState"
                >
            </slot>
        </div>
        <transition name="transition-drop">
            <div
                :class="dropdownCls"
                v-show="dropVisible"
                ref="dropdown">
                <ul v-show="notFoundShow" :class="[prefixCls + '-not-found']"><li>{{ localeNotFoundText }}</li></ul>
                <ul v-show="(!notFound && !remote) || (remote && !loading && !notFound)" :class="[prefixCls + '-dropdown-list']"><slot></slot></ul>
                <ul v-show="loading" :class="[prefixCls + '-loading']">{{ localeLoadingText }}</ul>
            </div>
        </transition>
    </div>
</template>
<script>
import Drop from './dropdown.vue';
import clickoutside from '../../directives/clickoutside';
import TransferDom from '../../directives/transfer-dom';
import { oneOf } from '../../utils/assist';
import Emitter from '../../mixins/emitter';
// import Locale from '../mixins/locale'
const prefixCls = 'lsView-select';
export default {
    name: 'iSelect',
    mixins: [ Emitter ],
    components: { Drop },
    directives: { clickoutside, TransferDom },
    props: {
        value: {
            type: [String, Number, Array],
            default: ''
        },
    // 使用时，也得设置 value 才行
        label: {
            type: [String, Number, Array],
            default: ''
        },
        multiple: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        clearable: {
            type: Boolean,
            default: false
        },
        placeholder: {
            type: String
        },
        filterable: {
            type: Boolean,
            default: false
        },
        filterMethod: {
            type: Function
        },
        remote: {
            type: Boolean,
            default: false
        },
        remoteMethod: {
            type: Function
        },
        loading: {
            type: Boolean,
            default: false
        },
        loadingText: {
            type: String
        },
        size: {
            validator (value) {
                return oneOf(value, ['small', 'large', 'default']);
            }
        },
        labelInValue: {
            type: Boolean,
            default: false
        },
        notFoundText: {
            type: String
        },
        placement: {
            validator (value) {
                return oneOf(value, ['top', 'bottom']);
            },
            default: 'bottom'
        },
        transfer: {
            type: Boolean,
            default: false
        },
            // Use for AutoComplete
        autoComplete: {
            type: Boolean,
            default: false
        },
        name: {
            type: String
        },
        elementId: {
            type: String
        }
    },
    data () {
        return {
            prefixCls: prefixCls,
            visible: false,
            options: [],
            optionInstances: [],
            selectedSingle: '',    // label
            selectedMultiple: [],
            focusIndex: 0,
            query: '',
            lastQuery: '',
            selectToChangeQuery: false,    // when select an option, set this first and set query, because query is watching, it will emit event
            inputLength: 20,
            notFound: false,
            slotChangeDuration: false,    // if slot change duration and in multiple, set true and after slot change, set false
            model: this.value,
            currentLabel: this.label
        };
    },
    computed: {
        classes () {
            return [
                `${prefixCls}`,
                {
                    [`${prefixCls}-visible`]: this.visible,
                    [`${prefixCls}-disabled`]: this.disabled,
                    [`${prefixCls}-multiple`]: this.multiple,
                    [`${prefixCls}-single`]: !this.multiple,
                    [`${prefixCls}-show-clear`]: this.showCloseIcon,
                    [`${prefixCls}-${this.size}`]: !!this.size
                }
            ];
        },
        stateIConClass () {
            return [
                'fa',
                `${prefixCls}-state-icon`,
                {
                    'fa-angle-down': !this.visible,
                    'fa-angle-up': this.visible
                }
            ];
        },
        selectionCls () {
            return {
                [`${prefixCls}-selection`]: !this.autoComplete,
                [`${prefixCls}-focus`]: this.dropVisible
            };
        },
        dropdownCls () {
            return `${prefixCls}-dropdown-transfer`;
        },
        dropVisible () {
            let status = true;
            const options = this.$slots.default || [];
            if (!this.loading && this.remote && this.query === '' && !options.length) status = false;
            if (this.autoComplete && !options.length) status = false;
            return this.visible && status;
        },
        localePlaceholder () {
            return this.placeholder;
        },
        showPlaceholder () {
            let status = false;
            if ((typeof this.model) === 'string') {
                if (this.model === '') {
                    status = true;
                }
            } else if (Array.isArray(this.model)) {
                if (!this.model.length) {
                    status = true;
                }
            } else if (this.model === null) {
                status = true;
            }
            return status;
        },
        localeLoadingText () {
            return this.loadingText;
        },
        localeNotFoundText () {
            if (this.notFoundText === undefined) {
                return '无匹配数据';
            } else {
                return this.notFoundText;
            }
        },
        notFoundShow () {
            const options = this.$slots.default || [];
            return (this.notFound && !this.remote) || (this.remote && !this.loading && !options.length);
        }
    },
    methods: {
        handleFocus () {
            if (!this.visible) this.toggleMenu();
        },
        handleBlur (event) {
            setTimeout(() => {
                if (this.autoComplete) return;
                const model = this.model;
                if (this.multiple) {
                    this.query = '';
                } else {
                    if (model !== '') {
                        this.findChild((child) => {
                            if (child.value === model) {
                                this.query = child.label === undefined ? child.searchLabel : child.label;
                            }
                        });
            // 如果删除了搜索词，下拉列表也清空了，所以强制调用一次remoteMethod
                        if (this.remote && this.query !== this.lastQuery) {
                            this.$nextTick(() => {
                                this.query = this.lastQuery;
                            });
                        }
                    } else {
                        this.query = '';
                    }
                }
            }, 300);
        },
        toggleMenu () {
            if (this.disabled || this.autoComplete) {
                return false;
            }
            this.visible = !this.visible;
        },
        hideMenu () {
            this.visible = false;
            this.focusIndex = 0;
            this.broadcast('iOption', 'on-select-close');
        },
        handleClose () {
            this.hideMenu();
        },
        modelToQuery () {
            if (this.filterable && this.model !== undefined) {
            }
        },
        findChild (cb) {
            const find = function (child) {
                const name = child.$options.componentName;
                if (name) {
                    cb(child);
                } else if (child.$children.length) {
                    child.$children.forEach((innerChild) => {
                        find(innerChild, cb);
                    });
                }
            };
            if (this.optionInstances.length) {
                this.optionInstances.forEach((child) => {
                    find(child);
                });
            } else {
                this.$children.forEach((child) => {
                    find(child);
                });
            }
        },
        updateOptions (slot = false) {
            let options = [];
            let index = 1;
            this.findChild((child) => {
                options.push({
                    value: child.value,
                    label: (child.label === undefined) ? child.$el.textContent : child.label
                });
                child.index = index++;
                this.optionInstances.push(child);
            });
      // console.log(this.options)
            this.options = options;
        },
        updateMultipleSelected (init = false, slot = false) {
            if (this.multiple && Array.isArray(this.model)) {
                let selected = this.remote ? this.selectedMultiple : [];
                for (let i = 0; i < this.model.length; i++) {
                    const model = this.model[i];
                    for (let j = 0; j < this.options.length; j++) {
                        const option = this.options[j];
                        if (model === option.value) {
                            selected.push({
                                value: option.value,
                                label: option.label
                            });
                        }
                    }
                }
                const selectedArray = [];
                const selectedObject = {};
                selected.forEach(item => {
                    if (!selectedObject[item.value]) {
                        selectedArray.push(item);
                        selectedObject[item.value] = 1;
                    }
                });
                // #2066
                this.selectedMultiple = this.remote ? this.model.length ? selectedArray : [] : selected;
                if (slot) {
                    let selectedModel = [];
                    for (let i = 0; i < selected.length; i++) {
                        selectedModel.push(selected[i].value);
                    }
                        // if slot change and remove a selected option, emit user
                    if (this.model.length === selectedModel.length) {
                        this.slotChangeDuration = true;
                    }
                    this.model = selectedModel;
                }
            }
            this.toggleMultipleSelected(this.model, init);
        },
        toggleMultipleSelected (value, init = false) {
            if (this.multiple) {
                let hybridValue = [];
                for (let i = 0; i < value.length; i++) {
                    hybridValue.push({
                        value: value[i]
                    });
                }
                this.findChild((child) => {
                    const index = value.indexOf(child.value);
                    if (index >= 0) {
                        child.selected = true;
                        hybridValue[index].label = (child.label === undefined) ? child.$el.innerHTML : child.label;
                    } else {
                        child.selected = false;
                    }
                });
                if (!init) {
                    if (this.labelInValue) {
                        this.$emit('on-change', hybridValue);
                        this.dispatch('FormItem', 'on-form-change', hybridValue);
                    } else {
                        this.$emit('on-change', value);
                        this.dispatch('FormItem', 'on-form-change', value);
                    }
                }
            }
        },
        resetInputState () {
            this.inputLength = this.$refs.input.value.length * 12 + 20;
        },
        updateSingleSelected (init = false, slot = false) {
            const type = typeof this.model;
            if (type === 'string' || type === 'number') {
                let findModel = false;
                for (let i = 0; i < this.options.length; i++) {
                    if (this.model === this.options[i].value) {
                        this.selectedSingle = this.options[i].label;
                        findModel = true;
                        break;
                    }
                }
                if (slot && !findModel) {
                    this.model = '';
                    this.query = '';
                }
            }
        },
        removeTag (index) {
            if (this.disabled) {
                return false;
            }
            if (this.remote) {
                const tag = this.model[index];
                this.selectedMultiple = this.selectedMultiple.filter(item => item.value !== tag);
            }
            this.model.splice(index, 1);
            if (this.filterable && this.visible) {
                this.$refs.input.focus();
            }
            this.broadcast('Drop', 'on-update-popper');
        },
        beforeDestroy (val) {
        },
        broadcastQuery (val) {
            this.broadcast('iOption', 'on-query-change', val);
        }
    },
    mounted () {
        this.updateOptions();
        this.$on('on-select-selected', (value) => {
            if (this.model === value) {
            } else {
                if (this.multiple) {
                    const index = this.model.indexOf(value);
                    if (index >= 0) {
                        this.removeTag(index);
                    } else {
                        this.model.push(value);
            // this.broadcast('Drop', 'on-update-popper')
                    }
                } else {
                    this.model = value;
                    if (this.filterable) {
                        this.findChild((child) => {
                            if (child.value === value) {
                                if (this.query !== '') this.selectToChangeQuery = true;
                                this.lastQuery = this.query = child.label === undefined ? child.searchLabel : child.label;
                            }
                        });
                    }
                    this.visible = false;
                }
            }

            this.findChild((child) => {
                if (child.value === this.model) {
                    child.selected = true;
                } else {
                    child.selected = false;
                }
            });
            this.updateSingleSelected();
        });
    },
    watch: {
        value (val) {
            this.model = val;
            if (val === '' || val === null) this.query = '';
        },
        model () {
            this.$emit('input', this.model);
            this.modelToQuery();
            if (this.multiple) {
                if (this.slotChangeDuration) {
                    this.slotChangeDuration = false;
                } else {
                    this.updateMultipleSelected();
                }
            } else {
                this.updateSingleSelected();
            }
            if (!this.visible && this.filterable) {
                this.$nextTick(() => {
                    this.broadcastQuery('');
                });
            }
        },
        query (val) {
      // if (this.remote && this.remoteMethod) {
      //   if (!this.selectToChangeQuery) {
      //     this.$emit('on-query-change', val)
      //     this.remoteMethod(val)
      //   }
      //   this.focusIndex = 0
      //   this.findChild(child => {
      //     child.isFocus = false
      //   })
      // } else {
      //   if (!this.selectToChangeQuery) {
      //     this.$emit('on-query-change', val)
      //   }
      //   this.broadcastQuery(val)
      //   let isHidden = true
      //   this.$nextTick(() => {
      //     this.findChild((child) => {
      //       if (!child.hidden) {
      //         isHidden = false
      //       }
      //     })
      //     this.notFound = isHidden
      //   })
      // }
      // this.selectToChangeQuery = false
            if (!this.selectToChangeQuery) {
                this.$emit('on-query-change', val);
            }
            this.$emit('on-query-change', val);
            this.broadcastQuery(val);
            let isHidden = true;
            this.$nextTick(() => {
                this.findChild((child) => {
                    if (!child.hidden) {
                        isHidden = false;
                    }
                });
                this.notFound = isHidden;
            });
            this.selectToChangeQuery = false;
        }
    }
};
</script>

