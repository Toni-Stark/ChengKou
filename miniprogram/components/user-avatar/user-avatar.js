const request = require('../../utils/request.js');

Component({
  properties: {
    src: {
      type: String,
      value: ''
    },
    size: {
      type: String,
      value: 'medium' // small/medium/large
    },
    shape: {
      type: String,
      value: 'circle' // circle/square
    }
  },

  methods: {
    onTap() {
      this.triggerEvent('tap');
    },

    async onImageError() {
      this.setData({ src: '' });
    }
  }
});
