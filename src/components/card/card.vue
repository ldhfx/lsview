<template>
    <div :class="classes">
        <div 
          :class="headClasses" 
          v-if="showHead"
        >
          <slot name="title">
            <p v-if="title">
              <img :class="iconClasses" v-if="icon" :src="icon">
                {{title}}
            </p>
        </slot></div>
        <div 
          :class="bodyClasses" 
          :style="bodyStyles"
        >
          <slot></slot>
        </div>
        <div 
          :class="footClasses"
          v-if="showFoot"
        >
          <slot name="foot">
            <p>
              <i :class="footIconClasses"></i>
              {{stage}}
            </p>
          </slot>
        </div>
    </div>
</template>
<script>
    const prefixCls = 'lsView-card';
    const defaultPadding = 16;
    const stateList = ['待处理', '处理中', '已完结'];
    export default {
        name: 'Card',
        props: {
            bordered: {
                type: Boolean,
                default: true
            },
            disHover: {
                type: Boolean,
                default: false
            },
            shadow: {
                type: Boolean,
                default: false
            },
            padding: {
                type: Number,
                default: defaultPadding
            },
            title: {
                type: String
            },
            icon: {
                type: String
            },
            state: {
                type: Number
            }
        },
        data () {
            return {
                showHead: true,
                showFoot: true
            };
        },
        computed: {
            classes () {
                return [
                    `${prefixCls}`,
                    {
                        [`${prefixCls}-bordered`]: this.bordered && !this.shadow,
                        [`${prefixCls}-dis-hover`]: this.disHover || this.shadow,
                        [`${prefixCls}-shadow`]: this.shadow
                    }
                ];
            },
            headClasses () {
                return `${prefixCls}-head`;
            },
            iconClasses () {
                return `${prefixCls}-icon`;
            },
            bodyClasses () {
                return `${prefixCls}-body`;
            },
            footClasses () {
                return `${prefixCls}-foot`;
            },
            footIconClasses () {
                return [
                    `${prefixCls}-foot-icon`,
                    `${prefixCls}-foot-icon-${this.state}`
                ];
            },
            bodyStyles () {
                if (this.padding !== defaultPadding) {
                    return {
                        padding: `${this.padding}px`
                    };
                } else {
                    return '';
                }
            },
            stage () {
                return stateList[this.state];
            }
        },
        mounted () {
            this.showHead = this.title || this.$slots.title !== undefined;
            this.showFoot = this.state !== undefined || this.$slots.foot !== undefined;
        }
    };
</script>
