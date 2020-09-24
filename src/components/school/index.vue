<template>
  <div>
    <title-header :common="common" ></title-header>
    <el-card>
      <el-row style="margin: 20px 0">
        <el-col :span="2">
          <el-button type="success" @click="addSchool" >新增学校</el-button>
        </el-col>
      </el-row>
      <!-- 内容 -->
     <el-table :data="this.content" border  stripe style="width: 100%">
               <el-table-column label="姓名" prop="name"></el-table-column>
              <el-table-column label="所属区" prop="regionName"></el-table-column>
              <el-table-column label="地址" prop="address"></el-table-column>
              <el-table-column label="操作">
                  <template slot-scope="scope">
                     <el-button type="primary" size="middle" icon="el-icon-edit" @click="showEditDialog(scope.row.id)"></el-button>
                  </template>
              </el-table-column>
              <el-table-column label="操作">
                  <template slot-scope="scope">
                     <el-button type="danger"  size="middle" icon="el-icon-delete" @click ="removeSchoolById(scope.row.id)" ></el-button>
                  </template>
              </el-table-column>
            </el-table>
            <!-- 分页功能 -->
            <el-pagination
              background
              :current-page="this.number"
              @current-change="handleCurrentChange"
              layout="prev, pager, next"
              :page-size ="this.size"
              :total="this.totalElements">
            </el-pagination>
          </el-card>
          <!-- 添加对话框 -->
          <el-dialog title="添加学校" :visible.sync="addDialogVisible" width="50%" :before-close="handleClose">
              <el-form :model="addSchoolForm" :rules="addSchoolRules" ref="addSchoolRef" label-width="120px">
                  <el-form-item label="学校名称" prop="name" >
                      <el-input v-model="addSchoolForm.name"></el-input>
                  </el-form-item>
                  <el-form-item label="学校地址" prop="address" >
                      <el-input v-model="addSchoolForm.address"></el-input>
                  </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                  <el-button @click="addDialogVisible = false">取 消</el-button>
                  <el-button type="primary" @click="submitSchool">确 定</el-button>
              </span>
          </el-dialog>
          <!-- 修改用户对话框 -->
          <el-dialog title="修改店员信息" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
            <el-form :model="editSchoolForm" :rules="editSchoolRules" ref="editSchoolRef" label-width="120px">
                <el-form-item label="学校名称" prop="name" >
                    <el-input v-model="editSchoolForm.name"></el-input>
                </el-form-item>
                <el-form-item label="学校地址" prop="address" >
                    <el-input v-model="editSchoolForm.address"></el-input>
                </el-form-item>
            </el-form>
     		 <span slot="footer" class="dialog-footer">
     			 <el-button @click="editDialogVisible = false">取 消</el-button>
     			 <el-button type="primary" @click="editSchoolInfo">确 定</el-button>
     		 </span>
         </el-dialog>
        </div>
     </template>

     <script>
       import axios from 'axios'
       import titleHeader from '../coparation/header'
       export default {
         components: {
           titleHeader
         },
         data () {
           return {
             common: '学校管理',
             coparationId: '',
             query: '',
             value: '',

             options: [],
             SchoolList: [],
             content: [],
             editDialogVisible: false,
             addDialogVisible: false, //控制对话框的显示隐藏
             tea_cat: [],
             addSchoolForm: {
                 name: '',
                 address: ''
             },
             page: 1,
             size: 5,
             total:0,
             totalElements: 0,
             number: 1,
             addSchoolRules: {
                 name: [{required: true, message: '请输入学校名称', trigger: 'blur' }],
                 address: {required: true, message: '请输入学校地址', trigger: 'blur'},
             },
             editSchoolForm: {
               name: '',
               address: ''
             },
             editSchoolRules: {
                name: [{required: true, message: '请输入学校名称', trigger: 'blur' }],
                address: {required: true, message: '请输入学校地址', trigger: 'blur'},
             },
             searchSchoolList:[]
           }
         },
         created() {
           this.getSchoolList();
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
           handleSelectCoparation(val) {
             this.coparationId = val;
             this.value = val;
           },
           handleEditChange(val) {
             this.editSchoolForm.partnershipId = val;
           },
           //添加店员
           submitSchool() {
              this.$refs.addSchoolRef.validate((valid) => {
                  if(!valid) return;
                  let param = new URLSearchParams();
                  param.append('name', this.addSchoolForm.name);
                  param.append('address', this.addSchoolForm.address);
                  axios({
                      method: 'post',
                      url: '/lightspace/region/addSchool',
                      data: param
                  }).then(this.handleAddSchoolSucc.bind(this))
                  .catch(this.handleAddSchoolErr.bind(this))
              })
           },
           handleAddSchoolSucc(res) {
             if(res.data.status === 10204) {
                 this.$message.error(res.data.msg);
                } else if(res.data.status == 10206) {
                  this.$message.error(res.data.msg);
               }else if(res.status == 200){
                 this.addDialogVisible = false;
                 this.$message.success('添加学校成功');
                 this.$refs.addSchoolRef.resetFields();
                 this.getSchoolList();
               }
           },
           handleAddSchoolErr(err) {
               console.log(err)
           },
           addSchool() {
             this.addDialogVisible = true;
           },
           //关闭按钮
           handleClose() {
            this.addDialogVisible = false;
            this.$refs.addSchoolRef.resetFields();
           },
           getSchoolList() {
             this.openFullScreen()
             let param = new URLSearchParams();
             param.append('page', this.page)
             axios({
               method: 'post',
               data: param,
                url: '/lightspace/region/schoolList'
             }).then(this.handleGetSchoolListSucc.bind(this)).catch(this.handleGetSchoolErr.bind(this))
           },
           handleGetSchoolListSucc(res) {
              //console.log(res)
             this.closeFullScreen(this.openFullScreen())
             if(res.data.status == 200 && res.data.data !== '') {
              res ? res= res.data.data: '';
              this.content = res.content;
              this.totalElements = res.totalElements;
              this.size = res.size;
              this.number = res.number + 1;
              }
           },
           handleGetSchoolErr(err) {
             console.log(err)
           },
          showEditDialog (id) {
              this.id = id;
              this.editDialogVisible = true;
             let param = new URLSearchParams();
              param.append('id', this.id);
              axios({
                  method: 'post',
                  url: '/lightspace/region/editSchool',
                  data: param
              }).then(this.handleEditSchoolSucc.bind(this))
              .catch(this.handleEditSchoolErr.bind(this))
          },
          handleEditSchoolSucc(res) {
            if(res.data.status === 10204) {
                this.$message.error(res.data.msg);
               } else if(res.data.status == 200) {
                this.editSchoolForm = res.data.data;
              }
          },
          handleEditSchoolErr(err) {
              console.log(err)
          },
          //监听修改用户对话框的关闭事件
          editDialogClosed() {
             this.$refs.editSchoolRef.resetFields()
          },
          //修改保存
         editSchoolInfo() {
           this.$refs.editSchoolRef.validate((valid) => {
              if(!valid)  return;
              let param = new URLSearchParams();
              param.append('id', this.id);
               param.append('name', this.editSchoolForm.name);
              param.append('address', this.editSchoolForm.address);
              axios({
                  method: 'post',
                  url: '/lightspace/region/saveSchool',
                  data: param
              }).then(this.handleEditSaveSchoolSucc.bind(this))
              .catch(this.handleEditSaveSchoolErr.bind(this))
              })
          },
          handleEditSaveSchoolSucc(res) {
           if(res.data.status === 10204) {
               this.$message.error(res.data.msg);
              }else if(res.data.status == 200) {
                //隐藏编辑框
                this.editDialogVisible = false;
                //提示修改成功
                this.$message.success('更新信息成功');
                this.getSchoolList()
              }
          },
          handleEditSaveSchoolErr(err) {
              console.log(err)
          },
          //根据id删除学校
          async removeSchoolById(id) {
              const confirmResult = await this.$confirm('此操作将永久删除该店员, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
              }).catch(err => err)
              if(confirmResult !== 'confirm') {
                  return this.$message.info('已经取消删除')
              }
              let param = new URLSearchParams();
              param.append('id', id);
              axios({
                  method: 'post',
                  url: '/lightspace/region/deleteSchool',
                  data: param
              }).then(this.handleDeleteSchoolSucc.bind(this))
              .catch(this.handleDeleteSchoolErr.bind(this))
              },
              handleDeleteSchoolSucc(res) {
                  if(res.data.status === 10204) {
                      this.$message.error(res.data.msg);
                  } else if(res.data.status == 200) {
                    this.$message.success('删除学校成功');
                    this.getSchoolList();
                  }
              },
              handleDeleteSchoolErr(err) {
                  console.log(err)
              },

              //监听页码值改变事件
              handleCurrentChange(val) {
                this.page = val;
                this.getSchoolList()
              }
         }
       }
     </script>

     <style>
     </style>
