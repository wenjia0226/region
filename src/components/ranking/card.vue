<template>
 <div>
   <el-table  :header-cell-style="{background:'#eef1f6',color:'#606266'}" :data="this.content"
     border   stripe style="width: 100%">
       <el-table-column label="学校" prop="schoolName"></el-table-column>
       <el-table-column label="班级" prop="className"></el-table-column>
       <el-table-column label="学生姓名" prop="studentName"></el-table-column>
       <el-table-column label="爱眼币数量" prop="sum"></el-table-column>
       <el-table-column label="班级排名" v-if="this.type == 'class'"prop="ranking"></el-table-column>
       <el-table-column label="本校排名" v-if="this.type == 'school'"prop="ranking"></el-table-column>
      <!-- <el-table-column label="区排名" prop="regionRanking"></el-table-column> -->
   </el-table>
   <el-pagination
      background
      :current-page="this.number"
      @current-change="handleCurrentChange"
      layout="prev, pager, next"
      :page-size ="this.size"
      :total="this.totalElements">
     </el-pagination>
 </div>
</template>
<script>
 import axios from 'axios'
 export default {
   name: 'card',
   created() {
     this.getInfo('');
   },
   data() {
     return {
       content: [],
       pageSize: 10,
       size: 10,
       total:0,
       totalElements: 0,
       number: 0,
     }
   },
   methods: {
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
     getInfo(classId) {
       if(classId) {
         this.id = classId;
         this.type = 'class'
       }else {
         this.classId = '';
         this.type ='school'
       }
       this.page = 1;
       this.getDataList()
     },
     //分页
     handleCurrentChange(val) {
       this.page = val;
       this.getDataList();
     },
     getDataList() {
         this.openFullScreen();
         let param = new FormData();
         param.append('type', this.type);
         param.append('id', this.id);
         param.append('page', this.page);
         axios({
           method: 'post',
           data: param,
           url: '/lightspace/school/integralRanking'
         }).then(this.handleGetDataListSucc.bind(this)).catch((err) => {console.log(err)})
     },
     handleGetDataListSucc(res) {
       let that = this;
      // console.log(res)
      this.closeFullScreen(this.openFullScreen())
      if(res.data.status == 200) {
        res ? res= res.data.data: '';
        this.content = res.content;
        this.totalElements = res.totalElements;
        this.size = res.size;
        this.number = res.number + 1;
        if(this.content.length) {
          this.content.forEach((item, index) => {
            item.ranking = index + (this.page - 1) * this.pageSize + 1
          })
        }
      }else {
        this.$message.error(res.data.msg)
        this.content = [];
      }
     },
   }
}
</script>
<style>
</style>
