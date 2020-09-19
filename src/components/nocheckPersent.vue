<template>
  <div>
    <el-card>
      <div class="title_name"> {{schoolName}}<span style="color: red">未筛查学生名单</span></div>
      <el-table  :data="tableData" border style="width: 80%;margin-left: 10%;">
        <el-table-column  label="" type="index"></el-table-column>
        <el-table-column prop="schoolName" label="学校"></el-table-column>
        <el-table-column prop="classesName" label="班级"></el-table-column>
        <el-table-column  prop="name" label="姓名"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    created() {
      this.getAll()
      this.schoolName = window.sessionStorage.getItem('schoolName')
    },
    data() {
      return {
        tableData: [],
        schoolName: ''
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
      getAll() {
        this.openFullScreen()
        let param = new FormData();
       axios({
             method: 'post',
             data: param,
             url: '/lightspace/school/undetectedList'
           }).then(this.handleGetTopAllSucc.bind(this)).catch((err) => {console.log(err)})
      },
      handleGetTopAllSucc(res) {
        this.closeFullScreen(this.openFullScreen())
        if(res.data.data) {
          this.tableData = res.data.data
        }

      }
    }
  }
</script>

<style lang="stylus" scoped>
  .title_name
     font-size: 18px
     padding: 6px 0 16px
     font-weight: bold
     text-align: center
     margin: 50px
</style>
