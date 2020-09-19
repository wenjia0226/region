<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleBeforeClose"
     >
      <h3>222 账号1年级视力统计(2018-2019下学年)</h3>
      <h6>单位：222 账号1年级</h6>
      <div>
        <div>应测：{{detailGrade}}人</div>
        <div>实测：13人</div>
        <div>视力不良：3人</div>
      </div>
      <h6>不良率：78%</h6>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    name: 'report',
    props: {
      dialogVisible: Boolean,
      grade: String
    },
    data() {
      return {
        year: '',
        semester: ''
      }
    },
    mounted() {
     
      this.getDetailList()
    },
    computed: {
      detailGrade:function() {
        return this.$store.state.grade
      },
      newYear: function() {
        return this.$store.state.year
      },
      newSemester: function() {
        return this.$store.state.semester
      }
    },
    watch: {
      detailGrade(val) {
        this.getDetailList(val)
      },
      newYear(val) {
        console.log(val)
        this.year = val
      },
      newSemester(val) {
        console.log(val, 111);
        this.semester = val
      }
    },
    methods: {
      handleConfirm() {
        this.$emit('closepop')
      },
      handleBeforeClose() {
         this.$emit('closepop')
      },
      getDetailList(val){
        let param = new FormData();
        param.append('year', this.year);
        param.append('semester', this.semester);
        param.append('grade', val);
        axios({
          method: 'post',
          data: param,
          url: '/lightspace/school/ViewGradeReport'
        }).then(this.handlegetTotalSucc.bind(this)).catch((err) => {
           console.log(err)
         })
      },
      handlegetTotalSucc(res) {
        console.log(res)
      }

    }
  }
</script>

<style>
</style>
