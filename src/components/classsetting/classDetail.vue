<template>
  <div>
        <!-- <el-table :data="tableData" style="width: 100%;margin-bottom: 20px;"row-key="id"border
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
          <el-table-column align="center" prop="date" label="日期">
          </el-table-column>
          <el-table-column align="center" prop="name" label="姓名"></el-table-column>
          <el-table-column align="center" prop="address"label="地址"></el-table-column>
        </el-table> -->
         <el-table v-if="!show"
            @row-click="clickTable"
            :data="gradeList"
            ref="refTable"
            stripe
            style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-row>
                  <el-col :span="16":offset="8">
                    <el-table  border :data="props.row.children" stripe :show-header="status">
                       <el-table-column align="center" prop="className"></el-table-column>
                       <el-table-column  align="center" label="操作">
                         <template slot-scope="scope" >
                          <!--  <el-button type="primary" size="mini" icon="el-icon-edit" circle @click="editClass(scope.row.id)"></el-button> -->
                            <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="deleteClass(scope.row.id)"></el-button>
                         </template>
                       </el-table-column>
                    </el-table>
                    <div class="addClass" >
                      <el-input v-model="input"  width="300px" placeholder="新增班级" @input="handleInput" padding="0"></el-input>
                      <el-button type="primary" size="middle" icon="el-icon-check" @click="saveNewClass"></el-button>
                      <el-button type="info" size="middle" icon="el-icon-close" @click="resetInput"></el-button>
                    </div>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
            <el-table-column  label="年级"  align="center"  prop="name"></el-table-column>
            <el-table-column  label="班级个数"  align="center" prop="number"></el-table-column>
            <el-table-column  align="center" label="操作">
              <template slot-scope="scope">
                 <el-button type="success" size="middle" @click="handleAddClass(scope.row.name)">新增班级</el-button>
              </template>
            </el-table-column>
          </el-table>
  </div>
</template>
<script>
  import axios from 'axios'
  export default {
    name: 'classdetail',
    created() {
      this.getGradeList()
	  this.schoolName = window.sessionStorage.getItem('schoolName');
	  this.regionName = window.sessionStorage.getItem('regionName');
	  this.computedNow()
    },
    data() {
      return {
         gradeList: [],
         status: false,
         input: '',
         nowGrade: '',
         currentRow: {},
         expands: [],
         showAdd: false,
         regionName: '',
         schoolName: '',
         show: false
      }
    },
    methods: {
		computedNow() {
		  if(this.schoolName == this.regionName) {
		    this.show = true
		  }
		},
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
      editClass(id) {
         console.log(id)
      },
      async deleteClass(id) {
        const confirmResult = await this.$confirm('此操作将永久删除该班级 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        }).catch(err => err)
        if(confirmResult !== 'confirm') {
            return this.$message.info('已经取消删除')
        }
        let param = new FormData();
        param.append('id', id)
        axios({
            method: 'post',
            url: '/lightspace/school/deleteClass',
            data: param
        }).then(this.handleDeleteClssSucc.bind(this))
        .catch((err) => {
          console.log(err)
        })
      },
      handleDeleteClssSucc(res) {
        if(res.data.status == 200) {
          this.$message.success('删除班级成功')
          this.getGradeList()
        }
      },
      toggleRowExpansion(row){
        this.expands = [];
        this.expands.push(row.name);
      },
      handleInput(val) {
        if(Number(val)) {
           this.input = val
        }else {
          this.$message.error('请输入班级数字')
          this.input = ''
        }

      },
      resetInput(){
        this.input = 0
      },
      handleAddClass(grade) {
        this.showAdd = true;
        this.grade = grade;
      },
      saveNewClass(row) {
        let param = new FormData();
        if(!this.grade) {
          return this.$message.warning('请先选择新建班级')
        }
        param.append('grade', this.nowGrade);
        param.append('classNumber', this.input);

          axios({
            method: 'post',
            data: param,
            url: '/lightspace/school/addClass'
          }).then(this.handleAddClassSucc.bind(this)).catch((err) => {
            console.log(err)
          })


      },
      handleAddClassSucc(res) {
        //console.log(res)
        if(res.data.status == 200) {
          this.$message.success('添加班级成功')
           if(res.data.data) {
             this.gradeList = res.data.data;
             this.input = '';
           }
        }else if (res.data.status == 10207) {
             this.$message.error(res.data.msg)
           }
      },
       clickTable(row,index,e){
          this.nowGrade = row.name;
          this.currentRow = row;
          this.$refs.refTable.toggleRowExpansion(row)
        },

      getGradeList() {
        this.openFullScreen()
        let param = new FormData();
        axios({
          method: 'post',
          url: '/lightspace/school/classList'
        }).then(this.handleGetGradeListSucc.bind(this)).catch((err) => {
          console.log(err)
        })
      },
      handleGetGradeListSucc(res) {
        this.closeFullScreen(this.openFullScreen())
        if(res.data.data) {
          this.gradeList = res.data.data
          //this.$refs.refTable.toggleRowExpansion(row)
        }
      }
    }
  }
</script>
<style lang="stylus" scoped>
  >>>.el-table__expanded-cell
    padding:  0
  .addClass
     display: flex
     margin: 10px 0
  >>>.el-input
    width: 200px
/deep/ .el-icon-arrow-right:before {
     content: "\e723";
     font-size: 14px;
 }


</style>
