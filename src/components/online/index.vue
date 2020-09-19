<template>
  <div>
    <title-header :common="common"></title-header>
    <el-card>
      <el-row v-show="show">
        <el-col :span="24"><div class="schoolNow">{{title}}</div></el-col>
      </el-row>
      <div class="searchBox" v-show="!show">
        <el-row :gutter="20">
          <el-col :span="2">
            <div class="name">班级选择</div>
         </el-col>
          <el-col :span="4">
             <el-select clearable v-model="value" placeholder="请选择"  @change="handleClassChange">
                 <el-option
                   v-for="item in options"
                   :key="item.id"
                   :label="item.className"
                   :value="item.id">
                 </el-option>
               </el-select>
          </el-col>
         <el-col :span="2">
             <div class="name">列数选择：</div>
         </el-col>
         <el-col :span="2" >
           <el-select clearable v-model="column" placeholder="请选择"   clearable>
             <el-option v-for="item in typeoptions" :key="item.value"   :label="item.label"  :value="item.value" >
             </el-option>
           </el-select>
         </el-col>
         <el-col :span="2">
              <div class="name">排座周期：</div>
         </el-col>
          <el-col :span="2">
             <el-select v-model="time"  clearable>
             <el-option v-for="item in timeoptions" :key="item.value"  :label="item.label"  :value="item.value" >
             </el-option>
             </el-select>
         </el-col>
         <el-col :span="2">
             <el-button type="primary" @click="seatQuery(1)">近期微调</el-button>
         </el-col>
         <el-col :span="2">
             <el-button type="primary"  @click="seatQuery(2)">打乱重拍</el-button>
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
     this.className = window.sessionStorage.getItem('bindclassName');
     this.schoolName = window.sessionStorage.getItem('schoolName');
     this.regionName = window.sessionStorage.getItem('regionName');
     this.computedNow()
     this.getOptions()
   },
    data() {
      return {
         common: '在线排座',
         options: [],
         value: '',
         inputName: '',
         classId: 0,
         classRecordList: [], // 班级列表
         currentPage: 1,
         pageSize: 10,
         total: 0,
         column: '',
         time: '',
         regionName: '',
         schoolName: '',
         show: false,
         title: '您当前所在位置是'+ '区，' +'请选择区下某一学校应用此功能',
         typeoptions: [{
           value: 6,
           label: '6列'
         }, {
           value: 7,
           label: '7列'
         }, {
           value: 8,
           label: '8列'
         }, {
           value: 9,
           label: '9列'
         },
         ],
         timeoptions:[{
           value: 7,
           label: '一星期'
         }, {
           value: 14,
           label: '两星期'
         }, {
           value: 30,
           label: '一个月'
         }, {
           value: 90,
           label: '三个月'
         }],
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
     seatQuery(num) {
      if( num == 2) { //打乱重拍
         let param = new FormData();
         if(!this.classId) {
              return this.$message.error('请选择学校和班级');
         }else if(!this.column) {
             return this.$message.error('请选择排座列数');
         }else if(!this.time) {
             return this.$message.error('请选择排座周期');
         }else{
           let routeUrl = this.$router.resolve({
             path: '/onlineSeat',
             query: {
               classId: this.classId,
               type: this.column,
               time: this.time,
               sortType: num
             }
            });
            window.open(routeUrl.href, '_blank');
           }
      }else if(num ==1) {  //近期微调
            let param = new FormData();
            if(!this.classId) {
                return this.$message.error('请选择学校和班级');
            }else if(!this.value) {
                return this.$message.error('请选择排座列数');
            }else if(!this.time) {
                return this.$message.error('请选择排座周期');
            }else{
              let param = new FormData();
              param.append('classId', this.classId);
              param.append('type', this.column);
              axios({
                  method: 'post',
                  url: '/lightspace/school/chkSort',
                  data: param
              }).then((res) => {
                if(res.data.status == 200) {
                 let routeUrl = this.$router.resolve({
                   path: '/onlineSeat',
                   query: {
                     classId: this.classId,
                     type: this.column,
                     sortType: num,
                     time: this.time,
                   }
                  });
                  window.open(routeUrl.href, '_blank');
                }else if(res.data.status == 10238) {
                   this.$message({
                      message: res.data.msg,
                      type: 'warning'
                    });
                }else if(res.data.status == 10239) {
                  this.$message({
                     message: res.data.msg,
                     type: 'warning'
                   });
                }
              }).catch((err) => {
                console.log(err)
              })
            }
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
.schoolNow
   font-size: 20px
   font-weight: bold
   letter-spacing :3px
   color:#64c0ff
   margin: 0 10px
</style>
