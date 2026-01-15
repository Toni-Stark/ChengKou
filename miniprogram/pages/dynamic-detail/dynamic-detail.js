const request = require('../../utils/request.js');
const auth = require('../../utils/auth.js');

Page({
  data: {
    dynamicId: '',
    dynamic: null,
    commentsList: [],
    page: 1,
    pageSize: 20,
    hasMore: true,
    loading: false,
    commentContent: '',
    submitting: false,
    fromShare: false // 标记是否从分享进入
  },

  onLoad(options) {
    const { id, from } = options;

    // 标记是否从分享进入
    if (from === 'share') {
      this.setData({ fromShare: true });
      // 尝试静默登录
      this.trySilentLogin();
    }

    if (id) {
      this.setData({ dynamicId: id });
      this.loadDynamic();
      this.loadComments();
    }
  },

  // 尝试静默登录
  async trySilentLogin() {
    try {
      const loginResult = await auth.silentLogin();

      if (loginResult.isRegistered) {
        console.log('静默登录成功，用户:', loginResult.userInfo.nickName);
        // 静默登录成功后，可以刷新页面数据以显示点赞等状态
        if (this.data.dynamicId) {
          this.loadDynamic();
          this.loadComments();
        }
      } else {
        console.log('用户未注册，以游客身份浏览');
      }
    } catch (error) {
      console.error('静默登录失败:', error);
      // 即使失败也继续展示内容
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
      let openid = wx.getStorageSync('openid')
      const result = await request.callFunction('getDynamicDetail', {
        dynamicId: this.data.dynamicId
      }, {
        showLoad: true
      });
      console.log(result)
      this.setData({
        dynamic: openid?result:{}
      });
    } catch (error) {
      console.error('加载动态失败:', error);
      this.loadMockDynamic();
    }
  },

  // 加载模拟动态数据
  loadMockDynamic() {
    const mockDynamic = {}
    let openid = wx.getStorageSync('openid')

    this.setData({
      dynamic: openid?mockDynamic:{}
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

      const newList = loadMore
        ? [...this.data.commentsList, ...result.list]
        : result.list;
      let openid = wx.getStorageSync('openid')

      this.setData({
        commentsList: openid?newList:[],
        hasMore: result.hasMore,
        loading: false
      });
    } catch (error) {
      console.error('加载评论失败:', error);
      this.loadMockComments();
    }
  },

  // 加载模拟评论数据
  loadMockComments() {
    const mockComments = []

    this.setData({
      commentsList: mockComments,
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
            avatarUrl: 'cloud://cloud1-8g5xgr7v7d7daeb3.636c-cloud1-8g5xgr7v7d7daeb3-1300466999/dynamics/1767776497389_2711_5.png'
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
        return;
      }

      // 获取用户信息
      const userInfo = wx.getStorageSync('userInfo');

      await request.callFunction('addComment', {
        dynamicId: this.data.dynamicId,
        content: content,
        userInfo: userInfo
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
    const index = e.currentTarget.dataset.index;

    try {
      const result = await request.callFunction('toggleLike', {
        targetType: 'comment',
        targetId: commentId
      }, {
        showLoad: false,
        showError: true
      });

      // 更新UI
      const comment = this.data.commentsList[index];
      const likesChange = result.isLiked ? 1 : -1;

      this.setData({
        [`commentsList[${index}].isLiked`]: result.isLiked,
        [`commentsList[${index}].likesCount`]: (comment.likesCount || 0) + likesChange
      });

    } catch (error) {
      console.error('点赞失败:', error);
    }
  },

  onDynamicLike(e) {
    console.log('动态点赞:', e.detail);
    // 更新动态的点赞状态
    if (this.data.dynamic) {
      this.setData({
        'dynamic.isLiked': e.detail.isLiked,
        'dynamic.likesCount': e.detail.likesCount
      });
    }
  },

  // 分享给好友
  onShareAppMessage() {
    const dynamic = this.data.dynamic;

    if (!dynamic) {
      return {
        title: '查看动态详情',
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
      shareTitle = `${dynamic.userInfo?.nickName || '用户'}的动态`;
    }

    // 获取分享图片
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

  // 分享到朋友圈
  onShareTimeline() {
    const dynamic = this.data.dynamic;

    if (!dynamic) {
      return {
        title: '查看动态详情'
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
      shareTitle = `${dynamic.userInfo?.nickName || '用户'}的动态`;
    }

    // 获取分享图片
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
