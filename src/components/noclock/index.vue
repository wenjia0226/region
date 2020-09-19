<template>
  <div>
    <title-header :common="common"></title-header>
    <el-card>
      <el-button type="primary" icon="el-icon-bell" @click="remind"> 提醒</el-button>
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark"style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection"></el-table-column>
     <!-- <el-table-column label="日期" width="120">
        <template slot-scope="scope">{{ scope.row.date }}</template>
      </el-table-column> -->

      <el-table-column prop="schoolName" label="学校" width="180" ></el-table-column>
      <el-table-column prop="className" label="班级" width="180"></el-table-column>
      <el-table-column prop="name" label="姓名"  width="180"></el-table-column>
      <el-table-column label="未打卡项" >
         <!-- 数据的遍历  scope.row就代表数据的每一个对象-->
         <template slot-scope="scope" >
           <div style="margin: 0 10px;display: inline-block;" v-for="(item, index) in scope.row.taskList">
          <el-tag  styel="margin:0 10px">
            {{item.title}}
          </el-tag>
          </div>
         </template>
      </el-table-column>
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
        common: '未打卡',
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
            url: '/lightspace/school/remindUntask',
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
            url: '/lightspace/school/untask',
            data: param
        }).then(this.handleGetNoCheckSucc.bind(this))
        .catch((err) => { console.log(err)})
      },
      handleGetNoCheckSucc(res) {
        // console.log(res)
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
