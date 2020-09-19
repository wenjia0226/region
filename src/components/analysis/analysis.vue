<template>
  <div>
        <el-table
          :data="tableData"
          style="width: 100%;margin-bottom: 20px;"
           row-key="name"

          :header-cell-style="{background:'#eff4fb'}"
          border
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
         <el-table-column align="left" width="40">
           <template slot-scope="scope"></template>
         </el-table-column>
         <!-- <el-table-column label="操作" align="center">
           <template slot-scope="scope">
             <el-button size="mini" @click="expandRow(scope.row)">展开</el-button>
           </template>
         </el-table-column> -->
          <el-table-column align="center" prop="name"label="年级" ></el-table-column>
          <el-table-column align="center" prop="good"label="好视力" ></el-table-column>
          <el-table-column align="center" prop="mild"label="轻度不良" ></el-table-column>
          <el-table-column align="center" prop="moderate"label="中度不良" ></el-table-column>
          <el-table-column align="center" prop="serious"label="重度不良" ></el-table-column>
          <el-table-column align="center" prop="myopia"label="近视人数" ></el-table-column>
          <el-table-column align="center" prop="all"label="总计人数"></el-table-column>
          <el-table-column align="center" prop="myopiaRate"label="近视率" ></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button type="primary"  @click="handleReport(scope.row)">查看报表</el-button>
            </template>
          </el-table-column>
        </el-table>
      <!--    <report  :dialogVisible="dialogVisible" :grade="grade" @closepop="handleClosePop"></report> -->

        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="近视人数" name="number"></el-tab-pane>
          <el-tab-pane label="平均视力" name="average"></el-tab-pane>
        </el-tabs>
        <el-row>
          <!-- 实力分级统计 -->
          <el-col :span="20" :offset="2">
            <div ref="badTotal" style="width:100%;height:400px;"></div>
          </el-col>
        </el-row>
       <!-- 年级 -->
        <el-dialog
          :visible.sync="dialogVisible"
          width="80%"
          :before-close="handleBeforeClose"
         >
         <el-row>
           <el-col :span="2" >
              <el-button type="primary"  @click="handleConfirm">返回</el-button>
           </el-col>
           <el-col :span="2" :offset='18'>
             <el-button type="success" @click="getGradeReport" v-if="!classData.length">下载年级报表</el-button>
              <el-button type="success" @click="getGradeReport" v-if="classData.length">下载班级报表</el-button>
           </el-col>
         </el-row>
          <div class="inner_title" v-if="!classData.length">{{name}}账号{{grade}}年级视力统计({{nowYear}}{{changeSem}})</div>
          <div class="inner_title" v-if="classData.length">{{name}}账号{{gradeClass}}视力统计({{nowYear}}{{changeSem}})</div>
           <div class="second_title" v-if="!classData.length">单位:{{name}}账号{{grade}}年级视力统计({{nowYear}}{{changeSem}})</div>
          <div class="second_title"  v-if="classData.length">单位:{{name}}账号{{gradeClass}}视力统计({{nowYear}}{{changeSem}})</div>
          <div class="innerbox">
            <div class="inner_item" style="padding: 0 10px 0 0">应测：{{gradeSum}}人</div>
            <div class="inner_item">实测：{{gradeTested}}人</div>
            <div class="inner_item">视力不良：{{gradeBad}}人</div>
          </div>
          <h6 class="badpercent">不良率: {{gradePercentage}}</h6>
          <div class="detail_title"  v-if="!classData.length" >详细数据</div>
          <div class="detail_title"  v-if="classData.length" >数据总览</div>
          <div v-for="(item1, index1) in this.classList" :key="item1.id" v-if="!classData.length" >
            <div class="detail_title">{{grade}}年级{{item1.name}}</div>
            <el-table :data="item1.viewGradeReportVO" border style="width: 100%"
           :header-cell-style="{background:'#eff4fb'}">
              <el-table-column prop="name" > </el-table-column>
              <el-table-column prop="all" label="检查人数" width="180"> </el-table-column>
              <el-table-column  prop="good" label="好视力" width="180"></el-table-column>
              <el-table-column prop="mild" label="轻度不良"></el-table-column>
              <el-table-column prop="moderate"label="中度不良"></el-table-column>
              <el-table-column prop="serious" label="重度不良"> </el-table-column>
              <el-table-column prop="percentage"label="不良率"></el-table-column>
            </el-table>
           </div>
            <el-table :data="classData" border style="width: 100%"
               :header-cell-style="{background:'#eff4fb'}" v-if="classData.length">
               <el-table-column prop="name" > </el-table-column>
               <el-table-column prop="all" label="检查人数" width="180"> </el-table-column>
               <el-table-column  prop="good" label="好视力" width="180"></el-table-column>
               <el-table-column prop="mild" label="轻度不良"></el-table-column>
               <el-table-column prop="moderate"label="中度不良"></el-table-column>
               <el-table-column prop="serious" label="重度不良"> </el-table-column>
               <el-table-column prop="percentage"label="不良率"></el-table-column>
             </el-table>
             <div class="detail_title"  v-if="classData.length" >详细数据</div>
             <el-table  :data="studentList" border style="width: 100%"
                :header-cell-style="{background:'#eff4fb'}"  v-if="classData.length">
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="name" label="姓名"> </el-table-column>
                <el-table-column prop="gender" label="性别" width="180"> </el-table-column>
                <el-table-column  prop="visionLeftStr" label="左眼视力" width="180"></el-table-column>
                <el-table-column prop="visionRightStr" label="右眼视力"></el-table-column>
              </el-table>
        </el-dialog>
  </div>
