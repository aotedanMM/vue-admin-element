<template>
  <div class="app-container">
    <!--终端筛选-->
    <terminal-filter/>
    <!--终端列表-->
    <terminal-table ref="terTableRefs"/>
    <!--新增编辑-->
    <terminal-edit ref="terEditRefs"/>
    <!--查看详情-->
    <terminal-details ref="terDetailsRefs"/>
    <!--批量导入-->
    <terminal-import ref="terImportRefs"/>
  </div>
</template>
<script>
import TerminalFilter from './TerminalFilter'
import TerminalTable from './TerminalTable'
import TerminalEdit from './TerminalEdit'
import TerminalDetails from './TerminalDetails'
import TerminalImport from './TerminalImport'
export default{
  components: { TerminalImport, TerminalDetails, TerminalEdit, TerminalTable, TerminalFilter },
  data: function() {
    return {
    }
  },
  methods: {

  }

}
</script>
