import 'package:flutter/material.dart';
import 'media_image_item.dart';

class MediaImageList extends StatelessWidget{
  final List imageList;
  final int maxCount;
  final int crossAxisCount;
  late List filterImageList;

  MediaImageList({super.key, required this.imageList, this.crossAxisCount = 3, this.maxCount = 9}){
    filterImageList = imageList.take(maxCount).toList();
  }

  @override
  Widget build(BuildContext context) {
    return GridView.count(
      shrinkWrap:true,
      crossAxisCount: crossAxisCount,
      mainAxisSpacing: 0,
      crossAxisSpacing: 0,
      // childAspectRatio: 1/1.6, // 子控件宽高比，默认为1，即相等
      padding: const EdgeInsets.all(0),
      physics: const NeverScrollableScrollPhysics(), // 禁止滑动
      children: filterImageList.map((image) {
        int idx = filterImageList.indexOf(image);

        return Stack(
          children: [
            SizedBox(
              width: double.infinity,
              height: double.infinity,
              child: MediaImageItem(
                url: image['url'],
              ),
            ),
            if(imageList.length > filterImageList.length && idx == filterImageList.length - 1) Align(
              alignment: Alignment.center,
              child: GestureDetector(
                  onTap: (){},
                  child: Text('+${imageList.length - filterImageList.length}', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 24),)
              ),
            )
          ],
        );
      }).toList(),
    );
  }


}