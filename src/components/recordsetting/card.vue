<template>
  <div>

      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="裸眼档案" name="luo"></el-tab-pane>
        <el-tab-pane label="戴镜视力" name="wear"></el-tab-pane>
        <el-tab-pane label="基础信息" name="base"></el-tab-pane>
        <el-tab-pane label="眼健康档案" name="eyeHealth"></el-tab-pane>
      </el-tabs>
      <!-- 裸眼列表 -->
    <el-table  :header-cell-style="{background:'#eef1f6',color:'#606266'}" :data="this.content"
      border v-if="this.activeName == 'luo'&& (!this.showHistory)"  stripe style="width: 100%">
        <el-table-column label="学校" prop="schoolName"></el-table-column>
        <el-table-column label="班级" prop="className"></el-table-column>
        <el-table-column label="学生姓名" >
          <template slot-scope = 'scope'>
            <div class="student_name"  @click = "showStudentInfo('luo',scope.row.studentId)">{{scope.row.studentName}}</div>
          </template>
        </el-table-column>
        <el-table-column label="右眼裸眼视力" prop="visionRight"></el-table-column>
        <el-table-column label="左眼裸眼视力" prop="visionLeft"></el-table-column>
        <el-table-column label="最近一次检测时间" prop="lastTime"></el-table-column>
    </el-table>
    <el-pagination
        background
         v-if="this.activeName == 'luo'&& (!this.showHistory)"
        :current-page="this.number"
        @current-change="handleCurrentChange"
        layout="prev, pager, next"
        :page-size ="this.size"
        :total="this.totalElements">
      </el-pagination>
   <!-- 戴镜列表 -->
    <el-table :data="this.content" :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      border v-show="this.activeName == 'wear'&& !this.showWearHistory"  stripe style="width: 100%">
          <el-table-column label="学校" prop="schoolName"></el-table-column>
          <el-table-column label="班级" prop="className"></el-table-column>
         <el-table-column label="学生姓名" >
           <template slot-scope ='scope'>
             <div class="student_name"  @click ="showStudentInfo( 'wear',scope.row.studentId)">{{scope.row.studentName}}</div>
           </template>
         </el-table-column>
          <el-table-column label="右眼戴镜视力" prop="visionRight"></el-table-column>
          <el-table-column label="左眼戴镜视力" prop="visionLeft"></el-table-column>
          <el-table-column label="最近一次检测时间" prop="lastTime"></el-table-column>
    </el-table>
    <el-pagination
       background
       v-show="this.activeName == 'wear'&& !this.showWearHistory"
       :current-page="this.number"
       @current-change="handleCurrentChange"
       layout="prev, pager, next"
       :page-size ="this.size"
       :total="this.totalElements">
     </el-pagination>
   <!-- 基础信息 -->
     <el-table :data="this.content" :header-cell-style="{background:'#eef1f6',color:'#606266'}"
       border v-show="this.activeName == 'base' "  stripe style="width: 100%">
          <el-table-column label="学校" prop="schoolName"></el-table-column>
          <el-table-column label="班级" prop="classesName"></el-table-column>
          <el-table-column label="姓名" prop="name"></el-table-column>
           <el-table-column label="身高" prop="height"></el-table-column>
           <el-table-column label="坐高" prop="sittingHeight"></el-table-column>
           <el-table-column label="体重" prop="weight"></el-table-column>
     </el-table>
     <el-pagination
        background
        v-show="this.activeName == 'base'"
        :current-page="this.number"
        @current-change="handleCurrentChange"
        layout="prev, pager, next"
        :page-size ="this.size"
        :total="this.totalElements">
      </el-pagination>
      <!--眼健康档案 -->
        <el-table :data="this.content" :header-cell-style="{background:'#eef1f6',color:'#606266'}"
          border   v-show="this.activeName == 'eyeHealth' && !this.showEyeHealth "  stripe style="width: 100%">
             <el-table-column label="学校" prop="schoolName"></el-table-column>
             <el-table-column label="班级" prop="className"></el-table-column>
            <el-table-column label="学生姓名" >
              <template slot-scope ='scope'>
                <div class="student_name"  @click ="showStudentInfo( 'eyeHealth',scope.row.id)">{{scope.row.name}}</div>
              </template>
            </el-table-column>
             <el-table-column label="上传时间" prop="time"></el-table-column>
        </el-table>
        <el-pagination
           background
           v-show="this.activeName == 'eyeHealth' && !this.showEyeHealth"
           :current-page="this.number"
           @current-change="handleCurrentChange"
           layout="prev, pager, next"
           :page-size ="this.size"
           :total="this.totalElements">
         </el-pagination>
   <!-- 裸眼历史记录 -->
    <el-table :data="this.stucontent" v-show="this.showHistory">
      <el-table-column label="班级" prop="className"></el-table-column>
      <el-table-column label="学生姓名" prop="studentName"></el-table-column>
      <el-table-column label="检测时间" prop="lastTime"></el-table-column>
      <el-table-column label="右眼裸眼视力" prop="visionRight"></el-table-column>
      <el-table-column label="左眼裸眼视力" prop="visionLeft"></el-table-column>
     <el-table-column label="操作">
       <template slot-scope="scope">
           <el-button type="warning" size="middle" icon="el-icon-delete" @click="hanldeRemoveRecod('luo',scope.row)"  ></el-button>
       </template>
     </el-table-column>
    </el-table>
    <el-pagination
      background
      v-show="this.showHistory"
      :current-page="this.stunumber"
      @current-change="handleHistoryCurrentChange"
      layout="prev, pager, next"
      :page-size ="this.stusize"
      :total="this.stutotalElements">
    </el-pagination>
    <!-- 戴镜历史记录 -->
    <el-table :data="this.wearstucontent" v-show="this.showWearHistory">
      <el-table-column label="班级" prop="className"></el-table-column>
      <el-table-column label="学生姓名" prop="studentName"></el-table-column>
      <el-table-column label="检测时间" prop="lastTime"></el-table-column>
      <el-table-column label="右眼戴镜视力" prop="visionRight"></el-table-column>
      <el-table-column label="左眼戴镜视力" prop="visionLeft"></el-table-column>
     <el-table-column label="操作">
         <template slot-scope="scope">
             <el-button type="warning" size="middle" icon="el-icon-delete" @click="hanldeRemoveRecod('wear',scope.row)"  ></el-button>
         </template>
     </el-table-column>
    </el-table>
    <el-pagination
      background
      v-show="this.showWearHistory"
      :current-page="this.wearstunumber"
      @current-change="handleWearHistoryCurrentChange"
      layout="prev, pager, next"
      :page-size ="this.stusize"
      :total="this.wearstutotalElements">
    </el-pagination>
    <!-- 眼健康档案 -->
   <el-row style="margin: 10px auto" v-show="this.showEyeHealth">
     <el-col :span="24">
        <div ref="left" style="width: 100%;height: 400px;margin: 0 auto"></div>
      </el-col>
    </el-row>
    <el-row v-show="this.showEyeHealth">
     <el-col :span="24" style="font-size: 40px;padding: 20px;margin: 20rpx;text-align: center;">
       学生视觉检查报告单
     </el-col>
   </el-row>
    <el-row v-show="this.showEyeHealth">
      <el-col :span="16" :offset="4">
        <table cellpadding="0" cellspacing="0" class="report">
          <tr>
            <th colspan="2">姓名: {{studentWord.name}}</th>
            <th colspan="1">性别: {{studentWord.gender}}</th>
            <th colspan="2">生日:{{studentWord.birthday}}</th>
            <th colspan="3">学校: {{studentWord.school}}</th>
            <th colspan="2">电话:{{studentWord.phone}}</th>
          </tr>
          <tr>
            <td rowspan="3">屈光度</td>
            <td>眼别</td>
            <td>远裸视</td>
            <td>近裸视</td>
            <td>球镜</td>
            <td>柱镜</td>
            <td>轴位</td>
            <td>矫正视力</td>
            <td>瞳距</td>
            <td>主导眼</td>
          </tr>
          <tr>
            <td>右眼</td>
            <td>{{studentWord.farRight}}</td>
            <td>{{studentWord.nearRight}}</td>
            <td>{{studentWord.sphRight}}</td>
            <td>{{studentWord.cytRight}}</td>
            <td>{{studentWord.axisRight}}</td>
            <td>{{studentWord.correctRight}}</td>
            <td>{{studentWord.ipdRight}}</td>
            <td>{{studentWord.leadingRight}}</td>
          </tr>
          <tr>
            <td>左眼</td>
            <td>{{studentWord.farLeft}}</td>
            <td>{{studentWord.nearLeft}}</td>
            <td>{{studentWord.sphLeft}}</td>
            <td>{{studentWord.cytLeft}}</td>
            <td>{{studentWord.axisLeft}}</td>
            <td>{{studentWord.correctLeft}}</td>
            <td>{{studentWord.ipdLeft}}</td>
            <td>{{studentWord.leadingLeft}}</td>
          </tr>
          <tr>
            <td rowspan="5">视功能检查</td>
            <td colspan="5">眼球运动:{{studentWord.motion}}</td>
            <td colspan="4">立体检查:{{studentWord.stereopsis}}</td>
          </tr>
          <tr>
            <td colspan="5">遮盖眼位:{{studentWord.cover}}</td>
            <td colspan="4">Worth-4点:{{studentWord.worth}}</td>
          </tr>
          <tr>
            <td colspan="5">集合近点:{{studentWord.assembly}}</td>
            <td rowspan="3" >调节灵敏度</td>
            <td colspan="3">右眼:{{studentWord.splRight}}</td>
          </tr>
          <tr>
            <td colspan="5" rowspan="2">色觉检查:{{studentWord.colourVision}}</td>
            <!-- <td >调节灵敏度</td> -->
             <td colspan="3">左眼:{{studentWord.splLeft}}</td>
          </tr>
          <tr>
           <!-- <td colspan="5">色觉检查</td> -->
           <!-- <td >调节灵敏度</td> -->
            <td colspan="3">双眼:{{studentWord.splBinoculus}}</td>
          </tr>
          <!-- 生物测量检查 -->
          <tr>
            <td rowspan="3">生物测量检查</td>
            <td>眼别</td>
            <td colspan="2">水平曲率值</td>
            <td colspan="2">垂直曲率值</td>
            <td colspan="2">眼轴长度</td>
            <td >前房深度</td>
            <td >晶体厚度</td>
          </tr>
          <tr>
            <td>右眼</td>
            <td colspan="2">{{studentWord.levelRight}}</td>
            <td colspan="2">{{studentWord.verticalRight}}</td>
            <td colspan="2">{{studentWord.axialLengthRight}}</td>
            <td >{{studentWord.acdRight}}</td>
            <td >{{studentWord.ltRight}}</td>
          </tr>
          <tr>
            <td>左眼</td>
            <td colspan="2">{{studentWord.levelLeft}}</td>
            <td colspan="2">{{studentWord.verticalLeft}}</td>
            <td colspan="2">{{studentWord.axialLengthLeft}}</td>
            <td >{{studentWord.acdLeft}}</td>
            <td >{{studentWord.ltLeft}}</td>
          </tr>
          <!-- 眼部健康检查 -->
          <tr  style="text-align: left;">
            <td rowspan="2">眼部健康检查</td>
            <td colspan="9">裂隙灯检查:{{studentWord.slitLamp}}</td>
          </tr>
          <tr>
            <td colspan="9">眼底照相检查:{{studentWord.retCam}}</td>
          </tr>
          <!-- 身体情况 -->
          <tr align="left">
            <td rowspan="2">身体情况</td>
            <td colspan="9">身高(cm): {{studentWord.height}}</td>
          </tr>
          <tr>
            <td colspan="9">体重(kg):{{studentWord.weight}}</td>
          </tr>
         <!-- 处理建议 -->
         <tr>
           <td >处理建议</td>
           <td colspan="9">{{studentWord.suggest}}</td>
         </tr>

        </table>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import axios from 'axios'
  import echarts from 'echarts'
  export default {
    name: 'card',
    created() {
      this.getInfo('', '');
    },
     data() {
      return {
        type: '',
        id: '',
        name: '',
        url: '/lightspace/school/screeningList',
        activeName: 'luo',
        content: [],
        pageSize: 10,
        size: 5,
        total:0,
        totalElements: 0,
        number: 1,
        page: 1,
        studentId: '',
        stucontent: [],
        wearstucontent: [],
        stupageSize: 10,
        stusize: 5,
        stutotal:0,
        stutotalElements: 0,
        basepageSize: 10,
        basesize: 5,
        basetotal:0,
        basetotalElements: 0,
        basenumber: 1,
        basepage: 1,
        stunumber: 1,
        stupage: 1,
        showHistory: false,
        showWearHistory: false,
        showEyeHealth: false,
        wearstucontent: [],
        wearstupageSize: 10,
        wearstusize: 5,
        wearstutotal:0,
        wearstutotalElements: 0,
        wearstunumber: 1,
        wearstupage: 1,
        delType: '',
        showSearch: true, // 展示搜索框
        eyeHealthContent: [],
        leftLuoX: [],
        leftLuoY: [],
        rightLuoX: [],
        rightLuoY: [],
        studentWord: [],
      }
    },
    methods: {
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
      //切换裸眼档案
    handleClick(tab, event) {
        this.activeName = tab.name;
        this.showHistory = false;
        this.showWearHistory = false;
        this.showEyeHealth = false;
        this.stupage = 1;
        this.wearstupage = 1;
        if(tab.name == 'luo') {
          this.url = '/lightspace/school/screeningList'
        }else if(tab.name == 'wear') {
          this.url =  '/lightspace/school/screeningWearList'
        }else if(tab.name == 'base') {
          this.url = '/lightspace/school/getStudent'
        }else if(tab.name == 'eyeHealth') {
          this.url="/lightspace/school/getAllWord"
        }
        this.page = 1;
        this.getDataList();
        this.$emit('showSearch', true)
    },
     //分页
    handleCurrentChange(val) {
      this.page = val;
      this.getDataList();
    },
    //历史裸眼分页
    handleHistoryCurrentChange(val) {
      this.stupage = val;
      this.getSudentHistory();
    },
    //历史戴镜分页
    handleWearHistoryCurrentChange(val) {
      this.wearstupage = val;
      this.getWearSudentHistory();
    },
    //进入判断类型
    getInfo(classId, name) {
      if(classId && !name) {  // 如果只有班级
        this.type = 'class';
        this.id = classId;
      }else if(classId && name) { // 如果班级和姓名都存在
        this.type ="student";
        this.name = name;
        // this.id = '';
      }else if (!this.classId && name) {
        this.type ="student";
        this.name = name;
        this.id = ''
      } else {   //如果都不存在
        this.type = '',
        this.id = ''
      }
      this.page = 1;
      this.getDataList()
    },
    // 获取列表
    getDataList() {
        this.openFullScreen();
        let param = new FormData();
        param.append('type', this.type);
        param.append('id', this.id);
        param.append('page', this.page);
        param.append('name', this.name);
        axios({
          method: 'post',
          data: param,
          url: this.url
        }).then(this.handleGetDataListSucc.bind(this)).catch((err) => {console.log(err)})
    },
    handleGetDataListSucc(res) {
      //console.log(res)
		 this.closeFullScreen(this.openFullScreen())
     if(res.data.status == 200) {
       res ? res= res.data.data: '';
       this.content = res.content;
       this.totalElements = res.totalElements;
       this.size = res.size;
       this.number = res.number + 1;
       if(this.content.length) {
         this.content.forEach((item) => {
           item.lastTime = item.date + '\xa0\xa0' + item.time
         })
       }
     }else {
       this.$message.error(res.data.msg)
       this.content = [];
     }
    },
    //点击进入学生历史
    showStudentInfo(type, studentId) {
       this.showSearch = false;
      this.$emit('showSearch', this.showSearch)
      if(type == 'luo') {
        this.showHistory = true;
        this.studentId  = studentId;
        this.getSudentHistory();
      }else if(type == 'wear') {
        this.showWearHistory = true;
        this.studentId  = studentId;
        this.getWearSudentHistory();
      }else if(type == 'eyeHealth') {
        this.showEyeHealth = true;
        this.studentId  = studentId;
        this.getEyeHealth()
      }
   },
   getEyeHealth(studentId) {
     let param = new FormData();
     param.append('id', this.studentId);
     axios({
       method: 'post',
       data: param,
       url: '/lightspace/school/getStudentWord'
     }).then(this.handleGetPersonEyeHealthSucc.bind(this)).catch((err) => {console.log(err)})
   },
   handleGetPersonEyeHealthSucc(res) {
      // console.log(res)
      res? res = res.data.data: '';
       if(res.studnetWord !== null) {
         this.studentWord = res.studnetWord;
       }
       this.leftLuoX = res.visionLeft.xDataList;
       this.leftLuoY = res.visionLeft.yDataList;
       this.rightLuoX = res.visionRight.xDataList;
       this.rightLuoY = res.visionRight.yDataList;
       this.drawLine();
   },
   drawLine() {
     let myChart = echarts.init(this.$refs.left);
      this.option = {
       title: {
            text: '裸眼视力分析',
            subtext: '',
            left: 'center'
        },
       legend: {
             orient: 'vertical',
              data: ['左眼裸眼视力', '右眼裸眼视力'],
              left: 'left',
              y: 'top',
              top:'5%',
              right: '15%'
            },
      grid: {                   // 折线位置
              top:'8%',
              right: '10%',
            },
       xAxis: {
           type: 'category',
           symbol: 'none',
           boundaryGap: true,
           data: this.leftLuoX
       },
       yAxis: {
           type: 'value',
           min:0,
           max:2,
           splitNumber:10
       },
       series: [{
          name: '左眼裸眼视力',
           data: this.leftLuoY,
           type: 'line',
           smooth: true,
            color: 'blue'
       },
       {
           name: '右眼裸眼视力',
           data: this.rightLuoY,
           type: 'line',
            smooth: true,
           color: 'red'
       }]
     }
     myChart.setOption(this.option)
    },
    getWearSudentHistory() {
      this.openFullScreen()
     let param = new FormData();
     param.append('page', this.wearstupage);
     param.append('studentId', this.studentId);
     axios({
       method: 'post',
       data: param,
       url: '/lightspace/school/screeningWearByStudentId'
     }).then(this.handleGetWearHisSucc.bind(this)).catch((err) => {console.log(err)})
   },
    handleGetWearHisSucc(res) {
       this.closeFullScreen(this.openFullScreen())
       if(res.data.status == 200) {
         res ? res= res.data.data: '';
         this.wearstucontent = res.content;
         this.wearstutotalElements = res.totalElements;
         this.wearstusize = res.size;
         this.wearstunumber = res.number + 1;
         if(this.wearstucontent.length) {
           this.wearstucontent.forEach((item) => {
             item.lastTime = item.date + '\xa0\xa0' + item.time
           })
         }
     }else if(res.data.status == 10211) {
       this.wearstucontent = [];
       this.$message.error(res.data.msg)
     }
   },
    getSudentHistory() {
     this.openFullScreen()
     let param = new FormData();
         param.append('page', this.stupage);
         param.append('studentId', this.studentId);
         axios({
           method: 'post',
           data: param,
           url: '/lightspace/school/screeningByStudentId'
         }).then(this.handleGetStudentRecordListSucc.bind(this)).catch((err) => {console.log(err)})
   },
    handleGetStudentRecordListSucc(res) {
      //console.log(res)
      this.closeFullScreen(this.openFullScreen())
      if(res.data.status == 200) {
        res ? res= res.data.data: '';
        this.stucontent = res.content;
        this.stutotalElements = res.totalElements;
        this.stusize = res.size;
        this.stunumber = res.number + 1;
        if(this.stucontent.length) {
          this.stucontent.forEach((item) => {
            item.lastTime = item.date + '\xa0\xa0' + item.time
          })
        }
      }else {
        this.$message.error(res.data.msg);
        this.stucontent = [];
      }
    },
    async  hanldeRemoveRecod(type,row) {
      let deleurl = "";
      this.delType = type;
      let id = row.id;
      if(type == 'luo') {
        deleurl = '/lightspace/school/deleteScreening'
      }else if(type == 'wear') {
        deleurl = '/lightspace/school/deleteScreeningWear'
      }
       const confirmResult = await this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
           confirmButtonText: '确定',
           cancelButtonText: '取消',
           type: 'warning'
       }).catch(err => err)
       if(confirmResult !== 'confirm') {
           return this.$message.info('已经取消删除')
       }
           let param = new FormData();
           param.append('id', id);
           axios({
               method: 'post',
               url: deleurl,
               data: param
           }).then(this.handleDeleteRecordSucc.bind(this)).catch((err) => {console.log(err)})
    },
    handleDeleteRecordSucc(res) {
     console.log(res)
      if(res.data.status == 200) {
         this.$message.success('删除成功')
         if(this.delType == 'luo') {
           this.getSudentHistory()
         }else if(this.delType == 'wear') {
           this.getWearSudentHistory()
         }
       }else {
         this.$message.error(res.data.msg);
         this.$router.push('/login');
       }
    }
  }
}
</script>

<style lang="stylus" scoped>
  .student_name
    color: blue
    cursor:pointer
 .report
    margin: 20px 0
    th, td
        padding: 30px;
        text-align:center;
        border:1px solid #ccc;
        text-align: left;
  tr:nth-child(2n+1) td{text-align: left;}
</style>
