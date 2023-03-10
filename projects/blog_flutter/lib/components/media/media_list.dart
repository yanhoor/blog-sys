import 'package:flutter/material.dart';
import 'media_video_item.dart';
import 'media_image_list.dart';

class MediaList extends StatelessWidget{
  final List mediaList;
  late bool isVideo;

  MediaList({super.key, required this.mediaList}){
    isVideo = mediaList.isNotEmpty && getFileExt(mediaList[0]['url']) == 'mp4';
  }

  @override
  Widget build(BuildContext context) {
    return mediaList.isNotEmpty ? Container(
      child: isVideo ? MediaVideoItem(url: mediaList[0]['url']) : MediaImageList(imageList: mediaList)
    ) : Container();
  }

  String getFileExt(String url){
    int idx = url.lastIndexOf('.');
    return url.substring(idx + 1).toLowerCase();
  }

}