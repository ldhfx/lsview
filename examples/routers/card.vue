<template>
    <div class="lsView-main">
        <card v-for="(t,i) in 3" :key="i" :title="title" :icon="icon" :state="i">
            <ul>
                <li>
                    <p class="title">时间</p>
                    <p class="value">2018-4-9 13:44</p>
                </li>
                <li>
                    <p class="title">地点</p>
                    <p class="value">这里是地点</p>
                </li>
            </ul>
        </card>
    </div>
</template>


<script>
export default {
    data () {
        return {
            title: '测试',
            icon: require('../assets/icon-fire.png'),
            state: 0
        };
    }
};
</script>

<style lang="less" scoped>
    @import '~@/styles/iViewlibrary.less';
    .lsView-main{
        background: rgba(0, 0, 0, 0.6);
        padding: 60px;
    }
    ul{
        width: 100%;
        height: 100%;
        li{
            list-style: none;
            width: 100%;
            height: 100%;
            padding: 5px 10px;
            p{
                display: inline-block;
                color:#fff;
                font-size: 12px;
                line-height: 20px;
                &.title{
                    width: 28%
                }
                &.value{
                    width: 70%;
                    text-align: right;
                }
            }
        }
    }
</style>
