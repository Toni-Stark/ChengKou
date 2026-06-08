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
    activeDays: 0,
    streakDays: 0,
    weekDays: [],
    isCurrentMonth: true,
    calTouchStartX: 0
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

  onShow() {
    this.loadData();
  },

  async loadData() {
    try {
      const now = new Date();
      const today = now.getDate();
      const isCurrentMonth = now.getFullYear() === this.data.year && (now.getMonth() + 1) === this.data.month;

      const result = await request.callFunction('getCheckIns', {
        year: this.data.year,
        month: this.data.month
      }, { showLoad: false, showError: false });

      const records = result?.records || {};

      this.setData({
        today,
        records,
        isCurrentMonth,
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

  getIntensity(distance) {
    if (!distance || distance <= 0) return 0;
    if (distance < 500) return 1;
    if (distance < 1000) return 2;
    return 3;
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
      const intensity = this.getIntensity(distance);
      let type = 'normal';
      if (isToday) type = 'today';
      else if (isFuture) type = 'future';
      else if (hasRecord && distance > 0) type = 'record';
      else if (hasRecord) type = 'checked';

      calendar.push({ day: d, type, hasRecord, distance, isToday, intensity });
    }

    this.setData({ calendar });
  },

  computeStats() {
    const { records, year, month } = this.data;
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

    let streakDays = 0;
    const today = now.getDate();
    const isCurrentMonth = now.getFullYear() === year && (now.getMonth() + 1) === month;
    if (isCurrentMonth) {
      for (let d = today; d >= 1; d--) {
        const dist = records[d]?.distance || 0;
        if (dist > 0) {
          streakDays++;
        } else {
          break;
        }
      }
    }

    let weeklyTotal = 0;
    const dayOfWeek = now.getDay();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - dayOfWeek);
    weekStart.setHours(0, 0, 0, 0);

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      const key = d.getDate();
      const dist = d.getMonth() + 1 === month && d.getFullYear() === year && records[key]?.distance || 0;
      if (dist > 0) weeklyTotal += dist;
      const labels = ['日', '一', '二', '三', '四', '五', '六'];
      weekDays.push({
        label: labels[i],
        distance: dist,
        isToday: d.getDate() === today && d.getMonth() === now.getMonth()
      });
    }

    const dailyAvg = activeDays > 0 ? monthlyTotal / activeDays : 0;
    let rankPercent = 0;
    if (dailyAvg >= 2000) rankPercent = '95%';
    else if (dailyAvg >= 1500) rankPercent = '85%';
    else if (dailyAvg >= 1000) rankPercent = '70%';
    else if (dailyAvg >= 500) rankPercent = '50%';
    else if (dailyAvg >= 200) rankPercent = '30%';
    else if (dailyAvg > 0) rankPercent = '15%';
    else rankPercent = '0%';

    this.setData({ monthlyTotal, weeklyTotal, rankPercent, activeDays, streakDays, weekDays });
  },

  // 滑动切月
  onCalTouchStart(e) {
    this.setData({ calTouchStartX: e.touches[0].clientX });
  },

  onCalTouchEnd(e) {
    const dx = e.changedTouches[0].clientX - this.data.calTouchStartX;
    if (Math.abs(dx) < 50) return;
    if (dx > 0) {
      this.prevMonth();
    } else {
      const now = new Date();
      const isCurrentMonth = now.getFullYear() === this.data.year && (now.getMonth() + 1) === this.data.month;
      if (!isCurrentMonth) this.nextMonth();
    }
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

  goToToday() {
    const now = new Date();
    this.setData({
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      today: now.getDate()
    });
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
      modalIsToday: isCurrentMonth && day === now.getDate(),
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

      const now = new Date();
      const today = now.getDate();
      const isCurrentMonth = now.getFullYear() === year && (now.getMonth() + 1) === month;
      const isToday = modalIsToday || (isCurrentMonth && modalDay === today);

      this.setData({
        showModal: false,
        records,
        checkedToday: isCurrentMonth && (isToday || !!records[today]),
        todayDistance: isToday ? distance : (records[today]?.distance || 0)
      });
      this.buildCalendar();
      this.computeStats();
    } catch (e) {
      wx.showToast({ title: '保存失败', icon: 'none' });
    }
  },
  noclose(){

  },
  closeModal() {
    this.setData({ showModal: false });
  },

  async doCheckIn() {
    if (this.data.checkInLoading) return;
    this.setData({ checkInLoading: true });

    try {
      const realToday = new Date().getDate();
      const record = this.data.records[realToday];

      this.setData({
        showModal: true,
        modalDay: realToday,
        modalIsToday: true,
        modalDistance: record ? String(record.distance) : '',
        checkInLoading: false
      });
    } catch (e) {
      this.setData({ checkInLoading: false });
      wx.showToast({ title: '操作失败', icon: 'none' });
    }
  }
});
