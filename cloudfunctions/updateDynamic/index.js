const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const { dynamicId, displayType, content, title, video, images } = event;

  if (!dynamicId) return { code: -1, message: '参数错误', data: null };

  try {
    const dyn = await db.collection('user_dynamics').doc(dynamicId).get();
    if (!dyn.data) return { code: -1, message: '游龙不存在', data: null };
    if (dyn.data._openid !== wxContext.OPENID) return { code: -1, message: '无权修改', data: null };

    const updateData = { updateTime: new Date().getTime() };
    if (displayType !== undefined) updateData.displayType = displayType;
    if (content !== undefined) updateData.content = content;
    if (title !== undefined) updateData.title = title;
    if (video !== undefined) updateData.video = video;
    if (images !== undefined) updateData.images = images;

    await db.collection('user_dynamics').doc(dynamicId).update({ data: updateData });

    return { code: 0, message: '修改成功', data: null };
  } catch (e) {
    return { code: -1, message: '修改失败', data: null };
  }
};
