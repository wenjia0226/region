<template>
  <div>
     <title-header :common="common" ></title-header>
     <el-card>
       <el-row >
         <el-col :span="6" ><current-school></current-school></el-col>
         <el-col :span="6" :offset="1">
           <year></year>
         </el-col>
         <el-col :span="6" :offset="1">
           <semester ></semester>
         </el-col>
         <el-col :span="2" v-show="!show">
           <el-button type="success" @click="getSchoolReport"> 下载学校报表</el-button>
         </el-col>
       </el-row>
       <analasis ref="analysis"></analasis>
        <level ref="level"></level>
     </el-card>
  </div>
</template>
<script>
  import titleHeader from '../../common/header'
  import  currentSchool from './currentSchool'
  import year from '../../common/year'
  import  semester from'../../common/semester'
  import  analasis from './analysis'
  import level from './level'
  import  axios from 'axios'
  export default {
    created() {
      this.schoolName = window.sessionStorage.getItem('schoolName');
      this.regionName = window.sessionStorage.getItem('regionName');
      this.computedNow()
    },
    mounted() {
      this.createdGetInfo();
      this.getLevelInfo();
    },
    components:{
      titleHeader,
      currentSchool,
      analasis,
      year,
      semester,
      level
    },
    data() {
      return {
        common: '数据概览',
        year: '2019 - 2020',
        semester: 0,
        curSemester: 1,
        curYear: '2020 - 2021',
        regionName: '',
        schoolName: '',
        show: false,
      }
    },
   methods: {
     computedNow() {
       if(this.schoolName == this.regionName) {
         this.show = true
       }
     },
      createdGetInfo() {
        this.$refs.analysis.getDataList(this.curYear, this.curSemester )
      },
      getLevelInfo() {
        this.$refs.level.getBadTotal(this.curYear,  this.curSemester )
      },
      getSchoolReport() {
        this.loading = this.$loading({
           lock: true,
           text: '生成中,请耐心等候...',
           spinner: 'el-icon-loading',
           background: 'rgba(0, 0, 0, 0.7)'
         });
         let param= new FormData();
         param.append('year',this.curYear);
         param.append('semester', this.curSemester);
         param.append('type', 'school');
         axios({
           method: 'post',
           url: '/lightspace/school/pushReport',
           data: param
         }).then(this.handleGetCodeSucc.bind(this)).catch((err) => {console.log(err)})
      },
      handleGetCodeSucc(res) {
         //console.log(res)
        if(res.data.status == 200) {
          const downloadElement = document.createElement('a'); // 创建a标签
          downloadElement.href = 'https://www.guangliangkongjian.com/download/报表文件.docx';
          document.body.appendChild(downloadElement);
          downloadElement.click();
          document.body.removeChild(downloadElement);
          this.loading.close();
        }
      },
    },
     computed: {
       newYear() {
         return this.$store.state.year
       },
       newSemester() {
         return this.$store.state.semester
       }
     },
     watch: {
       newYear(val) {
         this.curYear = val;
         this.createdGetInfo();
         this.getLevelInfo();
       },
       newSemester(val) {
         this.curSemester = val;
         this.createdGetInfo();
         this.getLevelInfo();
       }
     }
  }
</script>

<style>
</style>
