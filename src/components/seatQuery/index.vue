<template>
  <div>
    <title-header :common="common" ></title-header>
    <el-card>
      <el-row v-show="show">
        <el-col :span="24"><div class="schoolNow">{{title}}</div></el-col>
      </el-row>
      <div class="searchBox" v-show="!show">
        <el-row :gutter="20">
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
            <el-button type="primary" @click="getSeatList">查询</el-button>
          </el-col>
      </el-row>
    </div>
    <!-- 排座结果列表 -->
    <el-table  v-if="classRecordList.length" :data="classRecordList.slice((currentPage-1) * pageSize, currentPage * pageSize)"   stripe style="width: 100%"   row-key="id" row-click="handleRow">
       <el-table-column type="index"></el-table-column>
       <el-table-column label="排列次数" prop="name"></el-table-column>

        <el-table-column  label="排列方式" prop="type"  class="red"></el-table-column>
       <el-table-column label="排座时间" prop="date"></el-table-column>
         <el-table-column label="查看">
            <template slot-scope="scope">
                <el-button type="primary" size="middle" @click="showSeat(scope.row.id,scope.row.type)">排座表</el-button>
            </template>
        </el-table-column>
    </el-table>
    <!-- 分页功能 -->
    <el-pagination
        v-if="classRecordList.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="classRecordList.length">
    </el-pagination>

    </el-card>
  </div>
</template>

<script>
  import axios from 'axios'
  import titleHeader from '../../common/header'
  export default {
    created() {
      this.classId = window.sessionStorage.getItem('bindclassId');
      this.className = window.sessionStorage.getItem('bindclassName')
      this.schoolName = window.sessionStorage.getItem('schoolName');
      this.regionName = window.sessionStorage.getItem('regionName');
      this.computedNow()
      this.getOptions()
    },
    data() {
      return {
         common: '座位查询',
         options: [],
         value: '',
         inputName: '',
         classId: '',
         className: '',
         classRecordList: [], // 班级列表
         currentPage: 1,
         pageSize: 10,
         total: 0,
         regionName: '',
         schoolName: '',
         show: false,
         title: '您当前所在位置是'+ '区，' +'请选择区下某一学校应用此功能',
      }
    },
    components: {
       titleHeader
    },
    methods: {
      computedNow() {
        if(this.schoolName == this.regionName) {
          this.show = true
        }
      },
      handleClassChange(val) {
        this.classId = val;
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
      //获取座位列表
      getSeatList() {
        if(this.classId) {
          let param = new URLSearchParams();
          param.append('classId', this.classId);
          axios({
              method: 'post',
              url: '/lightspace/school/classSorts',
              data: param
          }).then(this.handleGetClassReorcdSucc.bind(this))
          .catch((err) => {console.log(err)})
          }else {
           this.$message({
              message: '请先选择学校班级',
              type: 'warning'
            });
          }
      },
      handleGetClassReorcdSucc(res) {
         if(res.data.status === 10204) {
             this.$message.error(res.data.msg);
             this.$router.push('/login');
         } else if(res.data.status == 200) {
            if(res.data.data.length) {
                this.classRecordList = res.data.data;
                console.log(this.classRecordList)
             }else {
                this.$message({
                   message: '你好，没有查到该班级座位表，请先去排座',
                   type: 'warning'
                 });
                 this.classRecordList = [];
             }
          }
      },
      handleSizeChange(newSize) {
          this.pageSize = newSize
      },
      //监听页码值改变事件
      handleCurrentChange(val) {
         this.currentPage = val;
      },
      showSeat(id, type) {
        let routeUrl = this.$router.resolve({
          path: '/detailSeat',
          query: {
            id:  id,
            type: type
          }
         });
        window.open(routeUrl .href, '_blank');
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
  .schoolNow
     font-size: 20px
     font-weight: bold
     letter-spacing :3px
     color:#64c0ff
     margin: 0 10px
</style>
