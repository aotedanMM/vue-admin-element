const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  incomingCall: state => state.user.incomingCall,
  warningGasVisible: state => state.user.warningGasVisible,
  voiceDialogVisible: state => state.user.voiceDialogVisible,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  positionAbValue: state => state.user.positionAbValue,
  emCallValue: state => state.user.emCallValue,
  warnGasValue: state => state.user.warnGasValue,
  noticeSwitch: state => state.user.noticeSwitch
}
export default getters
