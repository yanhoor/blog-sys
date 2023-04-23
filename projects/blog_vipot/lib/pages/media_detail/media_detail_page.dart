import 'package:blog_vipot/components/expandable_content.dart';
import 'package:blog_vipot/components/media/media_image_item.dart';
import 'package:card_swiper/card_swiper.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:liquid_swipe/liquid_swipe.dart';

import '../../route/route_name.dart';

class MediaDetailPage extends StatelessWidget{
  final List mediaList;
  late List imageList;
  int initIndex;

  MediaDetailPage({super.key, required this.mediaList, this.initIndex = 0}){
    imageList = mediaList.map((m) => m['file']).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: SafeArea(
        bottom: false,
        child: Swiper(
          index: initIndex,
          // pagination: const SwiperPagination(),
          controller: SwiperController(),
          itemCount: mediaList.length,
          itemBuilder: (_, index){
            var media = mediaList[index];

            return Stack(
              children: [
                SizedBox(
                  width: MediaQuery.of(context).size.width,
                  child: RawMaterialButton(
                    onPressed: (){
                      Navigator.of(context).pushNamed(RouteName.imagePreview, arguments: { 'imageList': imageList.map((f) => f['url']).toList(), 'initPage': index});
                    },
                    child: MediaImageItem(url: media['file']['url'], fit: BoxFit.contain,),
                  ),
                ),
                Align(
                  alignment: const Alignment(-1, 1),
                  child: RawMaterialButton(
                    onPressed: (){
                      Navigator.of(context).pushNamed(RouteName.post,
                          arguments: {'postId': media['blog']['id']});
                    },
                    child: Container(
                      color: const Color.fromRGBO(250, 250, 250, 0.5),
                      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                      child: SafeArea(
                        child: ExpandableContent(
                          style: const TextStyle(color: Colors.black87),
                          content: media['blog']['content'],
                          expandedBtnText: '全文',
                          onTapExpanded: (){
                            Navigator.of(context).pushNamed(RouteName.post,
                                arguments: {'postId': media['blog']['id']});
                          },
                        ),
                      ),
                    ),
                  ),
                )
              ],
            );
          },
        ),
      ),
    );
  }
}