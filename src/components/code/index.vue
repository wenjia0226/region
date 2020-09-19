<template>
  <div>
    <title-header :common="common"></title-header>
    <el-card>
      <el-row v-show="show">
        <el-col :span="24"><div class="schoolNow">{{title}}</div></el-col>
      </el-row>
      <search-code v-show="!show"></search-code>
    </el-card>
  </div>
</template>
<script>
   import titleHeader from '../../common/header'
   import searchCode from './searchCode.vue'
   import axios from 'axios'
   export default {
     data() {
       return {
         common: '二维码下载',
         regionName: '',
         schoolName: '',
         show: false,
         title: '您当前所在位置是'+ '区，' +'请选择区下某一学校应用此功能',
       }
     },
     components:{
       titleHeader,
       searchCode
    },
    created(){
      this.schoolName = window.sessionStorage.getItem('schoolName');
      this.regionName = window.sessionStorage.getItem('regionName');
      this.computedNow()
    },
    methods: {
      computedNow() {
        if(this.schoolName == this.regionName) {
          this.show = true
        }
      },
    }
}
</script>

<style  lang="stylus" scoped>
  .schoolNow
     font-size: 20px
     font-weight: bold
     letter-spacing :3px
     color:#64c0ff
     margin: 0 10px
</style>
