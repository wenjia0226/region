<template>
  <div>
     <title-header :common="common" ></title-header>
     <el-card>
       <current-school></current-school>
       <class-detail></class-detail>
     </el-card>
  </div>
</template>

<script>
  import titleHeader from '../../common/header'
  import  currentSchool from '../../common/currentSchool'
  import  classDetail from './classDetail'
  export default {
    components:{
      titleHeader,
      currentSchool,
      classDetail
    },
    data() {
      return {
        common: '班级管理',
      }
    }
  }
</script>

<style>
</style>
