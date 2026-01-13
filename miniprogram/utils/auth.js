/**
 * 授权相关工具函数
 */

const request = require('./request.js');
const app = getApp();

/**
 * 检查登录状态
 * @returns {boolean} 是否已登录
 */
function checkLogin() {
  const userInfo = wx.getStorageSync('userInfo');
  const openid = wx.getStorageSync('openid');
  return !!(userInfo && openid);
}

/**
 * 获取用户信息
 * @returns {Promise} 返回Promise
 */
function getUserProfile() {
  return new Promise((resolve, reject) => {
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: res => {
        resolve(res.userInfo);
      },
      fail: err => {
        console.error('获取用户信息失败:', err);
        request.showToast('获取用户信息失败');
        reject(err);
      }
    });
  });
}

/**
 * 保存用户信息到本地和全局
 * @param {object} userInfo - 用户信息
 * @param {string} openid - 用户openid
 */
function saveUserInfo(userInfo, openid) {
  // 添加openid到userInfo中，方便判断登录状态
  const fullUserInfo = {
    ...userInfo,
    _openid: openid
  };

  if (app && app.saveUserInfo) {
    app.saveUserInfo(fullUserInfo, openid);
  } else {
    wx.setStorageSync('userInfo', fullUserInfo);
    wx.setStorageSync('openid', openid);
  }
}

/**
 * 获取本地存储的用户信息
 * @returns {object} 用户信息
 */
function getStoredUserInfo() {
  return {
    userInfo: wx.getStorageSync('userInfo'),
    openid: wx.getStorageSync('openid')
  };
}

/**
 * 清除用户信息（退出登录）
 */
function clearUserInfo() {
  if (app && app.clearUserInfo) {
    app.clearUserInfo();
  } else {
    wx.removeStorageSync('userInfo');
    wx.removeStorageSync('openid');
  }
}

/**
 * 执行登录流程
 * @param {object} userInfo - 用户信息
 * @returns {Promise} 返回Promise
 */
async function doLogin(userInfo) {
  try {
    // 调用登录云函数
    const result = await request.callFunction('login', {
      userInfo: userInfo
    }, {
      loadText: '登录中...'
    });

    // 保存用户信息
    saveUserInfo(result.userInfo, result.openid);

    return result;
  } catch (error) {
    console.error('登录失败:', error);
    throw error;
  }
}

/**
 * 退出登录
 */
function logout() {
  wx.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: res => {
      if (res.confirm) {
        clearUserInfo();
        wx.reLaunch({
          url: '/pages/login/login'
        });
      }
    }
  });
}

/**
 * 静默登录
 * 如果用户已注册则自动登录，未注册则不做任何处理
 * @returns {Promise} 返回Promise，包含登录结果
 */
async function silentLogin() {
  try {
    // 检查云开发是否可用
    if (!wx.cloud || !wx.cloud.callFunction) {
      console.warn('云开发未配置，跳过静默登录');
      return {
        success: false,
        isRegistered: false
      };
    }

    // 调用云函数进行静默登录
    const result = await request.callFunction('silentLogin', {}, {
      showLoad: false,
      showError: false
    });

    if (result.isRegistered) {
      // 用户已注册，保存用户信息
      saveUserInfo(result.userInfo, result.openid);
      console.log('静默登录成功:', result.userInfo.nickName);
      return {
        success: true,
        isRegistered: true,
        userInfo: result.userInfo
      };
    } else {
      // 用户未注册
      console.log('用户未注册，跳过登录');
      return {
        success: true,
        isRegistered: false
      };
    }
  } catch (error) {
    console.error('静默登录失败:', error);
    return {
      success: false,
      isRegistered: false
    };
  }
}

module.exports = {
  checkLogin,
  getUserProfile,
  saveUserInfo,
  getStoredUserInfo,
  clearUserInfo,
  doLogin,
  logout,
  silentLogin
};
