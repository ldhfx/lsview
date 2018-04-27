<template>
    <div class="select-main">
      <Select class="select"  v-model="model1" style="width:200px">
        <Option v-for="item in cityList" :value="item.value" :label="item.label" :key="item.value"></Option>
      </Select>
      {{model1}}
      <Select class="select" :placeholder="placeholder" v-model="model2" style="width:200px">
        <Option v-for="item in cityList" :value="item.value" :label="item.label" :icon="item.icon" :key="item.value"></Option>
      </Select>
      {{model2}}
      <Select class="select" :placeholder="placeholder2" :filterable="filterable" v-model="model3" style="width:200px">
        <Option v-for="item in cityList" :value="item.value" :label="item.label" :icon="item.icon" :key="item.value"></Option>
      </Select>
      {{model3}}
      <Select class="select" :placeholder="placeholder"  :multiple="multiple" v-model="model4" style="width:200px">
        <Option v-for="item in cityList" :value="item.value" :label="item.label" :key="item.value"></Option>
      </Select>
      {{model4}}
    </div>
</template>


<script>
export default {
    data () {
        return {
            placeholder: '请选择',
            placeholder2: '搜索',
            filterable: true,
            multiple: true,
            cityList: [
                {
                    value: '1',
                    icon: require('../assets/analy.png'),
                    label: 'Demo1'
                },
                {
                    value: '2',
                    icon: require('../assets/analy.png'),
                    label: 'Demo2'
                },
                {
                    value: '3',
                    icon: require('../assets/analy.png'),
                    label: 'Demo3'
                },
                {
                    value: '4',
                    icon: require('../assets/analy.png'),
                    label: 'Demo4'
                },
                {
                    value: '5',
                    icon: require('../assets/analy.png'),
                    label: 'Demo5'
                },
                {
                    value: '6',
                    icon: require('../assets/analy.png'),
                    label: 'Demo6'
                }
            ],
            model1: '',
            model2:'',
            model3:'',
            model4:[]
        };
    },
    watch: {
    }
};
</script>

<style lang="less" scoped>
.select{
  vertical-align: top !important;
}
.select-main{
    background: rgba(0, 0, 0, 0.6);
    padding: 60px;
}
</style>
