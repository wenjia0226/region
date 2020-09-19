<template>
  <div>
    <el-row class="searchBox" :gutter="20" v-if="show">
      <el-col :span="2"><div class="name">姓名</div></el-col>
      <el-col :span="4">
        <el-input v-model="inputName" clearable @input ="handleInputName" placeholder="姓名"></el-input>
      </el-col>
      <el-col :span="2"> <div class="name">班级选择</div></el-col>
      <el-col :span="4">
        <el-select v-model="value" clearable placeholder="请选择"  @change="handleClassChange">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.className"
              :value="item.id">
            </el-option>
          </el-select>
      </el-col>
     <el-col :span="2">
       <el-button type="primary" @click="searchStudent">查询</el-button>
     </el-col>
     <el-col :span="2">
       <el-button type="primary" @click="handleReset">重置</el-button>
     </el-col>
    </el-row>
  </div>
</template>
<script>
  import axios from 'axios'

  export default{
    created() {
      this.classId = window.sessionStorage.getItem('bindclassId');
      this.className = window.sessionStorage.getItem('bindclassName')
      this.getOptions()
    },
    data() {
      return {
        options: [],
        value: '',
        inputName: '',
        classId: 0,
        className: '',
        show: true
      }
    },
    methods: {
      handleReset() {
        this.inputName = '';
        this.classId  =  0;
        this.value = '';
        this.$emit('recordList', this.classId, this.inputName)
      },
      handleInputName(e) {
        this.inputName = e
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
            this.searchStudent()
          }else {
            this.options = res.data.data;
          }
        }
      },
      searchStudent() {
          this.$emit('recordList', this.classId, this.inputName)
      },

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
</style>
