export default {
  changeName(state, name) {
    state.name = name
  },
  changeClassId(state, classId) {
   // console.log(state, classId)
    state.classId = classId
  },
  changeSchool(state, school) {
    state.school = school
  },
 changeSemester(state, semester) {
    state.semester = semester
  },
  changeYear(state, year) {
    state.year = year
  },
  seeGrade(state, grade) {
    state.grade = grade
  }
}
