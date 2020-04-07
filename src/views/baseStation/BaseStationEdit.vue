<template>
  <div>
    <!--新增编辑-->
    <div id ="m_BaseDialog">
      <el-dialog
        :title="textMap[baseStationEditStatus]"
        :visible.sync="baseStationEditVisible"
        :before-close="closeEdit"
        @open="common.toggleBody(1)"
        @close="common.toggleBody(0)"
      >
        <el-form ref="baseStationFormRefs" :rules="baseStationRules" :model="baseStationForm" label-position="left" label-width="100px" class="m_form">
          <!--<h2>网络设置</h2>-->
          <el-form-item label="基站编号" prop="baseStationNum" >
            <el-input v-if="baseStationEditStatus==='update'" v-model="baseStationForm.baseStationNum" :disabled="true" type="text" @change="setSSID"/>
            <el-input v-else v-model="baseStationForm.baseStationNum" type="text" oninput ="value=value.replace(/[^0-9]/g,'')" maxlength="8" @input="setSSID"/>
          </el-form-item>
          <!--<el-form-item label="基站IP" prop="baseStationIp" >-->
          <!--<el-input v-model="baseStationForm.baseStationIp" type="text" oninput ="value=value.replace(/[^0-9.]/g,'')" maxlength="15" @input="setSSID"/>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="wifi名称" prop="ssid">-->
          <!--<el-input v-model="baseStationForm.ssid" type="text" disabled="disabled" />-->
          <!--</el-form-item>-->
          <el-form-item label="子网掩码" prop="subnetMask" >
            <el-input v-model="baseStationForm.subnetMask" type="text" disabled oninput ="value=value.replace(/[^0-9.]/g,'')" maxlength="15" />
          </el-form-item>
          <!--<h2>基础信息</h2>-->
          <!--<el-form-item label="基站名称" prop="baseStationName" >-->
          <!--<el-input v-model="baseStationForm.baseStationName" :disabled="true" type="text" />-->
          <!--</el-form-item>-->
          <el-form-item label="所属区域" prop="zoneName">
            <el-input :value="baseStationForm.zoneName" placeholder="请选择所属区域" @focus="selectPartition"/>
          </el-form-item>
          <el-form-item label="软件版本号" prop="softwareVersion" >
            <el-input v-model="baseStationForm.softwareVersion" type="text" oninput ="value=value.replace(/[^0-9.]/g,'')"/>
          </el-form-item>
          <el-form-item label="硬件版本号" prop="hardwareVersion" >
            <el-input v-model="baseStationForm.hardwareVersion" type="text" oninput ="value=value.replace(/[^0-9.]/g,'')" />
          </el-form-item>
          <el-form-item label="电池" prop="powerSupply" >
            <el-input v-model="baseStationForm.powerSupply" type="text" maxlength="5" oninput ="value=value.replace(/[^\d]/g,'')" />
            <span class="m_inputUnit">mAH</span>
          </el-form-item>
          <el-form-item label="信道" prop="channel" >
            <el-input v-model="baseStationForm.channel" type="text" maxlength="2" oninput ="value=value.replace(/[^\d]/g,'')"/>
          </el-form-item>
          <el-form-item label="发射功率" prop="emissivePower" >
            <el-input v-model="baseStationForm.emissivePower" type="text" class="m_formInput" maxlength="2" oninput ="value=value.replace(/[^\d]/g,'')"/>
            <span class="m_inputUnit">dBm</span>
          </el-form-item>
          <el-form-item label="天线增益" prop="antennaGain" >
            <el-input v-model="baseStationForm.antennaGain" type="text" maxlength="2" oninput ="value=value.replace(/[^\d]/g,'')"/>
            <span class="m_inputUnit">DB</span>
          </el-form-item>
          <el-form-item label="加密方式" prop="encryption" >
            <el-select v-model="baseStationForm.encryption" placeholder="请选择">
              <el-option
                v-for="item in encryptionData"
                :key="item.encryptionId"
                :label="item.encryptionName"
                :value="item.encryptionId"/>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeEdit">取消</el-button>
          <el-button v-if="baseStationEditStatus==='create'" type="primary" @click="handleCreateBaseStation">确认</el-button>
          <el-button v-else type="primary" @click="handleUpdateBaseStation">确认</el-button>
        </div>
      </el-dialog>
    </div>
    <!--弹窗显示区域选择-->
    <area-select-dialog
      ref="parSelectRefs"
      :partition="partition"
      @returnDialogPartition="handleReturnDialogPartition"
    />
  </div>
