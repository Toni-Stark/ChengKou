const request = require('../../utils/request.js');

Page({
  data: {
    checkedIn: false,
    checkInTime: '',
    checkInLoading: false
  },

  onLoad() {
    this.checkTodayStatus();
  },

  async checkTodayStatus() {
    try {
      const result = await request.callFunction('checkIn', {}, {
        showLoad: false,
        showError: false
      });

      if (result && result.checkedIn) {
        this.setData({
          checkedIn: true,
          checkInTime: result.checkInTime
        });
      }
    } catch (error) {
      console.log('查询打卡状态失败:', error);
    }
  },

  async doCheckIn() {
    if (this.data.checkInLoading || this.data.checkedIn) return;

    this.setData({ checkInLoading: true });

    try {
      const result = await request.callFunction('checkIn', {}, {
        showLoad: false
      });

      if (result && result.checkedIn) {
        this.setData({
          checkedIn: true,
          checkInTime: result.checkInTime
        });
        wx.showToast({
          title: '打卡成功',
          icon: 'success'
        });
      }
    } catch (error) {
      wx.showToast({
        title: '打卡失败',
        icon: 'none'
      });
    } finally {
      this.setData({ checkInLoading: false });
    }
  }
});
