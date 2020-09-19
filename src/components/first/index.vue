<template>
  <div>
    <title-header  :common="common"></title-header>
    <first-base></first-base>
    <top5></top5>
    <bad-total></bad-total> <!-- 不良率统计 -->
    <level-record></level-record>   <!-- 视力分级 -->
    <trend></trend>
  </div>
</template>
<script>
  import titleHeader from '../../common/header'
  import firstBase   from './base'
  import top5 from './top5'
  import badTotal from './badTotal'
  import levelRecord from './levelRecord'
  import trend from './trend'
  import axios from 'axios'
  export default {
    components:{
      titleHeader,
      firstBase,
      badTotal,
      levelRecord,
      trend,
      top5
    },
    data() {
      return {
         common: '首页',
         inspect: '',
         actual: '',
         notPercentage: '',
         bad:'',
         badPercentage: '',
      }
    },
    methods: {
      getBase() {
        let param = new FormData();
       axios({
           method: 'post',
           url: '/lightspace/school/survey'
       }).then(this.handleGetBaseSucc.bind(this)).catch((err) => {
          console.log(err)
        })
      },
      handleGetBaseSucc(res) {
        if(res.data.status == 200) {
          res.data.data? res= res.data.data: ''
          this.inspect	= res.inspect;
          this.actual	= res.actual;
          this.bad = res.bad;
          this.badPercentage = res.badPercentage;
          this.notPercentage = res.notPercentage;
        }
      }
    }
  }
</script>

<style>
</style>
