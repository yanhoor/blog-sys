import 'package:flutter/material.dart';
import 'media_video_item.dart';
import 'media_image_list.dart';

class MediaList extends StatelessWidget{
  final List mediaList;
  final int maxCount;
  late bool isVideo;

  MediaList({super.key, required this.mediaList, this.maxCount = 9}){
    isVideo = mediaList.isNotEmpty && getFileExt(mediaList[0]['url']) == 'mp4';
  }

  @override
  Widget build(BuildContext context) {
    return mediaList.isNotEmpty ? Container(
      child: isVideo ? MediaVideoItem(url: mediaList[0]['url']) : MediaImageList(imageList: mediaList, maxCount: maxCount,)
    ) : Container();
  }

  String getFileExt(String url){
    int idx = url.lastIndexOf('.');
    return url.substring(idx + 1).toLowerCase();
  }

}