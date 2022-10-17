export default {
  namespaced: true,
  state: {
    firstGoodsImage: ''
  },
  mutations: {
    updateFirstGoodsImage (state, firstGoodsImage) {
      state.firstGoodsImage = firstGoodsImage;
    }
  }
}
