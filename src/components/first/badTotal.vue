<template>
  <div>
     <div class="title_total">不良率统计</div>
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
    name: 'firstbase',
    created(){
      this.getBadTotal()
    },
    data() {
      return {
        option: {},
        yData: []
      }
    },
    methods: {
      drawLine(yData) {
        var myChart = echarts.init(this.$refs.badTotal);
          this.option ={
                    color: '#4665b0',
                    tooltip:{
                        trigger:'axis',
                        axisPointer: {
                          type: 'shadow'
                        }
                    },
                   legend: {
                            data:['本校'],
                            selectedMode:false
                    },
                    // x轴
                    xAxis: {
                        data: ["一年级", "二年级", "三年级", "四年级", "五年级", '六年级']
                    },
                    yAxis:[
                       {
                          type: 'value',
                          min: 0,
                          max: 100,
                          interval: 20,
                          show: true,
                          axisLabel: {
                             formatter: '{value} %'
                         }
                          ,
                      }
                     ],
                    // 数据
                    series: [{
                      name: '本校',
                      type: 'bar',
                      data: yData,
                      barWidth : 30,//柱图宽度
                      // markPoint:{
                      //   data:[
                      //       {type:'max',name:'最大值'},
                      //       {type:'min',name:'最小值'}
                      //   ]
                      // },
                      markLine:{
                       data: [{yAxis: 38}],
                        itemStyle: {
                          normal: {
                            borderWidth: 1,
                            lineStyle: {
                              type: 'dash',
                              color: 'red',
                              width: 2
                            },
                            label: {
                              formatter: '全国小学近视率38%',
                              textStyle: {
                                fontSize: 12,
                                fontWeight: 'bolder'
                              }
                            }
                          }
                        }
                      },
                      itemStyle: {
                        normal: {
                          label: {
                            type: 'value',
                            show: true, //开启显示
                            position: 'top', //在上方显示
                            formatter: '{c} %',
                            textStyle: { //数值样式
                              fontSize: 14,
                              color: '#4665b0'
                            }
                          }
                        },

                      },
                    }
                  ]
          }
          myChart.setOption(this.option)
      },
      getBadTotal() {
        let param = new FormData();
        axios({
          method: 'post',
          url: '/lightspace/school/badPercentage'
        }).then(this.handlegetBadTotalSucc.bind(this)).catch((err) => {
           console.log(err)
         })
      },
      handlegetBadTotalSucc(res) {
        //console.log(res)
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
