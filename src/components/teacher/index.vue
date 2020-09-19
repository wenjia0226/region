<template>
  <div>
     <title-header :common="common" ></title-header>
    <el-card>
      <el-row>
        <el-col :span="24"><div class="schoolNow" v-if="show">{{title}}</div></el-col> 
      </el-row>
      <el-row :gutter="20" style="margin: 10px 0 30px" v-if="!show">
         <el-col :span="6">
          <el-input placeholder="输入教师名称" v-model="query" clearable @clear="queryTeacher">
              <el-button slot="append" icon="el-icon-search" @click="queryTeacher"></el-button>
           </el-input>
         </el-col>
         <el-col :span="6">
                <el-button type="primary" @click="addTeacher">添加老师</el-button>
         </el-col>
      </el-row>
     <el-table  v-if="!show" :data="this.content" border  stripe style="width: 100%">
        <el-table-column label="姓名" prop="name"></el-table-column>
       <el-table-column label="学校名称" prop="schoolName"></el-table-column>
       <el-table-column label="班级" prop="className"></el-table-column>
       <el-table-column label="电话" prop="phone"></el-table-column>
        <el-table-column label="密码" prop="password"></el-table-column>
       <el-table-column label="操作">
           <template slot-scope="scope">
              <el-button type="primary" size="middle" icon="el-icon-edit" @click="showEditDialog(scope.row.id)"></el-button>
           </template>
       </el-table-column>
       <el-table-column label="操作">
           <template slot-scope="scope">
              <el-button type="danger"  size="middle" icon="el-icon-delete" @click ="removeTeacherById(scope.row.id)" ></el-button>
           </template>
       </el-table-column>
     </el-table>
     <!-- 搜索 -->
     <el-row v-show="this.searchTeacherList.length" v-if="!show">
        <el-col>搜索结果</el-col>
      </el-row>

    <!-- 分页功能 -->
    <el-pagination
      v-if="!show"
      background
      :current-page="this.number"
      @current-change="handleCurrentChange"
      layout="prev, pager, next"
      :page-size ="this.size"
      :total="this.totalElements">
    </el-pagination>
   </el-card>
   <!-- 添加对话框 -->
   <el-dialog title="添加教师" :visible.sync="addDialogVisible" width="50%" :before-close="handleClose">
       <el-form :model="addTeacherForm" :rules="addTeacherRules" ref="addTeacherRef" label-width="120px">
           <el-form-item label="姓名" prop="name" >
               <el-input v-model="addTeacherForm.name"></el-input>
           </el-form-item>
          <el-form-item label="所属学校班级" prop='stu_cat'>
             <el-select v-model="value" placeholder="请选择"  @change="handleClassChange">
                 <el-option
                   v-for="item in options"
                   :key="item.id"
                   :label="item.className"
                   :value="item.id">
                 </el-option>
               </el-select>
          </el-form-item>
           <el-form-item label="电话" prop="phone">
               <el-input v-model="addTeacherForm.phone"></el-input>
           </el-form-item>
           <el-form-item label="密码" prop="password">
               <el-input v-model="addTeacherForm.password"></el-input>
           </el-form-item>
       </el-form>
       <span slot="footer" class="dialog-footer">
           <el-button @click="addDialogVisible = false">取 消</el-button>
           <el-button type="primary" @click="submitTeacher">确 定</el-button>
       </span>
   </el-dialog>
   <!-- 修改用户对话框 -->
   <el-dialog title="修改教师信息" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
       <el-form :model="editTeacherForm" :rules="editTeacherRules" ref="editTeacherRef" label-width="100px">
           <el-form-item label="姓名" prop="name">
               <el-input v-model="editTeacherForm.name"></el-input>
           </el-form-item>
           <el-form-item label="所属学校班级" prop='tea_cat'>
             <el-select v-model="editTeacherForm.classId" placeholder="请选择"  @change="handleClassChange">
                 <el-option
                   v-for="item in options"
                   :key="item.id"
                   :label="item.className"
                   :value="item.id">
                 </el-option>
               </el-select>
           </el-form-item>
           <el-form-item label="电话" prop="phone">
               <el-input v-model="editTeacherForm.phone"></el-input>
           </el-form-item>
           <el-form-item label="密码" prop="password">
               <el-input v-model="editTeacherForm.password"></el-input>
           </el-form-item>
       </el-form>
       <span slot="footer" class="dialog-footer">
           <el-button @click="editDialogVisible = false">取 消</el-button>
           <el-button type="primary" @click="editTeacherInfo">确 定</el-button>
       </span>
   </el-dialog>
 </div>
