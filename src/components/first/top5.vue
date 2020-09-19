<template>
  <div>
    <div class="title_total">视力预警提醒</div>
    <el-card>
      <div class="title_name">不良率预警班级排行榜</div>
      <div class="more" @click="showDetail">更多详情</div>
      <div class="box titlebox">
        <div class="className">班级</div>
        <div class="className">视力不良人数</div>
        <div class="className">不良率</div>
      </div>
      <div class="box" v-for="(item, index) in this.tableList">
        <div class="className">{{item.name}}</div>
        <div class="className">{{item.bad}}</div>
        <div class="className">{{item.percentage}} %</div>
      </div>
    </el-card>
  </div>

</template>

<script>
  import axios from 'axios'
   export default {
     name: 'top5',
     created() {
       this.getTop5()
     },
     data() {
       return {
         tableList: []
       }
     },
     methods: {
       getTop5() {
       let param = new FormData();
       axios({
         method: 'post',
         url: '/lightspace/school/top5'
       }).then(this.handlegetTop5Succ.bind(this)).catch((err) => {
          console.log(err)
        })
      },
      handlegetTop5Succ(res) {
       // console.log(res)
        if(res.data.status == 200) {
          this.tableList = res.data.data;
        }
      },
      showDetail() {
        let routeUrl = this.$router.resolve({
          path: '/top5MoreDetail',
          query: {
            type: 'all'
          }
         });
        window.open(routeUrl .href, '_blank');
      }
    }
  }
</script>
<style lang="stylus" scoped>
  @import '../../assets/style/common/varibles.styl'
  .title_total
    font-size: 20px;
    padding: 10px 10px 14px
    font-weight: bold;
    border-bottom: 2px solid #707070
    margin: 20px 0;
  .title_name
     font-size: 18px
     padding: 6px 0 16px
     font-weight: bold
  .more
     text-align: right
     margin: 10px
     font-size: 14px
     font-weight: bold
     cursor: pointer
  .box
     display: flex
     font-size: 1px
     border-bottom: 1px solid #e0dedf
     height: 30px
     line-height: 30px
     text-align: center
  .titlebox
     background: $bgColor
     color: #fff
     font-size: 16px
     font-weight: bold
     padding: 5px
    .className
      width: 33%;
</style>
