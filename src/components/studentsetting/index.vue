<template>
  <div>
     <title-header :common="common" ></title-header>
     <el-card>
       <el-row :gutter="20">
         <el-col :span="18">
            <current-school></current-school>
         </el-col>
         <el-col :span="2">
           <el-button type="success" @click="showAddDialog" v-show="!show">新增学生</el-button>
         </el-col>
         <el-col :span="2" >
            <el-button type="success" @click="handdleBatch"  v-show="!show">批量导入</el-button>
         </el-col>
       </el-row>
       <studentSearch @recordList="handleChange"  v-show="!show"></studentSearch>
       <student-content ref="stuContent"  v-show="!show"></student-content>
     </el-card>
     <!-- 批量导入 -->
     <el-dialog :visible.sync="showBatchImport" ref="upload" width="30%" center :before-close="handleFileClose">
       <el-row>
         <el-col :span="12">
           <a class="download" href="http://www.guangliangkongjian.com/download/学生导入模板.xlsx">下载模板</a>
           <!-- <el-button @click="DownLoadTemplate" type="primary" size="small">下载模板</el-button> -->
         </el-col>
         <el-col :span="12">
           <el-upload
             :data="pdfData"
             class="upload-demo"
             ref="upload"
             action="/lightspace/school/studentExcel"
             :before-upload="beforeUpload"
             accept=".xlsx"
             show-file-list
             :on-change="changeUpload"
             :on-success="handleSuccess"
             :file-list="fileList"
             multiple
             :auto-upload="false">
             <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
             <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
             <div slot="tip" class="el-upload__tip">只能上传.xlsx文件，且不超过500kb</div>
           </el-upload>
         </el-col>
       </el-row>
     </el-dialog>
      <!-- 新增学生 -->
    <!-- 添加学生 -->
      <el-dialog title="添加学生" :visible.sync="addStudentVisible" width="50%" :before-close="handleClose">
          <el-form :model="addStudentForm" :rules="addStudentRules" ref="studentFormRef" label-width="120px" >
          <el-form-item label="所属学校班级" prop="region">
             <el-select v-model="value" placeholder="请选择"  @change="handleClassChange">
                 <el-option
                   v-for="item in options"
                   :key="item.id"
                   :label="item.className"
                   :value="item.id">
                 </el-option>
               </el-select>
          </el-form-item>
          <el-form-item label="学生姓名" prop="name">
              <el-input v-model="addStudentForm.name" clearable></el-input>
           </el-form-item>
           <el-form-item label="性别" prop="gender">
                <el-radio v-model="addStudentForm.gender" size="medium" border :label="0">男</el-radio>
                <el-radio v-model="addStudentForm.gender" size="medium" border :label="1">女</el-radio>
           </el-form-item>
           <el-form-item label ="出生日期" prop="birthday">
              <el-date-picker
               v-model="addStudentForm.birthday"
               type="date"
               @change="dateChange"
               placeholder="选择日期">
              </el-date-picker>
           </el-form-item>
           <el-form-item label="坐姿高度(厘米)" prop="sittingHeight">
                <el-input v-model="addStudentForm.sittingHeight" clearable></el-input>
           </el-form-item>
           <el-form-item label="身高(厘米)" prop="height">
                <el-input v-model="addStudentForm.height" clearable></el-input>
           </el-form-item>
           <el-form-item label="体重(KG)" >
                <el-input v-model="addStudentForm.weight" clearable></el-input>
           </el-form-item>
           <el-form-item label="是否矫正" >
                    <el-radio v-model="addStudentForm.correct" size="medium" border  :label="1">已矫正</el-radio>
                    <el-radio v-model="addStudentForm.correct" size="medium" border :label="0">未校正</el-radio>
           </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
              <el-button @click="handleClose">取 消</el-button>
              <el-button type="primary" @click="sumitAddStudent" >确 定</el-button>
          </span>
      </el-dialog>
  </div>