</template>
<script>
import axios from 'axios'
import titleHeader from '../../common/header'
export default {
  name: 'teacher',
  data () {
    return {
      token: '',
      query: '',
      currentPage: 1,
      pageSize: 5,
      total: 0,
      options: [],
      teacherList: [],
      editDialogVisible: false,
      addDialogVisible: false, //控制对话框的显示隐藏
      tea_cat: [],
      page: 1,
      size: 5,
      total:0,
      totalElements: 0,
      number: 1,
      content: [],
      addTeacherForm: {
          schoolName: '',
          className: '',
          phone: '',
          name: '',
          password: ''
      },
      addTeacherRules: {
          schoolName: [{required: true, message: '请输入学校名称', trigger: 'blur' }],
          className: [{required: true, message: '请输入班级名称', trigger: 'blur' }],
          phone: [{required: true, message: '请输入手机号', trigger: 'blur' }],
          name: [{required: true, message: '请输入姓名', trigger: 'blur' }],
          tea_cat: {required: true, message: '请选择学校班级', trigger: 'blur'},
          password: [{required: true, message: '请输入密码', trigger: 'blur' }]
      },
      editTeacherForm: {
          schoolId: '',
          classId: '',
          phone: '',
          name: '',
          password: '',
          classId: ''
      },
      editTeacherRules: {
          schoolName: [{required: true, message: '请输入学校名称', trigger: 'blur' }],
          className: [{required: true, message: '请输入班级名称', trigger: 'blur' }],
          phone: [{required: true, message: '请输入手机号', trigger: 'blur' }],
          name: [{required: true, message: '请输入姓名', trigger: 'blur' }],

          password: [{required: true, message: '请输入密码', trigger: 'blur' }]
      },
      searchTeacherList:[],
      common: '教师管理',
      value: '',
      options: [],
      regionName: '',
      schoolName: '',
      show: false,
      title: '您当前所在位置是'+ '区，' +'请选择区下某一学校应用此功能'
    }
  },
  created() {
    this.getTeacherList(this.page)
    this.getOptions();
    this.schoolName = window.sessionStorage.getItem('schoolName');
    this.regionName = window.sessionStorage.getItem('regionName');
    this.computedNow()
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
    handleCurrentChange(val) {
      this.page = val;
      this.getTeacherList(val)
    },
    handleClassChange(val) {
      this.classId = val;
    },
    //添加老师
    submitTeacher() {
       this.$refs.addTeacherRef.validate((valid) => {
           if(!valid) return;
           let param = new URLSearchParams();
           param.append('schoolId', this.schoolId);
           param.append('classId', this.classId);
           param.append('phone', this.addTeacherForm.phone);
           param.append('password', this.addTeacherForm.password);
           param.append('name', this.addTeacherForm.name);
           axios({
               method: 'post',
               url: '/lightspace/school/addTeacher',
               data: param
           }).then(this.handleAddTeacherSucc.bind(this))
           .catch(this.handleAddTeacherErr.bind(this))
       })
    },
    //级联选择器选择变化会触发这个函数
    handleChange() {
       this.schoolId = this.addTeacherForm.stu_cat[0];
       this.classId = this.addTeacherForm.stu_cat[1];
    },
    handleEditChange(val) {
      this.schoolId = val[0];
      this.classId = val[1];
    },
    handleAddTeacherSucc(res) {
      if(res.data.status === 10204) {
          this.$message.error(res.data.msg);
         } else if(res.data.status == 10206) {
           this.$message.error(res.data.msg);
          this.addTeacherForm.schoolName = '';
        }else if(res.status == 200){
          this.addDialogVisible = false;
          this.$message.success('添加教师成功');
          this.$refs.addTeacherRef.resetFields();
          this.value = '';
          this.getTeacherList(1);
        }
    },
    handleAddTeacherErr(err) {
        console.log(err)
    },
    // 搜索
    queryTeacher() {
      this.openFullScreen()
      if(this.query == "") {
           this.getTeacherList(1);
           this.searchTeacherList = [];
           return;
        }
        let param = new URLSearchParams();
        param.append('name', this.query);
        axios({
            method: "post",
            url: '/lightspace/school/queryTeacher',
            data: param
        }).then(this.handleQuerySucc.bind(this))
        .catch(this.handleQueryErr.bind(this))
      },
      handleQuerySucc(res) {
        this.closeFullScreen(this.openFullScreen())
        if(res.data.status === 10204) {
            this.$message.error(res.data.msg);
            this.$router.push('/login');
           } else if(res.data.status == 10208) {
            this.$message.error(res.data.msg);
            this.getTeacherList(1);
            this.searchTeacherList = [];
         }else if(res.status == 200) {
            this.$message.success('搜索成功');
            console.log(res)
            this.content = res.data.data;
          }
      },
      handleQueryErr(err) {
          console.log(err)
      },
    addTeacher() {
      this.addDialogVisible = true;
    },
    //关闭按钮
    handleClose() {
     this.addDialogVisible = false;
     this.$refs.addteacherRef.resetFields();
    },
    getTeacherList( page) {
      this.openFullScreen()
      let param = new URLSearchParams();
      param.append('page', page);
      axios({
        method: 'post',
        data: param,
        url: '/lightspace/school/teacherList'
      }).then(this.handleGetTeacherListSucc.bind(this)).catch(this.handleGetTeacherErr.bind(this))
    },
    handleGetTeacherListSucc(res) {
      this.closeFullScreen(this.openFullScreen())
      if(res.data.status == 200 && res.data.data !== '') {
       res ? res= res.data.data: '';
       this.content = res.content;
       this.totalElements = res.totalElements;
       this.size = res.size;
       this.number = res.number + 1;
       }
    },
    handleGetTeacherErr(err) {
      console.log(err)
    },
    showEditDialog (id) {
       this.editDialogVisible = true;
      let param = new URLSearchParams();
       param.append('id', id);
       axios({
           method: 'post',
           url: '/lightspace/school/editTeacher',
           data: param
       }).then(this.handleEditTeacherSucc.bind(this))
       .catch(this.handleEditTeacherErr.bind(this))
   },
   handleEditTeacherSucc(res) {
     if(res.data.status === 10204) {
         this.$message.error(res.data.msg);
        } else if(res.data.status == 200) {
         this.editTeacherForm = res.data.data;
       }
   },
   handleEditTeacherErr(err) {
       console.log(err)
   },
   //监听修改用户对话框的关闭事件
   editDialogClosed() {
      this.$refs.editTeacherRef.resetFields()
   },
   //修改保存
  editTeacherInfo() {
    this.$refs.editTeacherRef.validate((valid) => {
       if(!valid)  return;
       let param = new URLSearchParams();
       param.append('name', this.editTeacherForm.name);
       param.append('classId', this.editTeacherForm.classId);
       param.append('phone', this.editTeacherForm.phone);
       param.append('password', this.editTeacherForm.password);
       param.append('id', this.editTeacherForm.id);
       axios({
           method: 'post',
           url: '/lightspace/school/saveTeacher',
           data: param
       }).then(this.handleEditSaveTeacherSucc.bind(this))
       .catch(this.handleEditSaveTeacherErr.bind(this))
       })
   },
   handleEditSaveTeacherSucc(res) {
    if(res.data.status === 10204) {
        this.$message.error(res.data.msg);
        this.$router.push('/login');
       }else if(res.data.status == 200) {
         //隐藏编辑框
         this.editDialogVisible = false;
         //提示修改成功
         this.$message.success('更新教师信息成功');
         this.getTeacherList(this.page)
       }
   },
   handleEditSaveTeacherErr(err) {
       console.log(err)
   },
   //根据id删除学校
   async removeTeacherById(id) {
       const confirmResult = await this.$confirm('此操作将永久删除该老师, 是否继续?', '提示', {
       confirmButtonText: '确定',
       cancelButtonText: '取消',
       type: 'warning'
       }).catch(err => err)
       if(confirmResult !== 'confirm') {
           return this.$message.info('已经取消删除')
       }
       let param = new URLSearchParams();
       param.append('id', id)
       axios({
           method: 'post',
           url: '/lightspace/school/deleteTeacher',
           data: param
       }).then(this.handleDeleteTeacherSucc.bind(this))
       .catch(this.handleDeleteTeacherErr.bind(this))
       },
       handleDeleteTeacherSucc(res) {
           if(res.data.status === 10204) {
               this.$message.error(res.data.msg);
               this.$router.push('/login');
           } else if(res.data.status == 200) {
             this.$message.success('删除老师成功');
             this.getTeacherList(this.page)
            }
       },
       handleDeleteTeacherErr(err) {
           console.log(err)
       },
       //监听pageSize改变事件
       handleSizeChange(newSize) {
           this.pageSize = newSize;
           this.getTeacherList();
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
          this.options = res.data.data
        }
      },
  }
}

</script>

<style lang="stylus" scoped>
.schoolNow
   font-size: 20px
   font-weight: bold
   letter-spacing :3px
   color:#64c0ff
   margin: 0 10px
</style>
