<template>
  <div :class="wrapClass">
      <div :class="handlerClasses">
          <a 
            :class="upClasses"
            @mousedown="preventDefault"
            @click="up">
            <i class="fa fa-angle-up" @click="preventDefault"></i>
          </a>
          <a 
            :class="downClasses"
            @mousedown="preventDefault"
            @click="down">
            <i class="fa fa-angle-down" @click="preventDefault"></i>
          </a>
      </div>
      <div :class="inputWrapClasses">
          <input 
            :class="inputClass"
            :value="formatterValue"
          >
      </div>
  </div>
</template>


<script>
const prefixCls = 'iView-input-number';

function addNum (num1, num2) {
    let sq1, sq2, m;
    try {
        sq1 = num1.toString().split('.')[1].length;
    } catch (e) {
        sq1 = 0;
    }
    try {
        sq2 = num2.toString().split('.')[1].length;
    } catch (e) {
        sq2 = 0;
    }
    m = Math.pow(10, Math.max(sq1, sq2));
    return (Math.round(num1 * m) + Math.round(num2 * m)) / m;
}
export default {
    data () {
        return {
            upDisabled: false,
            downDisabled: false,
            currentValue: this.value
        };
    },
    props: {
        max: {
            type: Number,
            default: Infinity
        },
        min: {
            type: Number,
            default: -Infinity
        },
        step: {
            type: Number,
            default: 1
        },
        value: {
            type: Number,
            default: 1
        },
        precision: {
            type: Number
        },
        formatter: {
            type: Function
        },
        disabled: {
            type: Boolean,
            default: false
        },
        readonly: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        wrapClass () {
            return prefixCls;
        },
        handlerClasses () {
            return `${prefixCls}-handler-wrap`;
        },
        upClasses () {
            return [
                `${prefixCls}-handler`,
                `${prefixCls}-handler-up`,
                {
                    [`${prefixCls}-up-disabled`]: this.upDisabled
                }
            ];
        },
        downClasses () {
            return [
                `${prefixCls}-handler`,
                `${prefixCls}-handler-down`,
                {
                    [`${prefixCls}-down-disabled`]: this.downDisabled
                }
            ];
        },
        inputWrapClasses () {
            return `${prefixCls}-input-wrap`;
        },
        inputClass () {
            return `${prefixCls}-input`;
        },
        precisionValue () {
                // can not display 1.0
            return this.precision ? this.currentValue.toFixed(this.precision) : this.currentValue;
        },
        formatterValue () {
            if (this.formatter && this.precisionValue !== null) {
                return this.formatter(this.precisionValue);
            } else {
                return this.precisionValue;
            }
        }
    },
    watch: {
        currentValue (val) {
            this.changeVal(val);
        }
    },
    mounted () {
        this.changeVal(this.currentValue);
    },
    methods: {
        preventDefault (e) {
            e.preventDefault();
        },
        up (e) {
            const targetVal = Number(e.target.value);
            if (this.upDisabled && isNaN(targetVal)) {
                return false;
            }
            this.changeStep('up', e);
        },
        down (e) {
            const targetVal = Number(e.target.value);
            if (this.downDisabled && isNaN(targetVal)) {
                return false;
            }
            this.changeStep('down', e);
        },
        changeStep (type, e) {
            if (this.disabled || this.readonly) {
                return false;
            }
            const targetVal = Number(e.target.value);
            let val = Number(this.currentValue);
            const step = Number(this.step);
            if (isNaN(val)) {
                return false;
            }
      // input a number, and key up or down
            if (!isNaN(targetVal)) {
                if (type === 'up') {
                    if (addNum(targetVal, step) <= this.max) {
                        val = targetVal;
                    } else {
                        return false;
                    }
                } else if (type === 'down') {
                    if (addNum(targetVal, -step) >= this.min) {
                        val = targetVal;
                    } else {
                        return false;
                    }
                }
            }
            if (type === 'up') {
                val = addNum(val, step);
            } else if (type === 'down') {
                val = addNum(val, -step);
            }
            this.setValue(val);
        },
        changeVal (val) {
            val = Number(val);
            if (!isNaN(val)) {
                const step = this.step;
                this.upDisabled = val + step > this.max;
                this.downDisabled = val - step < this.min;
            } else {
                this.upDisabled = true;
                this.downDisabled = true;
            }
        },
        setValue (val) {
        // 如果 step 是小数，且没有设置 precision，是有问题的
    //   if (!isNaN(this.precision)) {
    //     val = Number(Number(val).toFixed(this.precision))
    //   }
    //   this.$nextTick(() => {
    //     this.currentValue = val
    //     this.$emit('input', val)
    //     this.$emit('on-change', val)
    //     this.dispatch('FormItem', 'on-form-change', val)
    //   })
            this.$nextTick(() => {
                this.currentValue = val;
                this.$emit('input', val);
                this.$emit('on-change', val);
                // this.dispatch('FormItem', 'on-form-change', val);
            });
        }
    }
};
</script>

<style lang="less" scoped>
@import '~@/styles/basics.less';
.iView-input-number{
    display: inline-block;
    width: 100%;
    line-height: 1.5;
    padding: 4px 7px;
    font-size: 12px;
    color: #495060;
    background-color: transparent;
    background-image: none;
    position: relative;
    cursor: text;
    transition: border .2s ease-in-out,background .2s ease-in-out,box-shadow .2s ease-in-out;
    margin: 0;
    padding: 0;
    width: 80px;
    height: 32px;
    line-height: 32px;
    vertical-align: middle;
    border: 1px solid #fff;
    border-radius: 4px;
    overflow: hidden;
    &:focus,&:hover{
        border:1px solid @color-green;
        box-shadow:1px 1px 5px @color-green;
        .iView-input-number-handler-wrap{
            opacity: 1;
        }
    }
    .iView-input-number-handler-wrap{
        width: 22px;
        height: 100%;
        border-left: 1px solid #dddee1;
        border-radius: 0 4px 4px 0;
        background: transparent;
        position: absolute;
        top: 0;
        right: 0;
        opacity: 0;
        transition: opacity .2s ease-in-out;
        .iView-input-number-handler{
            display: block;
            width: 100%;
            height: 16px;
            line-height: 0;
            text-align: center;
            overflow: hidden;
            color: #ffffff;
            font-size: 16px;
            line-height: 16px;
            text-align: center;
            position: relative;
            &:hover{
                color: @color-green;
            }
            &.iView-input-number-handler-up{
                border-bottom:1px solid #fff;
            }
            &.iView-input-number-handler-down{

            }
        }
    }
    .iView-input-number-input-wrap{
        overflow: hidden;
        height: 32px;
        .iView-input-number-input{
            width: 100%;
            height: 32px;
            line-height: 32px;
            padding: 0 7px;
            text-align: left;
            outline: 0;
            -moz-appearance: textfield;
            color: #fff;
            border: 0;
            background-color: transparent;
            border-radius: 4px;
            transition: all .2s linear;
        }
    }
}
</style>

