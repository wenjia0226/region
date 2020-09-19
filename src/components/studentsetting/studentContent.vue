<template>
  <div>
    <el-table  :header-cell-style="{background:'#eef1f6',color:'#606266'}" :data="this.content"
      border  stripe style="width: 100%">
        <el-table-column label="学校" prop="schoolName"></el-table-column>
        <el-table-column label="班级" prop="classesName"></el-table-column>
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="性别" prop="gender"></el-table-column>
        <el-table-column label="最近一次检测时间" prop="lastTime"></el-table-column>
        <el-table-column label="操作" >
          <template slot-scope="scope" >
             <el-button type="primary"icon="el-icon-edit" circle @click="editStudent(scope.row.id)"></el-button>
             <el-button type="danger" icon="el-icon-delete" circle @click="deleteStudent(scope.row.id)"></el-button>
          </template>
         </el-table-column>
    </el-table>
    <el-pagination
        background
        :current-page="this.number"
        @current-change="handleCurrentChange"
        layout="prev, pager, next"
        :page-size ="this.size"
        :total="this.totalElements">
     </el-pagination>
     <!-- 修改学生 -->
       <el-dialog title="修改学生" :visible.sync="editStudentVisible" width="50%" :before-close="handleClose">
           <el-form :model="editStudentForm" :rules="editStudentRules" ref="studentFormRef" label-width="120px" >
           <el-form-item label="所属学校班级" prop="classesId">
              <el-select v-model="editStudentForm.classesId" placeholder="请选择"  @change="handleClassChange">
                  <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.className"
                    :value="item.id">
                  </el-option>
                </el-select>
           </el-form-item>
           <el-form-item label="学生姓名" prop="name">
               <el-input v-model="editStudentForm.name" clearable></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="gender">
                 <el-radio v-model="editStudentForm.gender" size="medium" border :label="0">男</el-radio>
                 <el-radio v-model="editStudentForm.gender" size="medium" border :label="1">女</el-radio>
            </el-form-item>
            <el-form-item label ="出生日期" >
               <el-date-picker
                v-model="editStudentForm.birthday"
                type="date"
                @blur="dateChange"
                placeholder="选择日期">
               </el-date-picker>
            </el-form-item>
            <el-form-item label="坐姿高度(厘米)"  prop="sittingHeight">
                 <el-input v-model="editStudentForm.sittingHeight" clearable></el-input>
            </el-form-item>
            <el-form-item label="身高(厘米)" prop="height">
                 <el-input v-model="editStudentForm.height" clearable></el-input>
            </el-form-item>
            <el-form-item label="体重(KG)" >
                 <el-input v-model="editStudentForm.weight" clearable></el-input>
            </el-form-item>

            <el-form-item label="是否矫正" >
                     <el-radio v-model="editStudentForm.correct" size="medium" border  :label="1">已矫正</el-radio>
                     <el-radio v-model="editStudentForm.correct" size="medium" border :label="0">未校正</el-radio>
            </el-form-item>
           </el-form>
           <span slot="footer" class="dialog-footer">
               <el-button @click="handleClose">取 消</el-button>
               <el-button type="primary" @click="sumitEditStudent" >确 定</el-button>
           </span>
       </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    name: 'studentContent',
    created() {
      this.getInfo('', '');
      this.getOptions();
    },
    data() {
      var valiNumberPass1 = (rule, value, callback) => {//包含小数的数字
       let reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/g;
       if (value === '') {
           callback(new Error('请输入内容'));
       } else if (!reg.test(value)) {
           callback(new Error('请输入数字'));
       } else {
           callback();
       }
      }
      return {
       content: [],
       pageSize: 10,
       size: 5,
       total:0,
       totalElements: 0,
       number: 1,
       page: 1,
       classId: '',
       editStudentVisible: false,
       editStudentForm: {
           "sittingHeight":'',
           "correct": '',
           "gender":'',
           "height":'',
           "weight": '',
           "name":"",
           "birthday": '',
            classId: '',
            studentId: ''
       },
       editStudentRules: {
           name:  { required: true, message: '请输入姓名', trigger: 'blur' },
           correct:  { required: true, type: 'number',message: '请输入是否矫正', trigger: 'blur' },
           gender:  { required: true,type: 'number', message: '请输入性别', trigger: 'blur' },
           height:  { required: true, validator: valiNumberPass1, message: '请输入身高(m)', trigger: 'blur' },
           weight:  { required: true,validator: valiNumberPass1, message: '请输入体重(kg)', trigger: 'blur' },
           sittingHeight: { required: true,validator: valiNumberPass1, message: '请输入坐姿高度(cm)', trigger: 'blur' },
           classesId:{ required: true, message: '请选择学校班级', trigger: 'change' },
           birthday: {type: 'date', required: true, message: '请选择日期', trigger: 'change'}
       },
       options: []
      }
    },
    methods: {
      //进入判断类型
      getInfo(classId, name) {
        if(classId && !name) {  // 如果只有班级
          this.type = 'class';
          this.id = classId;
        }else if(classId && name) { // 如果班级和姓名都存在
          this.type ="student";
          this.name = name;
          this.id = '';
        }else if (!this.classId && name) {
          this.type ="student";
          this.name = name;
          this.id = ''
        } else {   //如果都不存在
          this.type = '',
          this.id = ''
        }
        this.page = 1;
        this.getDataList()
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
      // 获取列表
      getDataList() {
        this.openFullScreen()
        let param = new FormData();
          param.append('type', this.type);
          param.append('id', this.id);
          param.append('page', this.page);
          param.append('name', this.name);
          axios({
            method: 'post',
            data: param,
            url: '/lightspace/school/getStudent'
          }).then(this.handleGetDataListSucc.bind(this)).catch((err) => {console.log(err)})
      },
      handleGetDataListSucc(res) {
        // console.log(res)
        this.closeFullScreen(this.openFullScreen())
       if(res.data.status == 200) {
         res ? res= res.data.data: '';
         this.content = res.content;
         this.totalElements = res.totalElements;
         this.size = res.size;
         this.number = res.number + 1;
         if(this.content.length) {
           this.content.forEach((item) => {
            if(item.gender == 0) {
              item.gender = '男'
            }else {
              item.gender = '女'
            }
           })
         }
       }else {
         this.$message.error(res.data.msg)
         this.content = [];
       }
      },
      //分页
      handleCurrentChange(val) {
        this.page = val;
        this.getDataList();
      },
      //关闭按钮
       handleClose() {
       this.editStudentVisible = false;

      },
      handleClassChange(val) {
        this.classId = val
      },
      dateChange(val) {
      if(val) {
        this.startTime = val.toString().split(",")[0]
        this.endTime = val.toString().split(",")[1]
        this.birthday = val.toLocaleString().split(' ') [0];
      }
    },
      // 修改学生
      editStudent(id) {
        this.openFullScreen()
          this.studentId =id;
          let param = new URLSearchParams();
          param.append('id', id);
          axios({
              method: 'post',
              url: '/lightspace/school/editStudent',
              data: param
          }).then(this.handleEditStuSucc.bind(this)).catch((err) => {console.log(err)})
      },

      handleEditStuSucc(res) {
       this.closeFullScreen(this.openFullScreen())
       // console.log(res)
        if(res.data.status === 10204) {
            this.$message.error(res.data.msg);
        } else if(res.data.status == 200) {
          this.editStudentForm = res.data.data;
          this.editStudentVisible = true;
        }
      },
      sumitEditStudent() {
        this.$refs.studentFormRef.validate((valid) => {
          if(!valid) return this.$message.error('验证失败');
          let param = new FormData();
          param.append('id', this.studentId);
          param.append('classId', this.classId);
          param.append('sittingHeight',this.editStudentForm.sittingHeight)
          param.append('correct', this.editStudentForm.correct)
          param.append('gender', this.editStudentForm.gender)
          param.append('height', this.editStudentForm.height)
          param.append('weight', this.editStudentForm.weight)
          param.append('name', this.editStudentForm.name)
          param.append('birthday', this.birthday);
          axios({
              method: 'post',
              url: '/lightspace/school/saveStudent',
              data: param
          }).then(this.handleEditSaveSucc.bind(this)).catch((err) => {console.log(err)})
          })
      },
      handleEditSaveSucc(res) {
        // console.log(res)
        if(res.data.status === 10204) {
            this.$message.error(res.data.msg);
            this.$router.push('/login');
        } else if(res.data.status == 200) {
          this.editStudentVisible = false;
          this.$message.success('更新学生信息成功');
          this.getDataList()
      }
     },
     //删除学生
      async deleteStudent(id) {
        const confirmResult = await this.$confirm('此操作将永久删除该学生 是否继续?', '提示', {
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
            url: '/lightspace/school/deleteStudent',
            data: param
        }).then(this.handleDeleteClssSucc.bind(this))
        .catch((err) => {
          console.log(err)
        })
      },
      handleDeleteClssSucc(res) {
        if(res.data.status == 200) {
          this.$message.success('删除班级成功')
          this.getDataList();
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
              this.searchStudent()
            }else {
              this.options = res.data.data;
            }
          }
      },
  }
}
</script>

<style>
</style>
