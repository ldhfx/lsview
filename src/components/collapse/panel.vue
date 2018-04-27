<template>
    <div :class="itemClasses">
        <div :class="headerClasses" @click="toggle">
            <i  class="fa fa-caret-right" ></i>
            <slot></slot>
        </div>
        <collapse-transition>
            <div :class="contentClasses" v-show="isActive">
                <div :class="boxClasses"><slot name="content"></slot></div>
            </div>
        </collapse-transition>
    </div>
</template>
<script>
    import CollapseTransition from '@/components/base/collapse-transition';
    const prefixCls = 'lsView-collapse';

    export default {
        name: 'Panel',
        components: {  CollapseTransition },
        props: {
            name: {
                type: String
            }
        },
        data () {
            return {
                index: 0, // use index for default when name is null
                isActive: false
            };
        },
        computed: {
            itemClasses () {
                return [
                    `${prefixCls}-item`,
                    {
                        [`${prefixCls}-item-active`]: this.isActive
                    }
                ];
            },
            headerClasses () {
                return `${prefixCls}-header`;
            },
            contentClasses () {
                return `${prefixCls}-content`;
            },
            boxClasses () {
                return `${prefixCls}-content-box`;
            }
        },
        methods: {
            toggle () {
                this.$parent.toggle({
                    name: this.name || this.index,
                    isActive: this.isActive
                });
            }
        }
    };
</script>
