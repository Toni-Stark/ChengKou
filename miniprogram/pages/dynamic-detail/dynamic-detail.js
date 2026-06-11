const request = require('../../utils/request.js');
const auth = require('../../utils/auth.js');
const util = require('../../utils/util.js');

Page({
  data: {
    dynamicId: '',
    dynamic: null,
    commentsList: [],
    hotComments: [],
    regularComments: [],
    hotCount: 0,
    page: 1,
    pageSize: 20,
    hasMore: true,
    loading: false,
    commentContent: '',
    submitting: false,
    fromShare: false,
    userInfo: null,
    isShow: false,
    isOwner: false,
    youLongShow: 1
  },

  onLoad(options) {
    const { id, from } = options;

    this.loadYouLongShow();

    // 标记是否从分享进入
    if (from === 'share') {
      this.setData({ fromShare: true });
      // 尝试静默登录
      this.trySilentLogin();
    }

    this.loadUserInfo();

    if (id) {
      this.setData({ dynamicId: id });
      this.loadDynamic();
      this.loadComments();
    }
  },

  // 加载用户信息
  loadUserInfo() {
    try {
      const userInfo = wx.getStorageSync('userInfo');
      const openid = wx.getStorageSync('openid');
      if (userInfo) {
        this.setData({
          userInfo: userInfo,
          isShow: true,
          storedOpenid: openid
        });
      }
    } catch (error) {
      console.error('加载用户信息失败:', error);
    }
  },

  async loadYouLongShow() {
    try {
      const result = await request.callFunction('getGlobalConfig', {
        key: 'youLongShow'
      }, { showLoad: false, showError: false });
      const val = result && result.value !== undefined ? Number(result.value) : 1;
      this.setData({ youLongShow: val });
    } catch (e) {
      this.setData({ youLongShow: 1 });
    }
  },

  async trySilentLogin() {
    try {
      const userInfo = wx.getStorageSync('userInfo');
      const openid = wx.getStorageSync('openid');
      if (userInfo && openid) {
        console.log('静默登录成功，用户:', userInfo.nickName);
        if (this.data.dynamicId) {
          this.loadDynamic();
          this.loadComments();
        }
      } else {
        console.log('用户未注册，以游客身份浏览');
      }
    } catch (error) {
      console.warn('静默登录跳过:', error);
    }
  },

  async loadDynamic() {
    try {
      // 检查云开发是否可用
      console.log(!wx.cloud || !wx.cloud.callFunction)
      if (!wx.cloud || !wx.cloud.callFunction) {
        console.warn('云开发未配置，使用模拟数据');
        this.loadMockDynamic();
        return;
      }
      const result = await request.callFunction('getDynamicDetail', {
        dynamicId: this.data.dynamicId
      }, {
        showLoad: true
      });
      console.log(result)

      // 处理图片URL - 将cloud://转换为临时HTTP链接，解决iOS显示问题
      const processedDynamic = result ? (await request.processDynamicsImages([result]))[0] : {};

      if (processedDynamic && processedDynamic.createTime) {
        processedDynamic.displayTime = util.formatRelativeTime(processedDynamic.createTime);
      }

      this.setData({
        dynamic: processedDynamic,
        isOwner: processedDynamic._openid === this.data.storedOpenid
      });
    } catch (error) {
      console.error('加载动态失败:', error);
      this.loadMockDynamic();
    }
  },

  // 加载模拟动态数据
  loadMockDynamic() {
    const mockDynamic = {}

    this.setData({
      dynamic: mockDynamic
    });
  },

  async loadComments(loadMore = false) {
    if (this.data.loading) return;

    this.setData({ loading: true });

    try {
      // 检查云开发是否可用
      if (!wx.cloud || !wx.cloud.callFunction) {
        console.warn('云开发未配置，使用模拟数据');
        this.loadMockComments();
        return;
      }

      const result = await request.callFunction('getComments', {
        dynamicId: this.data.dynamicId,
        page: this.data.page,
        pageSize: this.data.pageSize
      }, {
        showLoad: !loadMore
      });

      const storedOpenid = this.data.storedOpenid;
      const processedList = result.list.map(comment => ({
        ...comment,
        displayTime: util.formatRelativeTime(comment.createTime),
        isMine: comment._openid === storedOpenid
      }));

      const newList = loadMore
        ? [...this.data.commentsList, ...processedList]
        : processedList;

      this.setData({
        commentsList: newList,
        hasMore: result.hasMore,
        loading: false
      });
      this.splitComments();
    } catch (error) {
      console.error('加载评论失败:', error);
      this.loadMockComments();
    }
  },

  splitComments() {
    const list = this.data.commentsList;
    if (list.length < 3) {
      this.setData({ hotComments: [], regularComments: list, hotCount: 0 });
      return;
    }

    // 按点赞数排序，取前2条作为热门
    const sorted = [...list].sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0));
    const hotIds = new Set(sorted.slice(0, 2).map(c => c._id));

    const hot = list.filter(c => hotIds.has(c._id));
    const regular = list.filter(c => !hotIds.has(c._id));

    this.setData({
      hotComments: hot,
      regularComments: regular,
      hotCount: hot.length
    });
  },

  // 加载模拟评论数据
  loadMockComments() {
    const mockComments = []

    this.setData({
      commentsList: mockComments,
      hotComments: [],
      regularComments: [],
      hotCount: 0,
      hasMore: false,
      loading: false
    });
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.setData({
        page: this.data.page + 1
      });
      this.loadComments(true);
    }
  },

  onCommentInput(e) {
    this.setData({
      commentContent: e.detail.value
    });
  },

  async submitComment() {
    const content = this.data.commentContent.trim();

    if (!content) {
      request.showToast('请输入评论内容');
      return;
    }

    if (this.data.submitting) return;

    this.setData({ submitting: true });

    try {
      // 检查云开发是否可用
      if (!wx.cloud || !wx.cloud.callFunction) {
        console.warn('云开发未配置，模拟评论成功');
        request.showToast('评论成功（模拟）', 'success');

        // 添加模拟评论到列表
        const newComment = {
          _id: 'comment_' + Date.now(),
          _openid: 'current_user',
          userInfo: {
            nickName: '我',
            avatarUrl: 'https://lovebeyonddays.com/common/default-avatar.png'
          },
          content: content,
          likesCount: 0,
          isLiked: false,
          createTime: '刚刚'
        };

        this.setData({
          commentContent: '',
          commentsList: [newComment, ...this.data.commentsList],
          'dynamic.commentsCount': (this.data.dynamic.commentsCount || 0) + 1,
          submitting: false
        });
        this.splitComments();
        return;
      }

      await request.callFunction('addComment', {
        dynamicId: this.data.dynamicId,
        content: content
      }, {
        showLoad: true
      });

      request.showToast('评论成功', 'success');

      // 清空输入框
      this.setData({
        commentContent: '',
        page: 1,
        commentsList: []
      });

      // 重新加载评论列表
      this.loadComments();

      // 更新动态的评论数
      if (this.data.dynamic) {
        this.setData({
          'dynamic.commentsCount': (this.data.dynamic.commentsCount || 0) + 1
        });
      }

    } catch (error) {
      console.error('评论失败:', error);
    } finally {
      this.setData({ submitting: false });
    }
  },

  async onCommentLike(e) {
    const commentId = e.currentTarget.dataset.id;

    try {
      const result = await request.callFunction('toggleLike', {
        targetType: 'comment',
        targetId: commentId
      }, {
        showLoad: false,
        showError: true
      });

      // 找到在 commentsList 中的索引
      const fullIndex = this.data.commentsList.findIndex(c => c._id === commentId);
      if (fullIndex === -1) return;

      const comment = this.data.commentsList[fullIndex];
      const likesChange = result.isLiked ? 1 : -1;

      this.setData({
        [`commentsList[${fullIndex}].isLiked`]: result.isLiked,
        [`commentsList[${fullIndex}].likesCount`]: (comment.likesCount || 0) + likesChange
      });
      this.splitComments();

    } catch (error) {
      console.error('点赞失败:', error);
    }
  },

  onDynamicSubscribe(e) {
    if (this.data.dynamic) {
      this.setData({
        'dynamic.isSubscribed': e.detail.isSubscribed
      });
    }
  },

  onDeleteDynamic() {
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条游龙吗？删除后不可恢复',
      confirmColor: '#ff4d4f',
      success: async (res) => {
        if (res.confirm) {
          try {
            await request.callFunction('deleteDynamic', {
              dynamicId: this.data.dynamicId
            }, { showLoad: true });
            request.showToast('删除成功', 'success');
            wx.setStorageSync('_needRefresh', true);
            setTimeout(() => wx.navigateBack(), 1500);
          } catch (error) {
            console.error('删除失败:', error);
          }
        }
      }
    });
  },

  // 处理分享事件
  onShare(e) {
    console.log('准备分享动态:', this.data.dynamicId);
    // 在详情页中，分享数据直接从 this.data.dynamic 获取
    // onShareAppMessage 会自动被触发
  },

  // 分享给好友
  onShareAppMessage() {
    const dynamic = this.data.dynamic;

    if (!dynamic) {
      return {
        title: '查看游龙详情',
        path: '/pages/dynamics/dynamics'
      };
    }

    // 获取分享标题
    let shareTitle = '';
    if (dynamic.title) {
      shareTitle = dynamic.title;
    } else if (dynamic.content) {
      shareTitle = dynamic.content.length > 30
        ? dynamic.content.substring(0, 30) + '...'
        : dynamic.content;
    } else {
      shareTitle = `${dynamic.userInfo?.nickName || '用户'}的游龙`;
    }

    let shareImageUrl = '';
    if (dynamic.images && dynamic.images.length > 0) {
      shareImageUrl = dynamic.images[0];
    }

    const shareData = {
      title: shareTitle,
      path: `/pages/dynamic-detail/dynamic-detail?id=${this.data.dynamicId}&from=share`
    };

    if (shareImageUrl) {
      shareData.imageUrl = shareImageUrl;
    }

    return shareData;
  },

  onShareTimeline() {
    const dynamic = this.data.dynamic;

    if (!dynamic) {
      return {
        title: '查看游龙详情'
      };
    }

    let shareTitle = '';

    if (dynamic.title) {
      shareTitle = dynamic.title;
    } else if (dynamic.content) {
      shareTitle = dynamic.content.length > 30
        ? dynamic.content.substring(0, 30) + '...'
        : dynamic.content;
    } else {
      shareTitle = `${dynamic.userInfo?.nickName || '用户'}的游龙`;
    }

    let shareImageUrl = '';
    if (dynamic.images && dynamic.images.length > 0) {
      shareImageUrl = dynamic.images[0];
    }

    const shareData = {
      title: shareTitle,
      query: `id=${this.data.dynamicId}&from=share`
    };

    if (shareImageUrl) {
      shareData.imageUrl = shareImageUrl;
    }

    return shareData;
  }
});
