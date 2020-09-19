<template>
  <div>
    <title-header :common="common" ></title-header>
    <el-card>
      <el-row>
        <el-col :span="24"><div class="schoolNow" v-if="showSearch">{{title}}</div></el-col>
      </el-row>
      <div v-if="!showSearch">
        <search @recordList="handleChange" ref ="search" v-if="show"></search>
      </div>
      <card  v-if="!showSearch" ref="cardmenu" @showSearch="handleShow" ></card>
    </el-card>
  </div>
</template>

<script>
  import titleHeader from '../../common/header'
  import search from './search'
  import card from './card'
  export default {
    components:{
      titleHeader,
      search,
      card
      },
      created() {
        this.schoolName = window.sessionStorage.getItem('schoolName');
        this.regionName = window.sessionStorage.getItem('regionName');
        this.computedNow()
      },
    data() {
      return {
         common: '档案管理',
         show: true,
         regionName: '',
         schoolName: '',
         title: '您当前所在位置是'+ '区，' +'请选择区下某一学校应用此功能',
         showSearch: false
      }
    },
    methods: {
      computedNow() {
        if(this.schoolName == this.regionName) {
          this.showSearch = true
        }
      },
      handleChange(classId, name) {
        this.$refs.cardmenu.getInfo(classId, name)
      },
      handleShow(val) {
        this.show = val;
      }
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