</template>
<script>
 import echarts from 'echarts'
 import axios from 'axios'
  export default {
    name: 'analysis',
    data() {
      return {
        tableData: [],
        options: [],
        hasChildren: true,
        option: {},
        yData: [],
        dialogVisible: false,
        grade: '',
        year: '',
        semester: '',
        changeSem: '',
        user: '',
        gradeSum: 0,
        gradeTested: 0,
        gradeBad: 0,
        gradePercentage: '',
        classList: {},
        classId: '',
        classData: [],
        studentList: [],
        loading: true,
        gradeClass: '',
        gradeAvgList: [],
        activeName: 'number',
        expands:[]

      }
    },
    mounted() {
      this.year =  this.$store.state.year;
      this.user = this.$store.state.name;
      this.semester = this.$store.state.semester;
    },
    computed: {
      nowYear: function() {
        return this.$store.state.year
      },
      name: function() {
        return this.$store.state.name
      },
      nowSemester: function() {
        return this.$store.state.semester
      }
    },
    watch: {
      nowYear(val) {
        this.year = val
      },
      nowSemester(val) {
        this.semester = val
      }
    },

    methods: {
      // expandRow(row){
      //     if (this.expands.indexOf(row.name) < 0) {
      //         this.expands = [];
      //         this.expands.push(row.name);
      //     } else {
      //         this.expands = [];
      //     }
      // },
      getGradeReport() {
       this.loading = this.$loading({
            lock: true,
            text: '生成中,请耐心等候...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          let param= new FormData();
          if(this.grade && !this.classId) {
            param.append('year',this.nowYear);
            param.append('semester', this.nowSemester);
            param.append('type', 'grade');
            param.append('grade', this.grade);
          }else if(this.classId) {
            param.append('year',this.nowYear);
            param.append('semester', this.nowSemester);
            param.append('type', 'class');
            param.append('classId', this.classId);
          }
          axios({
            method: 'post',
            url: '/lightspace/school/pushReport',
            data: param
          }).then(this.handleGetCodeSucc.bind(this)).catch((err) => {console.log(err)})
       },
       handleGetCodeSucc(res) {
          // console.log(res)
         if(res.data.status == 200) {
           const downloadElement = document.createElement('a'); // 创建a标签
           downloadElement.href = 'https://www.guangliangkongjian.com/download/报表文件.docx';
           document.body.appendChild(downloadElement);
           downloadElement.click();
           document.body.removeChild(downloadElement);
           this.loading.close();
         }
       },
      handleClick(tab, event) {
          this.activeName = tab.name;
          if(this.activeName == 'number') {
            this.drawLine(this.yData)
          }else if(this.activeName == 'average') {
            this.drawAverage(this.gradeAvgList)
          }
      },
      handleBeforeClose() {
        this.dialogVisible = false;
        this.grade = '';
        this.classId = '';
        this.classData = [];
      },
      handleConfirm() {
        this.dialogVisible = false;
        this.grade = '';
        this.classId = '';
        this.classData = [];
      },
      handleReport(row) {
        if(row.classId) {
          this.classId = row.classId;
        }else {
          this.grade = row.name;
        }
        if(this.semester == 1) {
          this.changeSem = '上学期'
        }else if(this.semester == 2) {
          this.changeSem = '下学期'
        }else if(this.semester == 3) {
          this.changeSem ='寒假'
        }else if(this.semester == 0) {
          this.changeSem = '暑假'
        }
        this.getDetailList();
      },
      //加载转圈
      openFullScreen() {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0,0,0,0.7)'
        })
        return loading;
      },
      closeFullScreen(loading) {
        loading.close()
      },
      getDetailList(){
        let url ="";
        let param = new FormData();
        if(this.classId) {
          url ="/lightspace/school/ViewClassReport"
           param.append('classId', this.classId);
        }else {
          url = '/lightspace/school/ViewGradeReport'
          param.append('grade', this.grade);
        }
        param.append('year', this.year);
        param.append('semester', this.semester);
        this.openFullScreen();
        axios({
          method: 'post',
          data: param,
          url: url
        }).then(this.handlegetTotalSucc.bind(this)).catch((err) => {
          this.closeFullScreen(this.openFullScreen())
           console.log(err)
         })
      },
      handlegetTotalSucc(res) {
         this.closeFullScreen(this.openFullScreen())
        if(res.data.data) {
            this.dialogVisible = true;
            res? res = res.data.data: '';
            this.gradeSum = res.gradeSum;
            this.gradeTested = res.gradeTested;
            this.gradeBad = res.gradeBad;
            this.gradePercentage = res.gradePercentage;
            if(this.classId) {
              this.classData = res.viewGradeReport
              this.studentList = res.studentList
              this.gradeClass = res.name
              this.studentList.forEach((item, index) => {
                if(item.gender == 1) {
                  item.gender = '女'
                }else {
                  item.gender = '男'
                }
              })
            }else {
              this.classList = res.classList
            }
          }else {
            this.$message.error('暂无数据')
          }
      },
       // liebiao
      getDataList(year, semester) {
        let param = new URLSearchParams();
          param.append('year', year);
          param.append('semester', semester);
          this.openFullScreen();
          axios({
              method: 'post',
              url: '/lightspace/school/recordSurvey',
              data: param,
          }).then(this.handleGetDataListSucc.bind(this)).catch((err) => {
             console.log(err)
               this.closeFullScreen(this.openFullScreen())
           })
      },
      handleGetDataListSucc(res) {
         this.closeFullScreen(this.openFullScreen())
        if(res.data.data) {
          this.tableData = res.data.data.recordSurvey;
          this.yData = res.data.data.gradeMyopiaList;
          this.gradeAvgList =res.data.data.gradeAvgList;
          // console.log(this.gradeAvgList)
          this.drawLine(this.yData)
        }else {
          this.$message.error('暂无数据')
          this.tableData = [];
          this.yData = [];
          this.drawLine(this.yData)
        }

      },
      // 近视人数
      drawLine(yData) {
        var myChart = echarts.init(this.$refs.badTotal);
          this.option ={
                    color: '#568cd3',
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

                          interval: 300,
                          show: true,
                          axisLabel: {
                             formatter: '{value}'
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
                      itemStyle: {
                        normal: {
                          label: {
                            type: 'value',
                            show: true, //开启显示
                            position: 'top', //在上方显示
                            formatter: '{c}',
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
      //平均视力
      drawAverage(yData) {
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
              interval: 0.2,
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
                color: '#568cd3',
                smooth: true,
                data: yData
            }
            ]
          }
          myChart.setOption(this.option)
      }

    }
  }
</script>
<style lang="stylus" scoped >
  .bgbottom
     bottom: 1px solid #eee !important
    .el-tag
      margin: 7px
    .secondItem
      heihgt: 30px
      line-height: 1.875rem
  .title_total
    font-size: 20px;
    padding: 10px 10px 14px;
    font-weight: bold;
    border-bottom: 2px solid #707070;
    margin: 20px 0;
.inner_title
   font-size: 20px;
   font-weight: bold;
   text-align: center;
   color: #000;
   margin: 10px 0
  .second_title
    font-size: 16px
  .innerbox
    display:flex
    margin: 20px 0
    font-weight: bold
    .inner_item
       padding: 0 10px
       box-sizing:border-box
  .badpercent
     font-size: 14px
     margin: 10px 0
  .detail_title
    font-size: 20px
    font-weight: bold
    margin: 20px 0
  .el-table .warning-row {
      background: oldlace;
    }

  .el-table .success-row {
    background: #f0f9eb;
  }
 // /deep/.el-icon-arrow-right:before {
 //   // 这是展开图标
 //   content: "\e722";
 //   font-size: 14px;
 // }
/deep/.el-table__expand-icon--expanded {
  transform: rotate(0deg)
}
 /deep/ .el-icon-arrow-right:before {
     content: "\e723";
     font-size: 14px;
 }



</style>
