import 'package:flutter/cupertino.dart';
import 'package:provider/provider.dart';

class ProviderWidget<T extends ChangeNotifier> extends StatefulWidget{
  final T model;
  Widget? child;
  final Widget Function(BuildContext context, T value, Widget? child) builder;
  final Function(T model)? onModelReady;

  ProviderWidget({super.key, required this.model, this.onModelReady, this.child, required this.builder, });

  @override
  State<ProviderWidget<T>> createState() => _ProviderWidgetState<T>();
}

class _ProviderWidgetState<T extends ChangeNotifier> extends State<ProviderWidget<T>>{
  late T model;

  @override
  void initState() {
    super.initState();
    model = widget.model;
    widget.onModelReady?.call(model);
    debugPrint('-------------_ProviderWidgetState initState-------${model.runtimeType}-----------');
  }

  @override
  void dispose() {
    super.dispose();
    debugPrint('-------------_ProviderWidgetState dispose----${model.runtimeType}--------------');
    model.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider.value(
      value: model,
      child: Consumer<T>(
        builder: widget.builder,
        child: widget.child,
      ),
    );
    ///
    /// 下面这种写法会自动调用ChangeNotifier的dispose()，所以这样就不要在上面的dispose调用model.dispose();
    /// return ChangeNotifierProvider(
    //       create: (_) => model,
    //       child: Consumer<T>(
    //         builder: widget.builder,
    //         child: widget.child,
    //       ),
    //     );
  }
}


class ProviderWidget2<A extends ChangeNotifier, B extends ChangeNotifier>
    extends StatefulWidget {
  final Widget Function(BuildContext context, A model1, B model2, Widget? child)
  builder; // 方法变量 返回类型/方法类型
  final A model1;
  final B model2;
  final Widget? child;
  final Function(A model1, B model2) onModelReady;
  final bool autoDispose;

  const ProviderWidget2({
    super.key,
    required this.model1,
    required this.model2,
    required this.onModelReady,
    this.autoDispose = true,
    this.child,
    required this.builder,
  });

  @override
  State<ProviderWidget2<A, B>> createState() => _ProviderWidgetState2<A, B>();
}

class _ProviderWidgetState2<A extends ChangeNotifier, B extends ChangeNotifier>
    extends State<ProviderWidget2<A, B>> {
  late A model1;
  late B model2;

  @override
  void initState() {
    super.initState();
    model1 = widget.model1;
    model2 = widget.model2;
    widget.onModelReady.call(model1, model2);
  }

  @override
  void dispose() {
    super.dispose();
    if (widget.autoDispose) {
      model1.dispose();
      model2.dispose();
    }
  }

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
        providers: [
          ChangeNotifierProvider<A>.value(value: model1),
          ChangeNotifierProvider<B>.value(value: model2),
        ],
        child: Consumer2<A, B>(
          builder: widget.builder,
          child: widget.child,
        ));
  }
}
