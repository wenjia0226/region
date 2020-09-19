<template>
   <el-container class="home-container">
      <el-aside :width="isCollapse ? '64px': '200px'" style="min-height: 100vh" >
         <el-menu
         :default-active="this.$route.path"
         class="el-menu-vertical-demo"
         background-color="#333744"
         text-color="#fff"
         active-text-color="#409eff"
         router
         :unique-opened="true"
         :collapse="isCollapse"
         :collapse-transition="false" >
                 <div class="toggle-button" @click="toggleCollapse"> |||</div>
                 <el-menu-item index="/first">
                   <i class="el-icon-set-up"></i>
                   <span slot="title">首页</span>
                 </el-menu-item>
                 <el-submenu index="/studentsetting">
                   <template slot="title">
                     <i class="el-icon-s-custom"></i>
                     <span>学生管理</span>
                   </template>
                   <el-menu-item-group>
                     <el-menu-item index="/studentsetting">
                       <i class="el-icon-star-on"></i>
                       <span slot="title">学生管理</span>
                     </el-menu-item>
                     <el-menu-item index="/classsetting" v-if="this.role !== 'teacher'">
                       <i class="el-icon-star-on"></i>
                       <span slot="title">班级管理</span>
                    </el-menu-item>
                    <el-menu-item index="/code">
                       <i class="el-icon-c-scale-to-original"></i>
                       <span slot="title">二维码下载</span>
                    </el-menu-item>
                   </el-menu-item-group>
                 </el-submenu>
                 <el-menu-item index="/teacher" v-if="this.role !== 'teacher'">
                   <i class="el-icon-s-check"></i>
                   <span slot="title">教师管理</span>
                 </el-menu-item>
                 <el-menu-item index="/recordsetting">
                   <i class="el-icon-document"></i>
                   <span slot="title">档案管理</span>
                 </el-menu-item>
                 <el-menu-item index="/analysis">
                   <i class="el-icon-medal"></i>
                   <span slot="title">数据分析</span>
                 </el-menu-item>
                 <el-submenu index="/online">
                   <template slot="title">
                     <i class="el-icon-s-custom"></i>
                     <span>智能排座</span>
                   </template>
                   <el-menu-item-group>
                     <el-menu-item index="/online">
                        <i class="el-icon-star-on"></i>
                        <span slot="title">在线排座</span>
                     </el-menu-item>
                     <el-menu-item index="/seatQuery">
                       <i class="el-icon-star-on"></i>
                       <span slot="title">座位查询</span>
                     </el-menu-item>
                   </el-menu-item-group>
                 </el-submenu>
                 <el-submenu index="/nocheck" v-if="this.role == 'teacher'">
                   <template slot="title">
                     <i class="el-icon-s-custom"></i>
                     <span>教师提醒</span>
                   </template>
                   <el-menu-item-group>
                     <el-menu-item index="/nocheck">
                        <i class="el-icon-view"></i>
                        <span slot="title">未检测</span>
                     </el-menu-item>
                     <el-menu-item index="/eyedown">
                       <i class="el-icon-star-on"></i>
                       <span slot="title">视力下降</span>
                     </el-menu-item>
                     <el-menu-item index="/noclock">
                       <i class="el-icon-bell"></i>
                       <span slot="title">未打卡</span>
                     </el-menu-item>
                   </el-menu-item-group>
                 </el-submenu>
                 <el-menu-item index="/ranking">
                   <i class="el-icon-document"></i>
                   <span slot="title">排行榜</span>
                 </el-menu-item>
               </el-menu>
      </el-aside>
      <!-- 右侧主体区 -->
      <el-main>
        <router-view></router-view>
      </el-main>
   </el-container>
</template>

<script>
  import axios from 'axios'
  export default {
	 created() {
		 this.role = window.sessionStorage.getItem('role')
	  },
    data() {
      return {
        isCollapse: false,
        menuList: [],
        activeIndex: '/home',
		role: ''
      }
    },
    methods: {
      toggleCollapse() {
        this.isCollapse = !this.isCollapse;
      },
      getMenuList() {
        //获取所都菜单
            let listparam = new FormData();
            axios({
                method: 'post',
                url: '/lightspace/school/menuList',
                data: listparam
            }).then(this.handleGetMenuListSucc.bind(this))
            .catch((err) => { console.log(err)})
      },
      handleGetMenuListSucc (res){
         // console.log(res)
        if(res.data.status == 200) {
           this.menuList = res.data.data;
           let menuList = res.data.data;
        }else {
          this.$message.error(res.data.msg);
          this.$router.push('/login');
        }
      },
      //保存链接的激活状态
      saveNavState(activeIndex) {
          this.activeIndex = activeIndex;
          console.log(this.activeIndex)
      }
    }
  }
</script>

<style lang="stylus" >
  .el-menu
    border-right:none
    .toggle-button
      line-height: 30px
      height: 30px
      color: #fff
      text-align:center
  .el-menu-vertical-demo
    min-height: 100%

</style>
