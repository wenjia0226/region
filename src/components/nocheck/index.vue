<template>
  <div>
    <title-header :common="common"></title-header>
    <el-card>
      <el-button type="primary" icon="el-icon-bell" @click="remind"> 提醒</el-button>
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark"style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection"></el-table-column>
      <el-table-column type="index" label="数量"></el-table-column>
      <el-table-column prop="schoolName" label="学校" ></el-table-column>
      <el-table-column prop="classesName" label="班级" ></el-table-column>
      <el-table-column prop="name" label="姓名" ></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  import titleHeader from '../../common/header'
  import axios from 'axios'
  export default {
    created() {
      this.getNoCheck()
    },
    data() {
      return {
        common: '未检测',
        tableData: [],
        list: []
      }
    },
    components:{
      titleHeader
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
      remind() {
        this.openFullScreen()
        let param = new FormData();
        param.append('id', this.list);
        axios({
            method: 'post',
            url: '/lightspace/school/remindUndetected',
            data: param
        }).then(this.handleRemindNoCheckSucc.bind(this))
        .catch((err) => { console.log(err)})
      },
      handleRemindNoCheckSucc(res){
        this.closeFullScreen(this.openFullScreen())
        if(res.data.status == 200) {
          
          this.$message.success('恭喜您，提醒成功')
          this.getNoCheck()
        }
      },
      getNoCheck() {
        this.openFullScreen()
        let param = new FormData();
        axios({
            method: 'post',
            url: '/lightspace/school/undetected',
            data: param
        }).then(this.handleGetNoCheckSucc.bind(this))
        .catch((err) => { console.log(err)})
      },
      handleGetNoCheckSucc(res) {
        //console.log(res)
        this.closeFullScreen(this.openFullScreen())
        if(res.data.data) {
          this.tableData = res.data.data
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
        let rowList = val;
        this.list = rowList.map((item, index) => {
            return  item.id
        })
      }
    }
   }
</script>

<style>
</style>
