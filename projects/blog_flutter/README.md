# blog_flutter

使用 `Getx` 框架管理路由、状态等，已废弃，在 `blog_vipot` 继续维护。

## Todo List

- [ ] 主页切换 `tab` 后，上一个 `tab` 页面的滚动状态没有记住

- [ ] `BasePageController` 的 `ScrollController` 页面初始化错误时可能会报错：没有绑定的 `widget`，因为这时显示的是错误 `widget`，没有滚动

- [ ] 深色/浅色模式文字、背景等样式适配

- [ ] 时间格式化

- [ ] fix: 多个视频可以同时播放

## 组件

### 需要使部件充满父元素时

```dart
SizedBox(
  width: double.infinity,
  height: double.infinity,
  child: MediaImageItem(
    url: image['url'],
  ),
)

LayoutBuilder(
  builder: (BuildContext context, BoxConstraints constraints) {
    return SizedBox(
      // width: constraints.maxWidth,
      width: double.infinity,
      height: double.infinity,
      // height: constraints.maxHeight,
      child: MediaImageItem(
        url: image['url'],
      ),
    );
  }
)
```
