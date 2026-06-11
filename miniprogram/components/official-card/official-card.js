Component({
  properties: {
    item: {
      type: Object,
      value: {}
    }
  },

  methods: {
    onShare() {
      this.triggerEvent('share', { item: this.data.item });
    }
  }
});
