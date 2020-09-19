<template>
  <div>
    <div class="title_total">视力数据概况</div>
    <el-row :gutter="20">
      <el-col :span="10">
        <div class="base_total">
          <div class="base_icon"><i class="el-icon-user"></i></div>
          <div class="base_con">
            <div ><span>{{actual}}</span><span> |</span> <span>{{inspect}}</span></div>
            <div class="base_inner"><span>实核人数</span><span> |</span> <span>应检人数</span></div>
          </div>
        </div>
      </el-col>
      <el-col :span="10">
        <div class="base_total"  style="background: #51b9ca">
            <div class="base_icon"><i class="el-icon-s-check"></i></div>
            <div class="base_con">
              <div ><span>{{bad}}</span><span> |</span> <span>{{badPercentage}}%</span></div>
              <div class="base_inner"><span>不良总人数</span><span> |</span> <span>不良率</span></div>
            </div>
          </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="10">
        <div ref="totalleft" style="width: 400px;height:300px; margin: 0 auto"></div>
      </el-col>
      <el-col :span="10">
        <div ref="totalRight" style="width: 400px;height:300px; margin: 0 auto"></div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
 import echarts from 'echarts'
 import axios from 'axios'
  export default {
    name: 'firstbase',
    created(){
      this.getBase()
    },
    data() {
      return {
        option: {},
        inspect: '',
        actual: '',
        notPercentage: '',
        bad:'',
        badPercentage: ''
      }
    },
    methods: {
      drawLine(name, value, title) {
        let that = this;
        var myChart = echarts.init(this.$refs.totalleft)
        if(name == '未筛查率') {
          var myChart = echarts.init(this.$refs.totalleft)
        }else if(name == '总不良率') {
          var myChart = echarts.init(this.$refs.totalRight)
        }
         this.option = {
                   backgroundColor:'#fff',
                   color:['#38a8da','#d4effa'],
                   title: {
                       text: title,
                       top:'3%',
                       left:'center',
                       textStyle:{
                           color: '#333',
                           fontStyle: 'normal',
                           fontWeight: 'normal',
                           fontFamily: 'sans-serif',
                           fontSize: 16,
                       }
                   },
                   series: [{
                       name: '来源',
                       type: 'pie',
                       radius: ['60%', '75%'],
                       avoidLabelOverlap: false,
                       hoverAnimation:false,
                       label: {
                           normal: {
                               show: false,
                               position: 'center',
                               textStyle: {
                                   fontSize: 16,
                                   fontWeight: 'bold'
                               },
                               formatter:'{b}\n{c}%'
                           }
                       },
                       data: [{
                               value: value,
                               name: name,
                               label:{
                                   normal:{
                                       show:true
                                   }
                               }
                            },
                           {
                               value: 100-value,
                               name: ''
                           }
                       ]
                   }]
              }
        myChart.setOption(this.option)
         myChart.on('click', function(param) {
           if(param.name =="未筛查率") {
             let routeUrl = that.$router.resolve({
               path: '/nocheckPersent'
              });
              window.open(routeUrl.href, '_blank')
           }else if(param.name == "总不良率") {
             let routeUrl = that.$router.resolve({
               path: '/allBadPersent'
              });
              window.open(routeUrl.href, '_blank')
           }
         })
      },
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
          this.drawLine('未筛查率', this.notPercentage, '')
          this.drawLine('总不良率', this.badPercentage, '')
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .title_total
    font-size: 20px;
    padding: 10px 10px 14px;
    font-weight: bold;
    border-bottom: 2px solid #707070;
    margin: 20px 0;
  .base_total
    width: 100%;
    background: #da4a2f
    display: flex
    align-items: center
    padding: 20px
    box-sizing: border-box;
    color: #fff
    font-size: 20px;
    .base_icon
      width: 20%
    .base_con
      flex: 1
      text-align: right
      .base_inner
        margin: 20px 0 5px
</style>
