<template>
    <div>
          <!-- 面包屑导航区域 -->

        <!-- 卡片视图 -->
        <el-card>
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-input placeholder="输入账号"   v-model="query" clearable @clear="searchAccount">
                    <el-button slot="append" icon="el-icon-search"  @click="searchAccount"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="6">
                    <el-button type="primary" @click="showAddCountDiaglog">新增账号</el-button>
                </el-col>
            </el-row>
              <!-- 用户列表 -->
            <el-table
             :data="userList" border highlight-current-row   ref="table" stripe style="width: 100%" v-show="!this.searchAccountList.length">
            <el-table-column label="登录账号" prop="loginName"></el-table-column>
            <el-table-column label="姓名" prop="name"></el-table-column>
            <el-table-column label="创建时间" prop="genTime"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="danger"  size="middle" icon="el-icon-delete" @click="removeUserById(scope.row.id)"></el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary"  size="middle"  @click="showAddSchoolDialog(scope.row.id)" >添加集团从属学校</el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template slot-scope="scope">
                <el-button type="text" @click="toogleExpand(scope.row)">查看从属学校</el-button>
              </template>
            </el-table-column>
            <el-table-column type="expand" width="1">
              <template slot-scope="props">
               <el-table  border :data="props.row.children" stripe>
                  <el-table-column align="center"label="学校" prop="name"></el-table-column>
                   <el-table-column align="center"label="所属区" prop="regionName"></el-table-column>
                  <el-table-column  align="center" label="操作">
                    <template slot-scope="scope">
                       <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="deleteSchool(scope.row.id)"></el-button>
                    </template>
                  </el-table-column>
               </el-table>
               </template>
            </el-table-column>
            </el-table>
            <!-- 搜索列表 -->
            <el-table :data="searchAccountList" border  stripe style="width: 100%" v-show="this.searchAccountList.length">
                <el-table-column type="index"></el-table-column>
                <el-table-column label="登录账号" prop="loginName"></el-table-column>
                <el-table-column label="姓名" prop="name"></el-table-column>
                 <el-table-column label="角色" prop="roleName"></el-table-column>
                <el-table-column label="创建时间" prop="genTime"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="danger"  size="middle" icon="el-icon-delete" @click="removeUserById(scope.row.id)"></el-button>
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
        <el-dialog title="添加从属学校"  :visible.sync="showAddSchool" width="50%" :before-close="handleShoolClose">
          <el-form :model="addSchoolForm" label-width="120px">
               <el-form-item label="学校选择" >
                   <el-select v-model="school" placeholder="请选择" @change="handleAddSchool">
                      <el-option
                        v-for="item in schoolList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
               </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
              <el-button @click="handleShoolClose">取 消</el-button>
              <el-button type="primary" @click="submitAddSchool" >确 定</el-button>
          </span>
      </el-dialog>
               <!-- 添加角色对话框 -->
              <el-dialog title="添加账号"  :visible.sync="addAccountDialogVisible" width="50%"  :before-close="handleClose">
                 <el-form :model="addAccountForm" :rules="addAccountRules" ref="accountFormRef" label-width="120px">
                  <el-form-item label="姓名" prop="name" >
                      <el-input v-model="addAccountForm.name" clearable></el-input>
                  </el-form-item>
                  <el-form-item label="登录账号" prop="loginName">
                      <el-input v-model="addAccountForm.loginName" clearable></el-input>
                  </el-form-item>
                  <el-form-item label="登录密码" prop="password">
                      <el-input v-model="addAccountForm.password" clearable></el-input>
                  </el-form-item>
                  <el-form-item label="学校选择" >
                      <el-select v-model="accountSchoolId" placeholder="请选择" @change="handleSchoolAccount">
                         <el-option
                           v-for="item in schoolList"
                           :key="item.id"
                           :label="item.name"
                           :value="item.id">
                         </el-option>
                       </el-select>
                  </el-form-item>
                 </el-form>
                  <span slot="footer" class="dialog-footer">
                      <el-button @click="handleClose">取 消</el-button>
                      <el-button type="primary" @click="submitAccount" >确 定</el-button>
                  </span>
              </el-dialog>

    </div>
