# blog-uni

## 注意事项

### 生命周期顺序

页面的 `created` --> 组件的 `created` --> 页面的 `onLoad`

### 监听组件点击事件

如果要监听组件的原生点击事件，需要监听 `tap` 事件。[小程序平台中监听原生的点击事件](https://uniapp.dcloud.net.cn/tutorial/migration-to-vue3.html#%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%B9%B3%E5%8F%B0%E4%B8%AD%E7%9B%91%E5%90%AC%E5%8E%9F%E7%94%9F%E7%9A%84%E7%82%B9%E5%87%BB%E4%BA%8B%E4%BB%B6)