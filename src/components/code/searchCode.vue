<template>
  <div>
    <el-row class="searchBox" :gutter="20" v-if="show">
      <el-col :span="5"> <current-school></current-school></el-col>
      <el-col :span="2"> <div class="name">班级选择</div></el-col>
      <el-col :span="4">
        <el-select v-model="value" clearable  placeholder="请选择"  @change="handleClassChange">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.className"
              :value="item.id">
            </el-option>
          </el-select>
      </el-col>
      <el-col :span="2">
           <div class="schoolSet">学生姓名选择：</div>
      </el-col>
      <el-col :span="4">
        <el-autocomplete
        clearable
          class="inline-input"
          v-model="studentName"
          :fetch-suggestions="querySearch"
          clearable
          placeholder="请输入学生姓名"
          @select="handleSelect">
        </el-autocomplete>
      </el-col>
     <el-col :span="2">
       <el-button type="primary" @click="getCode">下载二维码</el-button>
     </el-col>
     <el-col :span="2">
       <el-button type="primary" @click="handleReset">重置</el-button>
     </el-col>
    </el-row>
  </div>
</template>
<script>
  import axios from 'axios'
 import  currentSchool from '../../common/currentSchool'
  export default{
    created() {
      this.classId = window.sessionStorage.getItem('bindclassId');
      this.className = window.sessionStorage.getItem('bindclassName')
      this.getOptions()
    },
    data() {
      return {
        options: [],
        value: '',
        inputName: '',
        classId: '',
        show: true,
        studentId: '',
        studentList: [],
        studentName: ''
      }
    },
    components:{
      currentSchool
    },
    methods: {
      querySearch(queryString, cb) {
         var studentList = this.studentList;
         var results = queryString ? studentList.filter(this.createFilter(queryString)) : studentList;
         // 调用 callback 返回建议列表的数据
         cb(results);
       },
       createFilter(queryString) {
         return (student) => {
           return (student.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
         };
       },
       handleSelect(item) {
          this.studentId = item.id;
      },
      handleReset() {
        this.studentName = '';
        this.value = '';
      },
      handleInputName(e) {
        this.inputName = e
      },
      handleClassChange(val) {
        this.classId = val;
        this.getStudentList()
      },
      getStudentList() {
        let param = new FormData();
        param.append('id', this.classId);
        axios({
            method: 'post',
            data: param,
            url: '/lightspace/school/getStudentByClass'
        }).then(this.handleGetStudentListSucc.bind(this)).catch((err) => {
           console.log(err)
         })
      },
      handleGetStudentListSucc(res) {
          res ? res = res.data.data: '';
          for(let i  =0; i <res.length; i++) {
            this.studentList.push({
              value: res[i].name,
              id: res[i].id
            })
          }
      },
      getOptions() {
        let param = new FormData();
        axios({
            method: 'post',
            url: '/lightspace/school/getAllClass'
        }).then(this.handleGetOptionsSucc.bind(this)).catch((err) => {
           console.log(err)
         })
      },
      handleGetOptionsSucc(res) {
        //console.log(res)
        if(res.data.status == 200) {
          if(this.classId) {
            let all = res.data.data;
            let arr = all.filter((item, index) => {
              if(item.id == this.classId) {
                return item
              }
            })

            this.options = arr
            this.value = arr[0].className;
          }else {
            this.options = res.data.data;
          }
        }
      },
      getCode() {
          let param= new FormData();
          console.log(this.classId, this.studentId)
        if(!this.studentId && !this.classId) {
          this.type = 'school';
        }else if(this.classId && !this.studentId) {
          this.type = 'class';
          param.append('id',this.classId);
        }else if(this.studentId) {
          this.type= 'student';
          param.append('id',this.studentId);
        }
        param.append('type', this.type)
         this.loading = this.$loading({
            lock: true,
            text: '生成中,请耐心等候...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          axios({
            method: 'post',
            url: '/lightspace/school/download',
            data: param
          }).then(this.handleGetCodeSucc.bind(this)).catch((err) => {console.log(err)})
      },
      handleGetCodeSucc(res) {
          // console.log(res)
          if(res.data.status == 200) {
            const downloadElement = document.createElement('a'); // 创建a标签
            downloadElement.href = res.data.data;
            document.body.appendChild(downloadElement);
            downloadElement.click();
            document.body.removeChild(downloadElement);
            this.loading.close();

          }
      }

    }
  }
</script>
<style  lang="stylus" scoped>
  .searchBox
    height: 40px
    line-height: 40px
    margin: 20px 0
    .name
      height: 40px
      line-height: 40px
      font-weight: bold
      font-size: 16px
      text-align: right
</style>