</template>
<script>
import eventVue from '@/api/eventVue'
import { checkStationNumExist, updateStation, createStation } from '@/api/station'
// import { isvalidateIp, isvalidateVersion, isvalidateSubnetMask } from '@/utils/validate'
import { isvalidateVersion } from '@/utils/validate'
import AreaSelectDialog from '@/components/AreaSelectDialog/index'
export default {
  name: 'BaseStationEdit',
  components: { AreaSelectDialog },
  props: {
    baseStationEditVisible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    // 基站编号长度为8位,且只有八位,由于现有基站未按此标准进行设定,这里先不判断长度为8
    const validatePass = (rule, value, callback) => {
      if (this.baseStationEditStatus === 'create') {
        if (value) {
          checkStationNumExist(this.baseStationForm.baseStationNum).then(resp => {
            if (resp.data.code === 144) {
              callback(new Error('基站编号已存在'))
            } else {
              callback()
            }
          })
        } else {
          callback(new Error('请输入基站编号'))
        }
      } else {
        callback()
      }
    }
    // IP校验
    // const validateIp = (rule, value, callback) => {
    //   if (!isvalidateIp(value)) {
    //     callback(new Error('请输入正确的IP'))
    //   } else {
    //     callback()
    //   }
    // }
    // // 子网掩码校验
    // const validateSubnetMask = (rule, value, callback) => {
    //   if (!isvalidateSubnetMask(value)) {
    //     callback(new Error('请输入正确的子网掩码'))
    //   } else {
    //     callback()
    //   }
    // }
    // 版本号校验
    const validateVersion = (rule, value, callback) => {
      if (value) {
        if (!isvalidateVersion(value)) {
          callback(new Error('请输入正确的版本号,格式如:0.0.0'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      partition: null,
      baseStationRules: {
        baseStationNum: [{ required: true, trigger: 'blur', validator: validatePass }],
        // baseStationIp: [{ required: true, trigger: 'blur', validator: validateIp }],
        // subnetMask: [{ required: true, trigger: 'blur', validator: validateSubnetMask }],
        softwareVersion: [{ required: false, trigger: 'blur', validator: validateVersion }],
        hardwareVersion: [{ required: false, trigger: 'blur', validator: validateVersion }]
      },
      textMap: { update: '编辑基站', create: '新增基站' },
      baseStationEditStatus: '',
      baseStationForm: { subnetMask: '255.255.255.0' },
      encryptionData: [
        { encryptionId: 0, encryptionName: 'WPA-PSK/WPA2-PSK' },
        { encryptionId: 1, encryptionName: 'WPA/WPA2' },
        { encryptionId: 2, encryptionName: 'WEP' }
      ]
    }
  },
  created() {
    this.handleCreateOrUpdate() // 兄弟组件通讯新增或编辑
  },
  // 注销eventVue事件
  beforeDestroy() {
    eventVue.$off('createBaseStation')
    eventVue.$off('updateBaseStation')
  },
  methods: {
    // 关闭新增编辑弹窗
    closeEdit() {
      this.$emit('closeBaseStationEdit')
    },
    // 父子组件通讯返回选择区域
    handleReturnDialogPartition(partition) {
      this.partition = partition
      this.baseStationForm.zoneId = this.partition.id
      this.baseStationForm.zoneName = this.partition.partitionName
    },
    // 新增&编辑
    handleCreateOrUpdate() {
      // 新增
      eventVue.$on('createBaseStation', () => {
        this.$emit('openBaseStationEdit')
        this.createBaseStation()
      })
      // 编辑
      eventVue.$on('updateBaseStation', (row) => {
        this.$emit('openBaseStationEdit')
        this.baseStationForm = Object.assign({}, row) // 将当前编辑行的数据复制到form中,避免操作数据源
        this.updateBaseStation()
      })
    },
    // 新增基站
    createBaseStation() {
      this.handleResetBaseStationForm() // 重置表单
      this.baseStationForm.subnetMask = '255.255.255.0'
      this.baseStationEditStatus = 'create'
      this.$nextTick(() => {
        this.$refs['baseStationFormRefs'].clearValidate()
      })
    },
    // 编辑基站
    updateBaseStation() {
      this.baseStationEditStatus = 'update'
      this.$nextTick(() => {
        this.$refs['baseStationFormRefs'].clearValidate()
      })
    },
    // 提交新增基站
    handleCreateBaseStation() {
      this.$refs['baseStationFormRefs'].validate((valid) => {
        if (valid) {
          console.log(this.baseStationForm)
          createStation(this.baseStationForm).then((resp) => {
            if (resp.data.code === 200) {
              this.$message({
                type: 'success',
                message: resp.data.msg
              })
              eventVue.$emit('fetchBaseStationData', '')
            } else {
              this.$message({
                message: resp.data.code + ':' + resp.data.msg,
                type: 'error'
              })
            }
          })
          this.$emit('closeBaseStationEdit')
        }
      })
    },
    // 提交编辑基站
    handleUpdateBaseStation() {
      this.$refs['baseStationFormRefs'].validate((valid) => {
        if (valid) {
          updateStation(this.baseStationForm).then((resp) => {
            console.log(resp.data)
            if (resp.data.code === 200) {
              this.$message({
                type: 'success',
                message: resp.data.msg
              })
            } else {
              this.$message({
                message: resp.data.code + ':' + resp.data.msg,
                type: 'error'
              })
            }
            eventVue.$emit('fetchBaseStationData', '')
          })
          this.$emit('closeBaseStationEdit')
        }
      })
    },
    // 重置表单
    handleResetBaseStationForm() {
      this.baseStationForm = {}
    },
    // 设置基站名称 基站编号、基站ip、
    setSSID(val) {
      if (val.length !== 0) {
        const t_ips = this.baseStationForm.baseStationIp
        if (t_ips !== '' && t_ips != null) {
          if (t_ips.indexOf('.') !== -1) {
            if (t_ips.split('.').length === 4) {
              const ips = t_ips.split('.')
              const ip1 = parseInt(ips[0], 10).toString(16)
              const ip2 = parseInt(ips[1], 10).toString(16)
              const ip3 = parseInt(ips[2], 10).toString(16)
              const ip4 = parseInt(ips[3], 10).toString(16)
              const num = parseInt(this.baseStationForm.baseStationNum, 10)
              const ipStr = this.dec2Hex(ip1, 2) + '' + this.dec2Hex(ip2, 2) + this.dec2Hex(ip3, 2) + this.dec2Hex(ip4, 2) + this.dec2Hex(num.toString(16), 2)
              this.baseStationForm.ssid = 'zkxh-' + ipStr
            }
          }
        }
      }
    },
    // 设置基站名称调用的函数
    dec2Hex(val, len) {
      if (val.length < len) {
        val = '0' + val
      }
      return val
    },
    // 工作地点
    selectPartition() {
      this.$refs.parSelectRefs.handleOpenParSelect()
    },
    // 返回选择区域
    handleReturnPartition() {
      eventVue.$on('returnPartition', (selectPartition) => {
        this.baseStationForm.zoneId = selectPartition.id
        this.baseStationForm.zoneName = selectPartition.partitionName
      })
    }
  }
}
</script>
