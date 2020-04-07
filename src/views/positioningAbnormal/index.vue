<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="card" class="m_tableContent2" @tab-click="handleClick">
      <!--特种作业人员定位异常-->
      <el-tab-pane label="特种作业人员工作异常" name="first">
        <keep-alive>
          <special-job-ab-staff
            v-if="specialJobAbVisible"
            ref="specialJobAbStaffRefs"
          />
        </keep-alive>
      </el-tab-pane>
      <!--非特种作业人员定位异常-->
      <el-tab-pane label="非特种作业人员工作异常" name="second">
        <keep-alive>
          <position-ab-staff
            v-if="positionAbStaffVisible"
            ref="positionAbStaffRefs"
          />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import SpecialJobAbStaff from './SpecialJobAbStaff'
import PositionAbStaff from './PositionAbStaff'
export default {
  name: 'PositioningAbnormal',
  components: { PositionAbStaff, SpecialJobAbStaff },
  data() {
    return {
      activeName: 'first',
      specialJobAbVisible: true,
      positionAbStaffVisible: false
    }
  },
  created() {
    this.$store.dispatch('handleSetPositionAbValueTo0')
    localStorage.setItem('positionAbValue', 0)
  },
  methods: {
    handleClick() {
      switch (this.activeName) {
        case 'first':
          this.specialJobAbVisible = true
          break
        case 'second':
          this.positionAbStaffVisible = true
          break
      }
    }
  }
}
</script>
