<template>
  <div class="lsView-main-modal">
    <Button @click="modal1=true">modal第一种样式</Button>
    <Modal
      v-model="modal1"
      title="标题">
        <Input v-model="formItem.input"></Input>
        <Input v-model="formItem.textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
    </Modal>
  </div>
</template>
<script>
  export default {
      data () {
          return {
              modal1: false,
              formItem: {
                  input: '',
                  select: '',
                  radio: 'male',
                  checkbox: [],
                  switch: true,
                  date: '',
                  time: '',
                  slider: [20, 50],
                  textarea: ''
              }
          };
      },
      methods: {
      }
  };
</script>

<style lang="less" scoped>
.lsView-main-modal{
    background-color: rgba(0, 0, 0, 0.6);
    padding: 60px;
}
</style>

