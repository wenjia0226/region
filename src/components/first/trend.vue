<template>
  <div>
     <div class="title_total">视力发展趋势对比图</div>
     <el-row>
       <el-col :span="20">
         <div ref="badTotal" style="width:100%;height:400px; margin: 0 auto"></div>
       </el-col>
     </el-row>
  </div>
</template>

<script>
 import echarts from 'echarts'
 import axios from 'axios'
  export default {
    name: 'trend',
    created(){
      this.getBadTotal()
    },
    data() {
      return {
        option: {},
        yData: []
      }
    },
    mounted() {
      this.drawLine()
    },
    methods: {
      drawLine(yData) {
        var myChart = echarts.init(this.$refs.badTotal);
          this.option ={
            tooltip: {
              trigger: "axis",
              formatter: function(params) {
                //return (
                  // params[0].name +
                  // "<br/>" +
                  // params[0].seriesName +
                  // "：" +
                  // params[0].data  +
                  // "<br/>" +
                  // params[1].seriesName +
                  // "：" +
                  // params[1].data
                //);
              }
            },
            // color: ['#76aafa', '#6cc280'],
            legend:{
                data:['本校', '全国'],
                selectedMode:false
            },
            //x轴
            xAxis:{
              boundaryGap: false,
              data: ["一年级", "二年级", "三年级", "四年级", "五年级", '六年级']
            },

            //y轴没有显式设置，根据值自动生成y轴
            yAxis:{
              min: 0.1,
              max: 2.0,
              interval: 0.1,
              right: 10,
              axisLine:{
                  show:false,
                  fontWeight: 'bolder'
              },
              axisTick:{
                  show:false
              },
              splitLine: {
                show: true,
                lineStyle: {
                    type: 'dashed',
                    color:'#113d5e'
                }
            },
            },
            //数据-data是最终要显示的数据
            series:[{
                name:'本校',
                type:'line',
                color: '#5e86d1',
                smooth: true,
                data: yData
            },
            {
                name:'全国',
                type:'line',
                color: '#5bbf5d',
                smooth:true,
                data:[1.0,0.8, 0.6, 0.5, 0.5, 0.4]
            }
            ]
          }
          myChart.setOption(this.option)
      },
      getBadTotal() {
        let param = new FormData();
        axios({
          method: 'post',
          url: '/lightspace/school/brokenLine'
        }).then(this.handlegetBadTotalSucc.bind(this)).catch((err) => {
           console.log(err)
         })
      },
      handlegetBadTotalSucc(res) {
       // console.log(res)
        if(res.data.status == 200) {
          this.yData = res.data.data;
          this.drawLine(this.yData)
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
</style>
