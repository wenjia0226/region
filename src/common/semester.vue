<template>
  <div class="schoolBox">
   <div class="schoolNow">学期</div>
   <div class="gradeNow">
     <el-select clearable v-model="semester" placeholder="请选择" >
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.label"
          :value="item.id">
        </el-option>
      </el-select>
   </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import vuex from 'vuex'
  import { mapState, mapMutations } from 'vuex'
  export default {
    name: 'semester',
    data() {
      return {
        options: [{
          label: '暑假',
          id: 0
        },{
          label: '上学期',
          id: 1
        },{
          label: '寒假',
          id: 2
        },{
          label: '下学期',
          id: 3
        }],
         cursemester: ''
      }
    },
    methods: {
      // handlesemesterChange(val) {
      //    // ...mapMutations(['changeSemester'], val)
      //   this.$store.commit('changeSemester', val)
      // },

    },
    computed:{
      semester: {
        get() {
          return this.$store.state.semester
        },
        set(newVal) {
          this.$store.commit('changeSemester',newVal)
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

</style>
