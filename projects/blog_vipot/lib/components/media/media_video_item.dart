import 'package:blog_vipot/components/media/media_image_item.dart';
import 'package:flutter/material.dart';
import 'package:gallery_saver/gallery_saver.dart';
import 'package:provider/provider.dart';
import 'package:chewie/chewie.dart';
import 'package:video_player/video_player.dart';
import 'package:visibility_detector/visibility_detector.dart';
import 'package:blog_vipot/http/api_url.dart';
import 'package:blog_vipot/notifiers/global_notifier.dart';

import '../helper/bot_toast_helper.dart';

class MediaVideoItem extends StatefulWidget {
  final String url;
  String coverUrl;

  MediaVideoItem({super.key, required this.url, this.coverUrl = ''});

  @override
  State<MediaVideoItem> createState() => _MediaVideoItemState();
}

class _MediaVideoItemState extends State<MediaVideoItem> with AutomaticKeepAliveClientMixin{
  late GlobalNotifier globalNotifier;
  VideoPlayerController? videoPlayerController;
  ChewieController? chewieController;
  bool isAutoPause = false;
  bool showCover = true;

  @override
  bool get wantKeepAlive => true;

  @override
  void initState() {
    super.initState();
    globalNotifier = Provider.of<GlobalNotifier>(context, listen: false);
    // context.read<GlobalNotifier>().initVideoPlayController(widget.url);
    videoPlayerController = VideoPlayerController.network( ApiUrl.ASSET_BASE + widget.url);
    videoPlayerController!.initialize();
    chewieController = ChewieController(
      additionalOptions: (context) {
        return <OptionItem>[
          OptionItem(
            onTap: () {
              GallerySaver.saveVideo(ApiUrl.ASSET_BASE + widget.url).then((success) {
                ToastHelper.success('保存成功');
                Navigator.of(context).pop();
              });
            },
            iconData: Icons.save_alt,
            title: '保存',
          ),
        ];
      },
      aspectRatio: 9 / 16,
      // showControlsOnInitialize: false,
      videoPlayerController: videoPlayerController!,
      // autoPlay: true,
      // looping: true,
    );
  }

  void pauseVideo(){
    if(globalNotifier.videoPlayerController != null && globalNotifier.videoPlayerController != videoPlayerController && globalNotifier.videoPlayerController!.value.isPlaying) {
      globalNotifier.videoPlayerController!.pause();
    }
  }

  @override
  Widget build(BuildContext context) {
    super.build(context);
    // print('+++++++coverUrl++++++++${widget.coverUrl}');

    return SizedBox(
      width: MediaQuery.of(context).size.width,
      height: MediaQuery.of(context).size.width * 9 / 16,
      child: Container(
        color: Colors.black,
        child: ClipRRect(
          // borderRadius: BorderRadius.circular(15),
          child: VisibilityDetector(
            key: ValueKey(widget.url),
            onVisibilityChanged: (visibilityInfo) {
              double visiblePercentage = visibilityInfo.visibleFraction * 100;
              // debugPrint('Widget ${visibilityInfo.key} is $visiblePercentage% visible');
              VideoPlayerValue value = videoPlayerController!.value;
              // debugPrint('================${value.position.compareTo(value.duration)}');
              if(visiblePercentage < 80 && videoPlayerController!.value.isPlaying){
                videoPlayerController!.pause();
                setState(() {
                  isAutoPause = true;
                });
              }else if(visiblePercentage >= 80 && isAutoPause && !value.isPlaying && value.position.compareTo(value.duration) < 0){
                // 重新进入视野 + 暂停 + 未播放完
                videoPlayerController!.play();
                pauseVideo();
                globalNotifier.videoPlayerController = videoPlayerController;
                setState(() {
                  isAutoPause = false;
                });
              }
            },
            child: Stack(
              children: [
                Listener(
                  behavior: HitTestBehavior.translucent,
                  onPointerUp: (_){
                    Future.delayed(const Duration(milliseconds: 500)).then((value){
                      // debugPrint('========GestureDetector onPointerUp==========${videoPlayerController!.value.isPlaying}');
                      if(videoPlayerController!.value.isPlaying){
                        pauseVideo();
                        globalNotifier.videoPlayerController = videoPlayerController;
                      }
                    });
                  },
                  child: Chewie(
                    controller: chewieController!,
                  ),
                ),
                if(widget.coverUrl.isNotEmpty && showCover) Positioned(
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    child: RawMaterialButton(
                      onPressed: (){
                        setState(() {
                          showCover = false;
                          videoPlayerController!.play();
                        });
                      },
                      child: Stack(
                        children: [
                          MediaImageItem(url: widget.coverUrl, width: double.infinity, height: double.infinity,),
                          const Align(
                            alignment: Alignment.center,
                            child: Icon(Icons.play_circle, size: 80, color: Colors.white,),
                          )
                        ],
                      ),
                    )
                )
              ],
            ),
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
