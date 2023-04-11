import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:chewie/chewie.dart';
import 'package:video_player/video_player.dart';

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
    globalNotifier = Provider.of<GlobalNotifier>(context);
    // print('+++++++++++++++$url');

    return SizedBox(
      width: MediaQuery.of(context).size.width,
      height: MediaQuery.of(context).size.width * 9 / 16,
      child: Container(
        color: Colors.black,
        child: ClipRRect(
          borderRadius: BorderRadius.circular(15),
          child: Chewie(
            controller: chewieController!,
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
