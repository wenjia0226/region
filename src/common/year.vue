<template>
  <div class="schoolBox">
   <div class="schoolNow">学年</div>
   <div class="gradeNow">
     <el-select v-model="year"  clearable placeholder="请选择" >
        <el-option
          v-for="item in options"
          :key="item.year"
          :label="item.year"
          :value="item.year">
        </el-option>
      </el-select>
   </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import { mapState, mapMutations } from 'vuex'
  export default {
    name: 'year',
    created() {
      this.getGradeList()
    },
    data() {
      return {
        options: [],
        curYear: ''
      }
    },
    methods: {
      // handleGradeChange(val) {
      //   this.$store.commit('changeYear', val)
      // },
      getGradeList() {
        let param = new FormData();
       axios({
           method: 'post',
           url: '/lightspace/school/getAllSemester'
       }).then(this.handleGetgetAllSemesterSucc.bind(this)).catch((err) => {
          console.log(err)
        })
      },
      handleGetgetAllSemesterSucc(res) {
        // console.log(res)
        if(res.data.status == 200) {
          this.options = res.data.data;
        }
      }
    },
    computed: {
      year: {
        get() {
          return this.$store.state.year
        },
        set(newVal) {
          this.$store.commit('changeYear',newVal)
        }
      }
    }
    // computed:{
    //   year: function() {
    //     this.$store.state.year
    //   },
    //   // ...mapState({
    //   //   year (state) {
    //   //     return state.year
    //   //   }
    //   // })
    // }
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

</style>
