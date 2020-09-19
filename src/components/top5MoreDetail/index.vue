<template>
  <div>
    <el-card>
      <div class="title_name"> {{schoolName}}<span style="color: red">不良率预警班级排行榜</span></div>
      <el-table  :data="tableData" border style="width: 80%;margin-left: 10%;">
        <el-table-column  label="排名" type="index"></el-table-column>
        <el-table-column  prop="name" label="班级"></el-table-column>
        <el-table-column prop="bad" label="视力不良人数"></el-table-column>
        <el-table-column prop="percentage" label="不良率"></el-table-column>
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
        param.append('type', 'all');
       axios({
             method: 'post',
             data: param,
             url: '/lightspace/school/top5'
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
