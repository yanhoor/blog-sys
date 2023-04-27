import 'package:blog_vipot/route/route_name.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class AdvertisePage extends StatefulWidget{
  const AdvertisePage({super.key});

  @override
  State<AdvertisePage> createState() => _AdvertisePageState();
}

class _AdvertisePageState extends State<AdvertisePage> with TickerProviderStateMixin{
  late Animation<int> stepAnimation;
  late AnimationController countdownController;
  int countDownTime = 999; // 秒

  @override
  void initState() {
    super.initState();
    // AnimationController派生自Animation<double>，因此可以在需要Animation对象的任何地方使用。
    // duration表示动画执行的时长，通过它我们可以控制动画的速度。
    countdownController = AnimationController(vsync: this, duration: Duration(seconds: countDownTime));
    countdownController.forward(); // 动画正向启动
    stepAnimation = StepTween(
        begin: countDownTime + 1,
        end: 1
    ).animate(countdownController)..addStatusListener((status) {
      if(status == AnimationStatus.completed){
        // Navigator.of(context).popAndPushNamed(RouteName.root);
        Navigator.of(context).pushNamedAndRemoveUntil(RouteName.root, (route) => false);
        // Navigator.of(context).popUntil(ModalRoute.withName(RouteName.root));
      }
    });
  }

  @override
  void dispose() {
    countdownController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: MediaQuery.of(context).size.width,
        height: MediaQuery.of(context).size.height,
        decoration: const BoxDecoration(
            image: DecorationImage(
                image: AssetImage('lib/assets/welcome/welcome_4.jpeg'),
                fit: BoxFit.fitWidth
            )
        ),
        child: SafeArea(
          child: Align(
            alignment: Alignment.topRight,
            child: CupertinoButton(
                onPressed: (){
                  // Navigator.of(context).pushReplacementNamed(RouteName.root);
                  Navigator.of(context).pushNamedAndRemoveUntil(RouteName.root, (route) => false);
                  // Navigator.of(context).popUntil(ModalRoute.withName(RouteName.root));
                },
                child: AnimatedBuilder(
                  animation: countdownController,
                  builder: (_, child){
                    return Text('跳过 ${stepAnimation.value}');
                  },
                )
            ),
          ),
        ),
      ),
    );
  }
}