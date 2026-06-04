const request = require('../../utils/request.js');

Page({
  data: {
    year: 2026,
    month: 6,
    today: 0,
    checkedToday: false,
    todayDistance: 0,
    records: {},
    calendar: [],
    showModal: false,
    modalDay: 0,
    modalDistance: '',
    modalIsToday: false,
    checkInLoading: false,
    monthlyTotal: 0,
    weeklyTotal: 0,
    rankPercent: 0,
    activeDays: 0
  },

  onLoad() {
    const now = new Date();
    this.setData({
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      today: now.getDate()
    });
    this.loadData();
  },

  async loadData() {
    try {
      const result = await request.callFunction('getCheckIns', {
        year: this.data.year,
        month: this.data.month
      }, { showLoad: false, showError: false });

      const records = result?.records || {};
      const today = this.data.today;
      const now = new Date();
      const isCurrentMonth = now.getFullYear() === this.data.year && (now.getMonth() + 1) === this.data.month;

      this.setData({
        records,
        checkedToday: isCurrentMonth && !!records[today],
        todayDistance: records[today]?.distance || 0
      });
      this.buildCalendar();
      this.computeStats();
    } catch (e) {
      console.warn('加载打卡数据失败:', e);
      this.buildCalendar();
    }
  },

  buildCalendar() {
    const { year, month, today, records } = this.data;
    const totalDays = new Date(year, month, 0).getDate();
    const startWeek = new Date(year, month - 1, 1).getDay();
    const now = new Date();
    const isCurrentMonth = now.getFullYear() === year && (now.getMonth() + 1) === month;

    const calendar = [];

    for (let i = 0; i < startWeek; i++) {
      calendar.push({ day: 0, type: 'empty' });
    }

    for (let d = 1; d <= totalDays; d++) {
      const hasRecord = !!records[d];
      const distance = records[d]?.distance || 0;
      const isToday = isCurrentMonth && d === today;
      const isFuture = isCurrentMonth && d > today;
      let type = 'normal';
      if (isToday) type = 'today';
      else if (isFuture) type = 'future';
      else if (hasRecord && distance > 0) type = 'record';
      else if (hasRecord) type = 'checked';

      calendar.push({ day: d, type, hasRecord: hasRecord && distance > 0, distance, isToday });
    }

    this.setData({ calendar });
  },

  computeStats() {
    const { records, year, month, today } = this.data;
    const now = new Date();

    let monthlyTotal = 0;
    let activeDays = 0;
    const dayKeys = Object.keys(records).map(Number).sort((a, b) => a - b);

    dayKeys.forEach(d => {
      const dist = records[d]?.distance || 0;
      if (dist > 0) {
        monthlyTotal += dist;
        activeDays++;
      }
    });

    let weeklyTotal = 0;
    const dayOfWeek = now.getDay();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - dayOfWeek);
    weekStart.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      const key = d.getDate();
      if (d.getMonth() + 1 === month && d.getFullYear() === year && records[key]?.distance) {
        weeklyTotal += records[key].distance;
      }
    }

    const dailyAvg = activeDays > 0 ? monthlyTotal / activeDays : 0;
    let rankPercent = 0;
    if (dailyAvg >= 2000) rankPercent = 95;
    else if (dailyAvg >= 1500) rankPercent = 85;
    else if (dailyAvg >= 1000) rankPercent = 70;
    else if (dailyAvg >= 500) rankPercent = 50;
    else if (dailyAvg >= 200) rankPercent = 30;
    else if (dailyAvg > 0) rankPercent = 15;
    else rankPercent = 0;

    this.setData({ monthlyTotal, weeklyTotal, rankPercent, activeDays });
  },

  prevMonth() {
    let { year, month } = this.data;
    if (month === 1) { year--; month = 12; }
    else { month--; }
    this.setData({ year, month, checkedToday: false, todayDistance: 0 });
    this.loadData();
  },

  nextMonth() {
    let { year, month } = this.data;
    if (month === 12) { year++; month = 1; }
    else { month++; }
    this.setData({ year, month, checkedToday: false, todayDistance: 0 });
    this.loadData();
  },

  onDayTap(e) {
    const day = e.currentTarget.dataset.day;
    if (!day) return;

    const now = new Date();
    const isCurrentMonth = now.getFullYear() === this.data.year && (now.getMonth() + 1) === this.data.month;
    if (isCurrentMonth && day > now.getDate()) return;

    const record = this.data.records[day];
    this.setData({
      showModal: true,
      modalDay: day,
      modalIsToday: false,
      modalDistance: record ? String(record.distance) : ''
    });
  },

  onModalInput(e) {
    this.setData({ modalDistance: e.detail.value });
  },

  async saveDistance() {
    const { year, month, modalDay, modalDistance, modalIsToday } = this.data;
    const distance = parseInt(modalDistance) || 0;
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(modalDay).padStart(2, '0')}`;

    try {
      await request.callFunction('checkIn', {
        distance: distance,
        date: dateStr
      }, { showLoad: true });

      const records = { ...this.data.records };
      records[modalDay] = { distance };

      const today = this.data.today;
      const now = new Date();
      const isCurrentMonth = now.getFullYear() === year && (now.getMonth() + 1) === month;

      this.setData({
        showModal: false,
        records,
        checkedToday: isCurrentMonth && (modalDay === today || !!records[today]),
        todayDistance: modalDay === today ? distance : (records[today]?.distance || 0)
      });
      this.buildCalendar();
      this.computeStats();
    } catch (e) {
      wx.showToast({ title: '保存失败', icon: 'none' });
    }
  },

  closeModal() {
    this.setData({ showModal: false });
  },

  async doCheckIn() {
    if (this.data.checkInLoading || this.data.checkedToday && this.data.todayDistance > 0) return;
    this.setData({ checkInLoading: true });

    try {
      const { today } = this.data;
      const record = this.data.records[today];

      this.setData({
        showModal: true,
        modalDay: today,
        modalDistance: record ? String(record.distance) : '',
        checkInLoading: false
      });
    } catch (e) {
      this.setData({ checkInLoading: false });
      wx.showToast({ title: '操作失败', icon: 'none' });
    }
  }
});
