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
      <el-table-column type="index" label="数量"></el-table-column>
      <el-table-column prop="old.visionLeft" label="原左眼视力" ></el-table-column>
      <el-table-column prop="old.visionRight" label="原右眼视力" ></el-table-column>
      <el-table-column prop="new.visionLeft" label="现在左眼视力" ></el-table-column>
      <el-table-column prop="new.visionRight" label="现在右眼视力" ></el-table-column>
      <el-table-column prop="new.schoolName" label="学校" ></el-table-column>
      <el-table-column prop="new.className" label="班级" ></el-table-column>
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
        common: '视力下降',
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
            url: '/lightspace/school/remindDecline',
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
            url: '/lightspace/school/decline',
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
