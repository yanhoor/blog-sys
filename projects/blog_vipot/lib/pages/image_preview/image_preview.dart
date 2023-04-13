import 'package:blog_vipot/http/api_url.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:photo_view/photo_view.dart';
import 'package:photo_view/photo_view_gallery.dart';

class ImagePreview extends StatelessWidget{
  final List imageList;
  final int initPage;
  late PageController pageController;

  ImagePreview({super.key, required this.imageList, this.initPage = 0}){
    pageController = PageController(initialPage: initPage);
  }

  @override
  Widget build(BuildContext context) {
    ValueNotifier<int> indexNotifier = ValueNotifier(initPage);

    return ValueListenableBuilder(
      valueListenable: indexNotifier,
      builder: (context, value, child){
        return Scaffold(
          backgroundColor: Colors.black,
          body: SafeArea(
            child: PhotoViewGallery.builder(
                enableRotation: false,
                pageController: pageController,
                itemCount: imageList.length,
                scrollPhysics: const BouncingScrollPhysics(),
                loadingBuilder: (context, event) => Container(
                  color: Colors.black,
                  child: Center(
                    child: SizedBox(
                      width: 25.0,
                      height: 25.0,
                      child: CircularProgressIndicator(
                        value: event == null
                            ? 0
                            : event.cumulativeBytesLoaded / event.expectedTotalBytes!,
                      ),
                    ),
                  ),
                ),
                onPageChanged: (index){
                  indexNotifier.value = index;
                },
                builder: (context, index){
                  return PhotoViewGalleryPageOptions(
                      minScale: 0.4,
                      maxScale: 2.0,
                      initialScale: PhotoViewComputedScale.contained,
                      heroAttributes: PhotoViewHeroAttributes(tag: imageList[index]),
                      imageProvider: NetworkImage(ApiUrl.ASSET_BASE + imageList[index])
                  );
                }
            ),
          ),
        );
      },
    );
  }
}