</template>
<script>
import axios from 'axios'
    export default {
    created() {
         this.getUserList();
        this.getAllSchool();
    },
     data() {
         return {
            token: '',
            page: 1,
            totalElements: 0,
            number: 1,
            currentPage: 1,
            pageSize: 10,
            total: 0,
            size: 10,
            addAccountDialogVisible: false,
            roleList: [],  //角色列表
            query: '',
            searchAccountList: [],
            showAddSchool: false,
            comschoolId: '',
            comroleId: '',
            school: '',
            schoolList: [],
            addSchoolForm: {
              name: '',
              loginName: '',
              password: ''
            },
            addAccountForm: {
               name: '',
               loginName: '',
               password: '',
               wechatName: '',
               role: '', //角色下拉框默认选中
               selectedOptions: [],
               schoolOptions: [],
               id: '',
               province: '',
               city: '',
               area: ''
           },
           addSchoolRules: {
             name: [{required: true, message: '请输入所属人', trigger: 'blur' }],
             loginName: [{required: true, message: '请输入账号', trigger: 'blur' }],
             password: [{required: true, message: '请输入密码', trigger: 'blur' }],
           },
           addAccountRules: {
                name: [{required: true, message: '请输入所属人', trigger: 'blur' }],
                loginName: [{required: true, message: '请输入账号', trigger: 'blur' }],
                password: [{required: true, message: '请输入密码', trigger: 'blur' }],
                selectedOptions: [{required: true, message: '请选择所属学校班级', trigger: 'change' }],
                schoolOptions:  [{required: true, message: '请选择所属学校', trigger: 'change' }],
                role:  [{required: true, message: '请选择角色', trigger: 'change' }],
                province: [{required: true, message:'请选择省', trigger: 'blur'}],
                city: [{required: true, message:'请选择市', trigger:'blur'}],
                area: [{required: true, message:'请选择区', trigger: 'blur'}]
           },
            cateProps: {
               label: 'name', //看到的是哪个属性
               value: 'id', // 选中的是谁的值
               children: 'children' //哪个属性实现父子节点嵌套
            },
            roleId: '', // 选中角色的id,
            schoolId: '',
            classId: '',
            userList: [], // 用户列表
            currentPage: 1,
            pageSize: 5,
            show: true,
            options: [], //级联绑定的数据
            schoolOptions: [],
            sheng: [],
            city: [],
            area: [],
            shengId: '',
            cityId: '',
            areaId: '',
            accountSchoolId: ''

         }
     },
     methods: {
       toogleExpand(row) {
          let $table = this.$refs.table;
         this.userList.map((item) => {
            if (row.id != item.id) {
             $table.toggleRowExpansion(item, false)
            }
         })
          $table.toggleRowExpansion(row)
          this.roleId = row.id

       },
       handleSchoolAccount(val) {

         this.accountSchoolId= val;
       },
       //根据id删除学校
       async deleteSchool(id) {
       const confirmResult = await this.$confirm('此操作将接触该学校账号绑定, 是否继续?', '提示', {
       confirmButtonText: '确定',
       cancelButtonText: '取消',
       type: 'warning'
       }).catch(err => err)
       if(confirmResult !== 'confirm') {
           return this.$message.info('已经取消删除')
       }

       let param = new URLSearchParams();
       param.append('schoolId', id);
       param.append('userId', this.roleId);
       axios({
           method: 'post',
           url: '/lightspace/region/deleteUserSchool',
           data: param
       }).then(this.handleDeleteUserShoolSucc.bind(this))
       .catch((err) => {console.log(err)})
       },
       handleDeleteUserShoolSucc(res) {
           if(res.data.status === 10204) {
               this.$message.error(res.data.msg);
           } else if(res.data.status == 200) {
             this.$message.success('删除学校成功');
             this.getUserList();
           }

       },
       showAddSchoolDialog(id) {
         this.comroleId = id;
         this.showAddSchool = true;
       },
       handleAddSchool(val) {
        this.comschoolId = val;
       },
       handleShoolClose() {
         this.school = '';
         this.comschoolId = '';
         this.showAddSchool = false;
       },
       submitAddSchool() {
         let param = new FormData();
         param.append('schoolId', this.comschoolId);
         param.append('userId', this.roleId);
         axios({
           method: 'post',
           data: param,
           url: '/lightspace/region/addUserSchool'
         }).then(this.handleAddComSchool.bind(this)).catch((err) => {console.log(err)})
       },
       handleAddComSchool(res) {
         if(res.data.status == 200) {
           this.$message.success('恭喜您' + res.data.msg);
           this.showAddSchool = false;
           this.getUserList()
         }else if(res.data.status == 10206) {
           this.$message.error(res.data.msg);
           this.showAddSchool = false;
         }
       },
       clickTable(row,index,e){
          this.nowGrade = row.name;
          this.currentRow = row;
          this.$refs.refTable.toggleRowExpansion(row)
        },
       //监听页码值改变事件
       handleCurrentChange(val) {
         this.page = val;
         this.getUserList();
       },
       searchAccount() {
          if(this.query == "") {
             this.getUserList();
             this.searchAccountList = [];
             return;
          }
            let param = new URLSearchParams();
            param.append('name', this.query);
            axios({
                method: "post",
                url: '/lightspace/queryUser',
                data: param
            }).then(this.handleQuerySucc.bind(this))
            .catch(this.handleQueryErr.bind(this))
        },
       handleQuerySucc(res) {
         if(res.data.status === 10204) {
             this.$message.error(res.data.msg);
             this.$router.push('/login');
         } else if(res.data.status == 10213) {
             this.$message.error(res.data.msg);
             this.getUserList();
             this.searchAccountList = [];
          }else if(res.data.status == 200) {
             this.$message.success('搜索成功');
             this.searchAccountList = res.data.data;
           }
       },
        handleQueryErr(err) {
            console.log(err)
        },
       //关闭按钮
         handleClose() {
          this.addAccountDialogVisible = false;
          this.$refs.accountFormRef.resetFields();
          this.accountSchoolId = ''

         },

         getUserList() {
             let param = new URLSearchParams();
             param.append('page', this.page);
             axios({
                 method: 'post',
                 url: '/lightspace/region/userList',
                 data: param
             }).then(this.handleGetUserListSucc.bind(this))
             .catch(this.handleGetUserListErr.bind(this))
         },
         handleGetUserListErr(err) {
             console.log(err)
         },
         handleGetUserListSucc(res) {
           //console.log(res)
             if(res.data.status === 10204) {
                this.$message.error(res.data.msg);
                this.$router.push('/login');
             } else if(res.data.status == 200) {
                 res ? res= res.data.data: '';
                 this.userList = res.content;
                 this.totalElements = res.totalElements;
                 this.size = res.size;
                 this.number = res.number + 1;
             }

         },
         showAddCountDiaglog() {
            this.addAccountDialogVisible = true
             // let param = new URLSearchParams();
             // axios({
             //     method: 'post',
             //     url: '/lightspace/roleList',
             //     data: param
             // }).then(this.handleGetRoleListSucc.bind(this))
             // .catch(this.handleGetRoleListErr.bind(this))


         },
         handleGetRoleListSucc(res) {
            if(res.data.status === 10204) {
                this.$message.error(res.data.msg);

            } else if(res.data.status == 200) {
               this.roleList = res.data.data;
               this.addAccountDialogVisible = true
            }
         },
         handleGetRoleListErr(err) {
             console.log(err)
         },
         submitAccount() {
             this.$refs.accountFormRef.validate((valid) => {
                if(!valid) return this.$message.error('验证失败');
                let param = new URLSearchParams();
                param.append('loginName' ,this.addAccountForm.loginName);
                param.append('name', this.addAccountForm.name);
                param.append('password', this.addAccountForm.password);
                param.append('schoolId', this.accountSchoolId)
                axios({
                    method: 'post',
                    data: param,
                    url: '/lightspace/region/addUser'
                }).then(this.handleAddUserSucc.bind(this))
                .catch(this.handleAddUserErr.bind(this))
                })
         },
         handleAddUserSucc(res) {
           console.log(res.data.status, 999)
           if(res.data.status === 10204) {
               this.$message.error(res.data.msg);
           } else if(res.data.status == 10205) {
               this.$message.error(res.data.msg);
               this.addAccountForm.loginName = '';
             }else if(res.data.status == 200) {
               this.$message.success('添加用户成功');
               this.addAccountDialogVisible  = false;
               this.$refs.accountFormRef.resetFields();
               this.getUserList();
             }
         },
         handleAddUserErr(err) {
             console.log(err)
         },
         handleChange(item) {
          this.addAccountForm.selectedOptions = item;
          this.schoolId = item[0];
          this.classId = item[1];
         },
         handleSchoolChange(item) {
          this.addAccountForm.selectedOptions = item;
          this.schoolId = item[0];
          this.classId = '';
         },
         getAllSchool() {
           let param = new FormData();
           axios({
             method: 'post',
             data:param,
             url: '/lightspace/school/getRegionSchools'
           }).then((res) => {
             // console.log(res)
             if(res.data.data) {
                this.schoolList = res.data.data;
             }
           }).catch((err)=> {console.log(err)})
         },

        //监听pageSize改变事件
        handleSizeChange(newSize) {
            this.pageSize = newSize
            this.getUserList();
        },

        //删除用户
        async removeUserById(id) {
            const confirmResult = await this.$confirm('此操作将永久删除该学校, 是否继续?', '提示', {
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
                url: '/lightspace/region/deleteUser',
                data: param
            }).then(this.handleDeleteUserSucc.bind(this))
            .catch(this.handleDeleteUserErr.bind(this))
            },
            handleDeleteUserSucc(res) {
                if(res.data.status === 10204) {
                   this.$message.error(res.data.msg);
                   this.$router.push('/login');
                } else if(res.data.status == 200) {
                  this.$message.success('删除用户成功');
                  this.getUserList()

                }

            },
            handleDeleteUserErr(err) {
                console.log(err)
            }
     }
}
</script>
<style lang="stylus" scoped>

</style>