</template>
<script>
  import titleHeader from '../../common/header'
  import  currentSchool from '../../common/currentSchool'
  import studentSearch from './studentSearch'
  import studentContent from './studentContent'
  import axios from 'axios'
  export default {
    created() {
      this.classId = window.sessionStorage.getItem('bindclassId');
      this.className = window.sessionStorage.getItem('bindclassName')
      this.getOptions();
      this.schoolName = window.sessionStorage.getItem('schoolName');
      this.regionName = window.sessionStorage.getItem('regionName');
      this.computedNow()
    },
    components:{
      titleHeader,
      currentSchool,
      studentSearch,
      studentContent
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
        common: '学生管理',
        addStudentVisible: false,
        studentInfo: [],
        stu_cat: [],
        value: '',
        showBatchImport: false,
        fileList: [],//此数组中存入所有提交的文档信息
        pdfData: {
            file: '',
            token: ''
        },
        addStudentForm: {
            "sittingHeight":'',
            "correct": '',
            "gender":'',
            "height":'',
            "weight": '',
            "name":"",
            "birthday": '',
             region: ''
        },
        className: '',
        addStudentRules: {
            name:  { required: true, message: '请输入姓名', trigger: 'blur' },
            birthday: {type: 'date', required: true, message: '请选择日期', trigger: 'change'},
            correct:  { required: true, type: 'number',message: '请输入是否矫正', trigger: 'blur' },
            gender:  { required: true,type: 'number', message: '请输入性别', trigger: 'blur' },
            height:  { required: true, validator: valiNumberPass1, message: '请输入身高(cm)', trigger: 'blur' },
            weight:  { required: true,validator: valiNumberPass1, message: '请输入体重(kg)', trigger: 'blur' },
            sittingHeight:  { required: true,validator: valiNumberPass1, message: '请输入坐姿高度(cm)', trigger: 'blur' },
            region:{ required: true, message: '请选择学校班级', trigger: 'change' }
        },
        options: [],
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
      handleFileClose() {
        this.showBatchImport = false;
         this.$refs.upload.clearFiles();
      },
      handdleBatch() {
        this.showBatchImport = true;
      },
      changeUpload(file, fileList) {
       if(fileList.length == 2)  {
         this.fileList = fileList.slice(1,2);
       }
      },
      //请求参数传递
      beforeUpload(file) {
        this.pdfData.file = file;
        this.pdfData.token = this.token;
       },
       submitUpload() {
         this.$refs.upload.submit();
         this.showBatchImport = false;
         this.loading = true;
       },
       handleSuccess(res, file, fileList) {
          this.loading = false;
        if(res.status == 10215) {
          this.$message.error(res.msg);
          this.fileList = [];
          return;
        }else if(res.status == 200) {
          this.$message.success(res.msg);
          this.fileList = [];
        }
       },
      // 下载模板  post 方式，现在没用
       DownLoadTemplate() {
         let param = new URLSearchParams();
         param.append('token' , this.token);
         axios({
           method:"post",
           data: param,
           url:'/lightspace/downloadStudent',
           responseType: "blob"
         }).then(this.handleGetDownLoadSuccss.bind(this)).catch(this.hanadleGetDownLoadErr.bind(this))
       },
       handleGetDownLoadSuccss(res) {
         this.download(res.data)
       },
       // 下载文件
      download (data) {
         if (!data) return;
         let url = window.URL.createObjectURL(new Blob([data]))
         let link = document.createElement('a')
         link.style.display = 'none'
         link.href = url
         link.setAttribute('download', '数据检查导入模板.xlsx')
         document.body.appendChild(link);
         link.click()
        },
       hanadleGetDownLoadErr(err) {
         console.log(err)
       },
      handleChange(classId, name) {
         this.$refs.stuContent.getInfo(classId, name)
      },
      showAddDialog() {
        this.addStudentVisible = true;
      },
      handleClassChange(val) {
        this.classId = val;
      },
      //孩子生日
      dateChange(val) {
        if(val) {
          this.startTime = val.toString().split(",")[0]
          this.endTime = val.toString().split(",")[1]
          this.birthday = val.toLocaleString().split(' ') [0];
        }
      },
      //关闭按钮
      handleClose() {
         this.addStudentVisible = false;
         this.$refs.studentFormRef.resetFields();
      },
      //添加学生
      sumitAddStudent() {
        this.$refs.studentFormRef.validate((valid) => {
          if(!valid) return this.$message.error('验证失败');
          let param = new FormData();
          param.append('classId', this.classId);
          param.append('sittingHeight',this.addStudentForm.sittingHeight)
          param.append('correct', this.addStudentForm.correct)
          param.append('gender', this.addStudentForm.gender)
          param.append('height', this.addStudentForm.height)
          param.append('weight', this.addStudentForm.weight)
          param.append('name', this.addStudentForm.name)
          param.append('birthday', this.birthday);
          axios({
              method: 'post',
              url: '/lightspace/school/addStudent',
              data: param
          }).then(this.handleAddStuSucc.bind(this)).catch((err) => {console.log(err)})
          })
      },
      handleAddStuSucc(res) {
         if(res.data.status === 10204) {
             this.$message.error(res.data.msg);
             this.$router.push('/login');
         } else if(res.data.status == 200) {
            this.addStudentVisible = false;
            this.$message.success('添加学生信息成功');
            this.$refs.studentFormRef.resetFields();
            this.$refs.stuContent.getInfo();
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
