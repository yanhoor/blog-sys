import 'package:blog_vipot/components/media/media_audio_player.dart';
import 'package:blog_vipot/components/state/state_unknown_media.dart';
import 'package:flutter/material.dart';
import 'media_video_item.dart';
import 'media_image_list.dart';

class MediaList extends StatelessWidget{
  final List mediaList;
  final int maxCount;
  late bool isImage;

  MediaList({super.key, required this.mediaList, this.maxCount = 9}){
    isImage = mediaList.isNotEmpty && mediaList[0]['file']['type'] == 'image';
  }

  @override
  Widget build(BuildContext context) {
    Widget result;
    if(mediaList.isEmpty){
      return Container();
    }

    var mediaType = mediaList[0]['file']['type'];

    switch(mediaType){
      case 'image':
        result = MediaImageList(imageList: mediaList.map((m) => m['file']).toList(), maxCount: maxCount,);
        break;
      case 'video':
        result = MediaVideoItem(url: mediaList[0]['file']['url'], coverUrl: mediaList[0]['cover'] == null ? '' : mediaList[0]['cover']['url'],);
        break;
      case 'audio':
        if(mediaList[0]['cover'] == null){
          result = MediaAudioPlayer(path: mediaList[0]['file']['url'], size: MediaAudioPlayerType.small,);
        }else{
          result = MediaAudioPlayer(size: MediaAudioPlayerType.large, path: mediaList[0]['file']['url'], coverUrl: mediaList[0]['cover'] == null ? '' : mediaList[0]['cover']['url']);
        }
        break;
      default:
        result = const StateUnknownMedia();
        break;
    }

    return result;
  }

}