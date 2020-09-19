<template>
  <div>
    <div class="schoolBox">
     <div class="schoolNow" v-if="!show">当前校区</div>
     <div class="schoolName"  v-if="!show"> {{schoolName}}</div>
     <div class="schoolNow"   v-if="show">{{title}}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'currentschool',
    data() {
      return {
        regionName: '',
        schoolName: '',
        show: false,
        title: '您当前所在位置是'+ '区，' +'请选择区下某一学校应用此功能',
        
      }
    },
    created() {
      this.schoolName = window.sessionStorage.getItem('schoolName');
      this.regionName = window.sessionStorage.getItem('regionName');
      this.computedNow()
    },
    methods: {
      computedNow() {
        if(this.schoolName == this.regionName) {
          this.show = true
        }
      }
    }
   }

</script>

<style lang="stylus" scoped>
  .schoolBox
    display: flex
    align-items: center
    margin-bottom: 20px
    .schoolNow
       font-size: 20px
       font-weight: bold
       letter-spacing :3px
       color:#64c0ff
       margin: 0 10px
     .schoolName
        // border: 2px solid #eee
        // box-shadow:0 0 3px #eee
        // border-radius: 5px
        // line-height: 30px
        // height: 30px
        // padding: 0 20px
        background-color: #FFF;
        background-image: none;
        border-radius: 4px;
        border: 1px solid #DCDFE6;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        color: #606266;
        display: inline-block;
        font-size: inherit;
        height: 40px;
        line-height: 40px;
        padding: 0 15px;

</style>
