<template>
  <div class="input-main">
      <Input v-model="value" :placeholder="placeholder"></Input>
        <a>{{value}}</a>
      <Input :isSearch="isSearch" v-model="value2" :placeholder="placeholder1" @on-search="handleSearch"></Input>
        <a>{{value2}}</a><br>
      <input-number v-model="value3" :max="max" :min="min" :step="step" :parser="value => value.replace('%', '')" :formatter="formatter"></input-number>

      <a>{{value3}}</a>
  </div>
</template>

<script>
export default {
    data () {
        return {
            isSearch: true,
            placeholder: '请输入',
            placeholder1: '请搜索的内容',
            max: 10,
            min: 0,
            step: 1.2,
            value: 0,
            value2:0,
            value3:0,
            formatter: this.formatters
        };
    },
    mounted () {

    },
    methods: {
        formatters (value) {
            return value + '%';
        },
        handleSearch(){
            this.value2=2;
        }
    }
};
</script>


<style lang="less" scoped>
.input-main{
    background-color: rgba(0, 0, 0, 0.6);
    padding: 60px;
}
.iView-input-wrapper{
  margin: 10px;
}
</style>
