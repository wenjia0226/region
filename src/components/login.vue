<template>
  <div class="login_wrap">
    <div class="inner_wrap">
        <div  class="top_title">
          青少年人工智能健康管理平台
        </div>
        <div class="second_title">--学校管理后台--</div>
        <div class="item_wrap">
          <label class="username">用户名</label>
          <input class="user_input" v-model="username" >
         </div>
        <div class="item_wrap">
          <label class="username">密码</label>
          <input class="user_input" v-model="password" @keyup.enter="login">
         </div>
        <el-button class="login_btn" type="primary" @click="login">登录</el-button>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  export default{
    data() {
      return {
        username: '',
        password: '',
        roleId: ''
      }
    },
    methods: {
     login() {
       let param = new FormData();
       param.append('loginName', this.username);
       param.append('password', this.password);
       axios({
         method:'post',
         data: param,
         url: '/lightspace/school/regionLogin'
       }).then((res) => {
         if(res.data.status == 200) {
             console.log(res)
            window.sessionStorage.setItem('userName', res.data.data.userName);
            window.sessionStorage.setItem('schoolName', res.data.data.schoolName);
            window.sessionStorage.setItem('schoolId', res.data.data.schoolId);
            window.sessionStorage.setItem('regionName', res.data.data.schoolName);
            window.sessionStorage.setItem('regionId', res.data.data.schoolId);
           
             this.$router.push('/first');
             this.$message.success('登录成功')

         } else {
           this.$message.error(res.data.msg)
         }
       }).catch((err) => {
         console.log(err)
       })
     }
    }
  }
</script>

<style lang="stylus" scoped>
   .login_wrap
       width: 100vw;
       height: 100vh;
       background: #409EFF;
       position: relative;
       .inner_wrap
          box-sizing: border-box;
          padding: 1%;
          width: 30%;
          overflow:hidden;
          background-color: rgba(33,41,53, .8);
          // background: #212935;
          border-radius: 10px;
          text-align: center;
          margin: auto;
          color: #fff;
          position: absolute;
          top: 50%;
          left: 50%;
          -webkit-transform: translate(-50%, -50%);
          -moz-transform: translate(-50%, -50%);/* for Firefox */
          -ms-transform: translate(-50%,-50%); /* for IE */
          -o-transform: translate(-50%,-50%);
          transform: translate(-50%,-50%);
          .top_title
            font-size: 26px;
            letter-spacing: 3px;
          .second_title
             font-size: 14px;
             margin: 16px;
             letter-spacing: 3px;
          .item_wrap
             display: flex;
             width: 80%;
             height: 36px;
             line-height: 36px;
             border: 1px solid #F0F2F5;
             boder-radius: 3px;
             margin: 20px 10% 20px 10%;
            .username
              width: 20%;
              background-color: #1f242e;
            .user_input
               flex: 1
               padding: 0 10px;
        .login_btn
           width: 80%;
           font-weight: bold;


</style>
