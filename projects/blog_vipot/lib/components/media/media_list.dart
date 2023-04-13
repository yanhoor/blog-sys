import 'package:blog_vipot/utils/file_util.dart';
import 'package:flutter/material.dart';
import 'media_video_item.dart';
import 'media_image_list.dart';

class MediaList extends StatelessWidget{
  final List mediaList;
  final int maxCount;
  late bool isImage;

  MediaList({super.key, required this.mediaList, this.maxCount = 9}){
    isImage = mediaList.isNotEmpty && FileUtil.isImage(mediaList[0]['url']);
  }

  @override
  Widget build(BuildContext context) {
    return mediaList.isNotEmpty ? Container(
      child: isImage ? MediaImageList(imageList: mediaList, maxCount: maxCount,) : MediaVideoItem(url: mediaList[0]['url'])
    ) : Container();
  }

}