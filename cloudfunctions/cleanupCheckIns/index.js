const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = event.openid || wxContext.OPENID;

  try {
    const allResult = await db.collection('check_ins')
      .where({
        _openid: openid
      })
      .limit(1000)
      .get();

    const allRecords = allResult.data;
    const dateMap = {};
    let migrated = 0;
    let deleted = 0;

    allRecords.forEach(item => {
      let dateKey;
      if (typeof item.date === 'string') {
        dateKey = item.date;
      } else if (item.date) {
        const d = new Date(item.date);
        dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      }

      if (!dateKey) return;

      if (!dateMap[dateKey]) {
        dateMap[dateKey] = [];
      }
      dateMap[dateKey].push(item);
    });

    const dateKeys = Object.keys(dateMap);
    let deletedCount = 0;
    let migratedCount = 0;

    for (const dateKey of dateKeys) {
      const entries = dateMap[dateKey];

      entries.sort((a, b) => {
        const aTime = a.updateTime || a.createTime || 0;
        const bTime = b.updateTime || b.createTime || 0;
        return bTime - aTime;
      });

      const keep = entries[0];

      if (typeof keep.date !== 'string') {
        await db.collection('check_ins').doc(keep._id).update({
          data: {
            date: dateKey,
            updateTime: db.serverDate()
          }
        });
        migratedCount++;
        keep.date = dateKey;
      }

      for (let i = 1; i < entries.length; i++) {
        const dup = entries[i];

        if (keep.distance == null && dup.distance != null && keep.distance !== dup.distance) {
          keep.distance = dup.distance;
        }
        if (keep.duration == null && dup.duration != null) {
          keep.duration = dup.duration;
        }
        if (!keep.stroke && dup.stroke) {
          keep.stroke = dup.stroke;
        }

        await db.collection('check_ins').doc(dup._id).remove();
        deletedCount++;
      }

      if (keep._mergeUpdated) {
        await db.collection('check_ins').doc(keep._id).update({
          data: {
            distance: keep.distance,
            duration: keep.duration,
            stroke: keep.stroke,
            updateTime: db.serverDate()
          }
        });
      }
    }

    return {
      code: 0,
      message: `清理完成：去重删除 ${deletedCount} 条，日期格式迁移 ${migratedCount} 条`,
      data: {
        totalRecords: allRecords.length,
        uniqueDates: dateKeys.length,
        deleted: deletedCount,
        migrated: migratedCount
      }
    };
  } catch (error) {
    console.error('清理数据失败:', error);
    return {
      code: -1,
      message: '清理失败: ' + error.message,
      data: null
    };
  }
};
