<template>
    <div class="radio-main" style="paddingLeft:10px">
      <RadioGroup v-model="name" :name="name">
        <Radio label="demo1"></Radio>
        <Radio label="demo2"></Radio>
        <Radio label="demo3"></Radio>
      </RadioGroup>
      <br>11111<br>
      <Radio>{{label}}</Radio>
      <br>11111<br>
      <RadioGroup type="button" v-model="name2" :name="name2">
        <Radio label="demo1"></Radio>
        <Radio label="demo2"></Radio>
        <Radio label="demo3"></Radio>
      </RadioGroup>
    </div>
</template>


<script>
export default {
    data () {
        return {
            name: 'demo1',
            name2: 'demo1',
            label: '哈哈哈',
            labelList: ['demo1,demo2,demo3']
        };
    }
};
</script>

<style lang="less" scoped>
.radio-main{
    padding: 60px;
    background-color: rgba(0,0,0,0.6);
}
</style>

