import 'package:blog_vipot/components/y_pagination.dart';
import 'package:blog_vipot/config/index.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:liquid_swipe/liquid_swipe.dart';

import '../../route/route_name.dart';
import '../../storage/storage_manager.dart';

class WelcomePage extends StatefulWidget{

  const WelcomePage({super.key});

  @override
  State<WelcomePage> createState() => _WelcomePageState();

}

class _WelcomePageState extends State<WelcomePage>{
  final List<String> imageList = [
    'lib/assets/welcome/welcome_1.jpeg',
    'lib/assets/welcome/welcome_2.jpeg',
    'lib/assets/welcome/welcome_3.jpeg',
    'lib/assets/welcome/welcome_4.jpeg',
    'lib/assets/welcome/welcome_5.jpeg'
  ];
  int currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () async => false,
      child: Scaffold(
        body: LiquidSwipe(
          pages: List.generate(imageList.length, (index) => Stack(
            children: [
              WelcomeItem(imageUrl: imageList[index], isLast: index == imageList.length - 1,),
              Align(
                  alignment: Alignment.bottomCenter,
                  child: SafeArea(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        if(currentIndex == imageList.length - 1) RawMaterialButton(
                          fillColor: Colors.green,
                          shape: const StadiumBorder(),
                          onPressed: (){
                            MyStorageManager.sharedPreferences.setString(MyStorageManager.VERSION, MyConfig.version);

                            Navigator.of(context).pushReplacementNamed(RouteName.advertise);
                          },
                          child: const Text('立即体验', style: TextStyle(color: Colors.white),),
                        ),
                        const SizedBox(height: 12,),
                        YPagination(amount: imageList.length, current: currentIndex,),
                      ],
                    ),
                  )
              )
            ],
          ),),
          enableLoop: true,
          waveType: WaveType.liquidReveal,
          onPageChangeCallback: (index){
            setState(() {
              currentIndex = index;
            });
            // print('----------------$index');
          },
        ),
      ),
    );
  }
}

class WelcomeItem extends StatelessWidget{
  final String imageUrl;
  final bool isLast;

  const WelcomeItem({super.key, required this.imageUrl, required this.isLast});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        image: DecorationImage(image: AssetImage(imageUrl), fit: BoxFit.cover),
      )
    );
  }
}