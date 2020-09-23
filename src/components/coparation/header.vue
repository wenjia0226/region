<template>
  <div >
    <el-row>
      <el-col :span="24">
        <el-card shadow="always">
          <el-row class="header_wrap">
             <el-col :span="6" >
               <i class="el-icon-folder-opened"></i><span style="margin: 0 10px">{{common}}</span>
             </el-col>
             <el-col :span="18" style="text-align: right; ">
              <div style="display: inline-block;margin: 0 10px"> 当前用户：{{username}}</div>
              <el-button type="primary" size="middle" @click="logout"> 退出</el-button>
             </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  // import currentSchool from './currentSchool.vue'
  import axios from 'axios'

  export default {
    name: 'titleheader',
    props: {
      common: String
    },

    // components: {
    //   currentSchool
    // },
    data() {
      return {
        username: '',
        schoolName: '',
        schoolId: '',
        role: '',
        value: '切换学校',
        options: [],
        regionName: ''
      }
    },
    created() {
      this.username = window.sessionStorage.getItem('userName')
      this.schoolName = window.sessionStorage.getItem('schoolName')
      this.regionName = window.sessionStorage.getItem('regionName')
      this.getRelativeSchool()
    },
    methods: {
      handleShoolChange(val) {
        this.schoolId = val;
      let cur =  this.options.filter((item, index) => {
         if(item.id == val) {
           return item
         }
       })
        this.schoolName = cur[0].name;

        window.sessionStorage.setItem('schoolId', this.schoolId);
        window.sessionStorage.setItem('schoolName', this.schoolName);
        // window.sessionStorage.setItem('regionName', this.schoolName);
        //  window.sessionStorage.setItem('regionId', this.schoolId);
        this.changeCurSchool();
      },
      changeCurSchool() {
        let param = new FormData();
        param.append('schoolId', this.schoolId);
        axios({
            method: 'post',
            url: '/lightspace/school/changeSession',
            data: param
        }).then(this.handleChangeSessionSucc.bind(this)).catch((err) => {
           console.log(err)
         })
      },
      handleChangeSessionSucc(res) {
        // console.log(res)
        if(res.data.status == 200) {
          this.$router.go(0)
        }
      },
      getRelativeSchool() {
        let param = new FormData();
        axios({
            method: 'post',
            url: '/lightspace/school/getRegionSchools'
        }).then(this.handleGetRelativeSucc.bind(this)).catch((err) => {
           console.log(err)
         })
      },
      handleGetRelativeSucc(res) {
          this.options  = res.data.data;
          // console.log(this.options)
          this.options.push({
            id: 0,
            name: this.regionName,
            address:'',
            regionId: '',
            regionName: '',
            value: ''
          })
      },
      logout() {
        let param = new FormData();
        axios({
            method: 'post',
            url: '/lightspace/school/loginOut'
        }).then(this.handleLoinOutSucc.bind(this)).catch((err) => {
           console.log(err)
         })
      },
      handleLoinOutSucc(res) {
        if(res.data.status == 200) {
          this.$router.push('/login')
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
    .header_wrap
      font-size: 16px;
      font-weight: bold;
      line-height: 40px;
      height: 40px

</style>
