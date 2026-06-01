/**
 * 云函数请求封装
 */

let loadingCount = 0;

const _urlCache = {};
const CACHE_TTL = 5 * 60 * 1000;

/**
 * 显示加载提示
 * @param {string} title - 加载提示文字
 */
function showLoading(title = '加载中...') {
  if (loadingCount === 0) {
    wx.showLoading({
      title: title,
      mask: true
    });
  }
  loadingCount++;
}

/**
 * 隐藏加载提示
 */
function hideLoading() {
  loadingCount--;
  if (loadingCount <= 0) {
    loadingCount = 0;
    wx.hideLoading();
  }
}

/**
 * 显示提示信息
 * @param {string} title - 提示文字
 * @param {string} icon - 图标类型
 * @param {number} duration - 持续时间
 */
function showToast(title, icon = 'none', duration = 2000) {
  wx.showToast({
    title: title,
    icon: icon,
    duration: duration
  });
}

/**
 * 错误处理
 * @param {Error} error - 错误对象
 * @param {string} defaultMsg - 默认错误信息
 */
function handleError(error, defaultMsg = '操作失败，请重试') {
  console.error('请求错误:', error);
  const errorMsg = error.errMsg || error.message || defaultMsg;
  showToast(errorMsg);
}

/**
 * 统一云函数调用
 * @param {string} name - 云函数名称
 * @param {object} data - 传递的参数
 * @param {object} options - 配置项
 * @returns {Promise} 返回Promise
 */
function callFunction(name, data = {}, options = {}) {
  const {
    showLoad = true,
    loadText = '加载中...',
    showError = true,
    errorMsg = '操作失败，请重试'
  } = options;

  if (showLoad) {
    showLoading(loadText);
  }

  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: name,
      data: data,
      success: res => {
        if (showLoad) {
          hideLoading();
        }

        console.log('云函数调用结果:', name, res);

        if (res.result && res.result.code === 0) {
          // 成功
          resolve(res.result.data);
        } else {
          // 业务错误
          const message = res.result ? res.result.message : errorMsg;
          console.error('云函数业务错误:', name, res.result);
          if (showError) {
            showToast(message);
          }
          reject(new Error(message));
        }
      },
      fail: err => {
        if (showLoad) {
          hideLoading();
        }
        if (showError) {
          handleError(err, errorMsg);
        }
        reject(err);
      }
    });
  });
}

/**
 * 上传文件到云存储
 * @param {string} cloudPath - 云存储路径
 * @param {string} filePath - 本地文件路径
 * @param {object} options - 配置项
 * @returns {Promise} 返回Promise
 */
function uploadFile(cloudPath, filePath, options = {}) {
  const {
    showLoad = true,
    loadText = '上传中...'
  } = options;

  if (showLoad) {
    showLoading(loadText);
  }

  return new Promise((resolve, reject) => {
    wx.cloud.uploadFile({
      cloudPath: cloudPath,
      filePath: filePath,
      success: res => {
        if (showLoad) {
          hideLoading();
        }
        resolve(res.fileID);
      },
      fail: err => {
        if (showLoad) {
          hideLoading();
        }
        handleError(err, '上传失败');
        reject(err);
      }
    });
  });
}

/**
 * 批量上传图片
 * @param {Array} tempFilePaths - 本地文件路径数组
 * @param {string} folder - 云存储文件夹名称
 * @returns {Promise} 返回Promise
 */
async function uploadImages(tempFilePaths, folder = 'images') {
  showLoading('上传中...');

  try {
    const uploadPromises = tempFilePaths.map((filePath, index) => {
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 10000);
      const cloudPath = `${folder}/${timestamp}_${random}_${index}.png`;
      return uploadFile(cloudPath, filePath, { showLoad: false });
    });

    const fileIDs = await Promise.all(uploadPromises);
    hideLoading();
    return fileIDs;
  } catch (error) {
    hideLoading();
    throw error;
  }
}

/**
 * 将云存储文件ID转换为临时HTTP链接
 * 解决iOS设备上cloud://协议图片无法显示的问题
 * @param {string|Array} fileList - 单个fileID或fileID数组
 * @returns {Promise} 返回临时链接
 */
async function getTempFileURL(fileList) {
  try {
    const isArray = Array.isArray(fileList);
    const files = isArray ? fileList : [fileList];

    const cloudFiles = files.filter(file => {
      return file && typeof file === 'string' && file.startsWith('cloud://');
    });

    if (cloudFiles.length === 0) {
      return isArray ? files : files[0];
    }

    const now = Date.now();
    const uncached = cloudFiles.filter(file => {
      const entry = _urlCache[file];
      return !entry || (now - entry.time > CACHE_TTL);
    });

    if (uncached.length > 0) {
      const res = await wx.cloud.getTempFileURL({
        fileList: uncached
      });

      if (res.fileList && res.fileList.length > 0) {
        res.fileList.forEach(item => {
          if (item.tempFileURL) {
            _urlCache[item.fileID] = { url: item.tempFileURL, time: now };
          }
        });
      }
    }

    const result = files.map(file => {
      if (file && _urlCache[file]) {
        return _urlCache[file].url;
      }
      return file;
    });

    return isArray ? result : result[0];
  } catch (error) {
    console.error('获取临时链接失败:', error);
    return fileList;
  }
}

/**
 * 批量处理动态列表中的图片URL
 * @param {Array} dynamics - 动态列表
 * @returns {Promise} 处理后的动态列表
 */
async function processDynamicsImages(dynamics) {
  if (!dynamics || dynamics.length === 0) {
    return dynamics;
  }

  try {
    // 收集所有需要转换的图片URL
    const allImageUrls = [];
    dynamics.forEach(item => {
      if (item.images && Array.isArray(item.images)) {
        allImageUrls.push(...item.images);
      }
      // 处理用户头像
      if (item.userInfo && item.userInfo.avatarUrl) {
        allImageUrls.push(item.userInfo.avatarUrl);
      }
    });

    // 批量转换
    const convertedUrls = await getTempFileURL(allImageUrls);

    // 创建URL映射表
    const urlMap = {};
    allImageUrls.forEach((url, index) => {
      if (Array.isArray(convertedUrls)) {
        urlMap[url] = convertedUrls[index];
      }
    });

    // 更新动态列表中的URL
    const processedDynamics = dynamics.map(item => {
      const newItem = { ...item };

      // 更新图片URL
      if (newItem.images && Array.isArray(newItem.images)) {
        newItem.images = newItem.images.map(img => urlMap[img] || img);
      }

      // 更新头像URL
      if (newItem.userInfo && newItem.userInfo.avatarUrl) {
        newItem.userInfo = {
          ...newItem.userInfo,
          avatarUrl: urlMap[newItem.userInfo.avatarUrl] || newItem.userInfo.avatarUrl
        };
      }

      return newItem;
    });

    return processedDynamics;
  } catch (error) {
    console.error('处理动态图片失败:', error);
    return dynamics;
  }
}

function clearUrlCache() {
  Object.keys(_urlCache).forEach(k => delete _urlCache[k]);
}

module.exports = {
  showLoading,
  hideLoading,
  showToast,
  handleError,
  callFunction,
  uploadFile,
  uploadImages,
  getTempFileURL,
  processDynamicsImages,
  clearUrlCache
};
