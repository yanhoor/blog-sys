import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class AnimationRippleCircle extends StatefulWidget{
  final Color color;
  final double size;
  int circleCount;
  double minScale;
  double maxScale;

  AnimationRippleCircle({super.key, required this.color, required this.size, this.circleCount = 3, this.minScale = 0.5, this.maxScale = 1});

  @override
  State<AnimationRippleCircle> createState() => _AnimationRippleCircleState();
}

class _AnimationRippleCircleState extends State<AnimationRippleCircle> with SingleTickerProviderStateMixin{
  late AnimationController _controller;
  Animation<double>? opacity;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      // lowerBound: 0.5,
      duration: const Duration(seconds: 3),
    )..forward()..repeat(reverse: true);
    opacity = Tween<double>(
        begin: 1,
        end: 0.5
    ).animate(CurvedAnimation(
        parent: _controller,
        curve: Curves.linear
    ));
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Stack(
          alignment: Alignment.center,
          children: <Widget>[
            // _buildContainer(10),
            Container(
              width: widget.size * 0.8,
              height: widget.size * 0.8,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: widget.color.withOpacity(0.3),
              ),
            ),
            ...List.generate(widget.circleCount, (index){
              int i = index;
              double base = (widget.maxScale - widget.minScale) / widget.circleCount;
              double itemSize = widget.size * base * i;
              return _buildContainer(itemSize);
            }),
            // _buildContainer(20),
            // _buildContainer(30),
            // _buildContainer(40),
            // _buildContainer(50),
            // _buildContainer(60),
            // _buildContainer(70),
            // _buildContainer(80),
            // _buildContainer(90),
            // _buildContainer(100),
            // const Align(child: Icon(Icons.phone_android, size: 44,)),
          ],
        );
      },
    );
  }

  Widget _buildContainer(double rad) {
    double radius = opacity == null ? rad : rad * opacity!.value;
    // print('======$rad====$radius====');
    return Container(
      width: radius,
      height: radius,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: widget.color.withOpacity(1 - (opacity?.value ?? 0)),
      ),
    );
  }
}