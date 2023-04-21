import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:chewie/chewie.dart';
import 'package:video_player/video_player.dart';
import 'package:visibility_detector/visibility_detector.dart';

import '../../http/api_url.dart';
import '../../notifiers/global_notifier.dart';

class MediaVideoItem extends StatefulWidget {
  final String url;

  const MediaVideoItem({super.key, required this.url});

  @override
  State<MediaVideoItem> createState() => _MediaVideoItemState();
}

class _MediaVideoItemState extends State<MediaVideoItem>{
  late GlobalNotifier globalNotifier;
  VideoPlayerController? videoPlayerController;
  ChewieController? chewieController;
  bool isAutoPause = false;

  @override
  void initState() {
    super.initState();
    // context.read<GlobalNotifier>().initVideoPlayController(widget.url);
    videoPlayerController = VideoPlayerController.network( ApiUrl.ASSET_BASE + widget.url);
    videoPlayerController!.initialize();
    chewieController = ChewieController(
      aspectRatio: 9 / 16,
      // showControlsOnInitialize: false,
      videoPlayerController: videoPlayerController!,
      // autoPlay: true,
      // looping: true,
    );
  }

  @override
  Widget build(BuildContext context) {
    globalNotifier = Provider.of<GlobalNotifier>(context, listen: false);
    // print('+++++++++++++++$url');

    return SizedBox(
      width: MediaQuery.of(context).size.width,
      height: MediaQuery.of(context).size.width * 9 / 16,
      child: Container(
        color: Colors.black,
        child: ClipRRect(
          borderRadius: BorderRadius.circular(15),
          child: VisibilityDetector(
              key: ValueKey(widget.url),
              onVisibilityChanged: (visibilityInfo) {
                double visiblePercentage = visibilityInfo.visibleFraction * 100;
                // debugPrint('Widget ${visibilityInfo.key} is $visiblePercentage% visible');
                VideoPlayerValue value = videoPlayerController!.value;
                // debugPrint('================${value.position.compareTo(value.duration)}');
                if(visiblePercentage < 80 && videoPlayerController!.value.isPlaying){
                  videoPlayerController!.pause();
                  isAutoPause = true;
                }else if(visiblePercentage >= 80 && isAutoPause && !value.isPlaying && value.position.compareTo(value.duration) < 0){
                  // 重新进入视野 + 暂停 + 未播放完
                  videoPlayerController!.play();
                  isAutoPause = false;
                }
              },
              child: Listener(
                behavior: HitTestBehavior.translucent,
                onPointerUp: (_){
                  Future.delayed(const Duration(milliseconds: 500)).then((value){
                    // debugPrint('========GestureDetector onPointerUp==========${videoPlayerController!.value.isPlaying}');
                    if(videoPlayerController!.value.isPlaying){
                      if(globalNotifier.videoPlayerController != null && globalNotifier.videoPlayerController !=videoPlayerController && globalNotifier.videoPlayerController!.value.isPlaying) {
                        globalNotifier.videoPlayerController!.pause();
                      }
                      globalNotifier.videoPlayerController = videoPlayerController;
                    }
                  });
                },
                child: Chewie(
                  controller: chewieController!,
                ),
              )
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    super.dispose();
    videoPlayerController?.dispose();
    chewieController?.dispose();
  }
}
