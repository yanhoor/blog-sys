# blog_vipot

## 待解决

- 博客详情下面的评论回复，点击用户名怎么进入主页？

- 上传进度条

## 备忘

### 常用变量

- `ModalRoute.of(context).settings.name`: 当前页面路由名

- `Platform.operatingSystem`: 当前的操作系统，`Platform` 还有很多其他变量

### 小技巧

#### padding 部分无法响应点击

使用 `GestureDetector` 时添加属性 `behavior: HitTestBehavior.opaque`

#### TextField

限制高度，可以使用 `SizeBox` 包裹，`maxLength`、`decoration.counter` 等属性会导致文字和 `prefixIcon` 等不纵向对齐

#### 文本显示

一般可以使用 `Text.rich`，如果需要支持选择复制，可以使用 `SelectableText.rich`，这两个都要求里面的子元素是 `TextSpan` 或 `WidgetSpan`，`WidgetSpan` 的子元素可以是任意 `widget`（但不能是 `TextSpan`）

- `WidgetSpan` 里面的 `Text` 会在其父文本区域内占据方形空间，即如果两个 `WidgetSpan` 在一起，里面的文本足够长（换行），这两个 `WidgetSpan` 会独立显示成两列，而不是两个的文本串联

- 如果 `TextSpan` 需要点击，可以使用它的 `recognizer` 属性

- 支持文本选择还可以使用 `SelectionArea` 包裹文本元素，如果内部的某个文本不需要选择，可以再用 `SelectionContainer.disabled` 包裹该元素

### 可滚动view

- `ListView`

- `GridView`

- `SingleChildScrollView`

- `CustomScrollView`

- `NestedScrollView`

`ScrollView` 一般有两个参数：`primary` 和 `controller`，主要用于确定绑定的 `scrollController` 是使用 `controller` 还是使用最近的父级的 `PrimaryScrollController` 中的 `scrollController`，所以 `primary: true` 时，`controller` 不能赋值。

#### scrollController 的滚动位置为 0

`SingleChildScrollView` 内使用 `ListView` 时会有这个问题，例如首页和通知页面，`SingleChildScrollView` 的 `scrollController` 会获取不到滚动位置，目前解决方法是不使用 `SingleChildScrollView`，直接使用 `ListView`。

#### 使用 CustomScrollView 时，ios 端不能点击状态栏返回顶部

[参考](https://github.com/flutter/flutter/issues/92119)

#### 获取最近的 ScrollController

可以使用 `PrimaryScrollController.of(context)` 获取，但是[在 `CustomScrollView` 获取不到](https://github.com/flutter/flutter/issues/118620)

#### 获取滚动位置

[参考](https://stackoverflow.com/questions/43881103/current-scroll-offset-inside-a-flutter-listview-sliverlist-etc)

- If you're inside the scroll view use Scrollable.of(context).position.pixels.
    
- If you're outside, you probably want to hand a ScrollController in as the controller argument of the scroll view, then you can read controller.offset.
    
- Alternatively, use scroll notifications with NotificationListener.

  ```dart
  NotificationListener(
    child: ListView(
      controller: _scrollController,
      children: ...
    ),
    onNotification: (notification) {
      if (notification is ScrollEndNotification) {
        print(_scrollController.position.pixels);
      }
      return false;
    },
  )
  ```

### 监听系统外观切换

```dart
@override
void initState() {
  super.initState();

  var window = WidgetsBinding.instance!.window;
  window.onPlatformBrightnessChanged = () {
    WidgetsBinding.instance?.handlePlatformBrightnessChanged();
    // This callback is called every time the brightness changes.
    var brightness = window.platformBrightness;
  };
}
```

或者下面：

```dart
class _MyHomePageState extends State<MyHomePage> with WidgetsBindingObserver {
  @override
  void initState() {
    WidgetsBinding.instance?.addObserver(this);
    super.initState();
  }

  @override
  void dispose() {
    WidgetsBinding.instance?.removeObserver(this);
    super.dispose();
  }

  @override
  void didChangePlatformBrightness() {
    var brightness = Theme.of(context).brightness;
    super.didChangePlatformBrightness();
  }
}
```

## 实用的依赖

- `visibility_detector`: 能获取 `widget` 在视野区域显示的百分比

- `flutter_launcher_icons`: 命令行式生成桌面图标，命令 `flutter pub run flutter_launcher_icons`

- `flutter_native_splash`: 命令行式生成闪屏，命令 `flutter pub run flutter_native_splash:create`

- `flutter_slidable`: 实现类似微信聊天左右滑动删除

- `flutter_local_notifications`: 系统本地通知

- `reorderables`: 长按拖动排序

- `permission_handler`: 动态申请权限

- `image_picker`: 选择图片或视频

## 注意事项

### 同一个页面不要嵌套多个 `Scaffold`

可能会造成在 `ios` 点击状态栏时不能返回顶部

### 遇到莫名其妙的问题，建议加 `key`

比如一些 `statefulWidget` 明明在显示，但是其 `dispose` 已经执行。这时候可以加 `key`。比如在博客发布页面，录音上传后，`MediaAudioRecord` 会 `dispose`，导致这时候点击录音无效。在其父元素添加 `key: const ValueKey('audio-record-section')` 后正常。
