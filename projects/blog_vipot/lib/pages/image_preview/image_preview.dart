import 'package:blog_vipot/http/api_url.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:gallery_saver/gallery_saver.dart';
import 'package:photo_view/photo_view.dart';
import 'package:photo_view/photo_view_gallery.dart';

import '../../components/helper/bot_toast_helper.dart';

class ImagePreview extends StatelessWidget{
  final List imageList;
  final int initPage;
  late PageController pageController;
  late Offset _tapPosition;

  ImagePreview({super.key, required this.imageList, this.initPage = 0}){
    pageController = PageController(initialPage: initPage);
  }

  String getFileExt(String url){
    int idx = url.lastIndexOf('.');
    return url.substring(idx + 1).toLowerCase();
  }

  void _storePosition(TapDownDetails details) {
    _tapPosition = details.globalPosition;
  }

  @override
  Widget build(BuildContext context) {
    ValueNotifier<int> indexNotifier = ValueNotifier(initPage);

    return ValueListenableBuilder(
      valueListenable: indexNotifier,
      builder: (context, value, child){
        return Scaffold(
          backgroundColor: Colors.black,
          body: GestureDetector(
            onLongPress: () async {
              String? res = await showMenu<String>(
                  context: context,
                  position: RelativeRect.fromRect(
                      _tapPosition & const Size(40, 40), // smaller rect, the touch area
                      Offset.zero & (Overlay.of(context).context.findRenderObject() as RenderBox).size // Bigger rect, the entire screen
                  ),
                  items: [
                    const PopupMenuItem(value: 'save', child: Text('保存'),),
                  ]
              );

              switch(res){
                case 'save':
                  GallerySaver.saveImage(ApiUrl.ASSET_BASE + imageList[value]).then((success) {
                    ToastHelper.success('保存成功');
                  });
                  break;
              }
            },
            onTapDown: _storePosition,
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
                  String src = imageList[index];

                  return getFileExt(src) == 'svg'
                      ? PhotoViewGalleryPageOptions.customChild(
                    onTapUp: (_, __, v){
                      Navigator.of(context).pop();
                    },
                    child: SvgPicture.network(
                      ApiUrl.ASSET_BASE + src,
                      // placeholderBuilder: (BuildContext context) => Container(
                      //     padding: const EdgeInsets.all(20.0),
                      //     child: const CircularProgressIndicator()),
                    ),
                    // childSize: const Size(300, 300),
                    initialScale: PhotoViewComputedScale.contained,
                    minScale: PhotoViewComputedScale.contained * 0.4,
                    maxScale: PhotoViewComputedScale.covered * 4,
                    heroAttributes: PhotoViewHeroAttributes(tag: src),
                  )
                      : PhotoViewGalleryPageOptions(
                      minScale: PhotoViewComputedScale.contained * 0.4,
                      maxScale: PhotoViewComputedScale.covered * 4,
                      initialScale: PhotoViewComputedScale.contained,
                      heroAttributes: PhotoViewHeroAttributes(tag: src),
                      imageProvider: NetworkImage(ApiUrl.ASSET_BASE + src),
                      onTapUp: (_, __, v){
                        Navigator.of(context).pop();
                      }
                  );
                }
            ),
          ),
        );
      },
    );
  }
}
