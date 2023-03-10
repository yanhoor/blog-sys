import 'package:flutter/material.dart';
import 'package:video_player/video_player.dart';
import 'package:get/get.dart';
import 'package:blog_flutter/http/api_url.dart';
import 'package:chewie/chewie.dart';

class VideoController extends GetxController {
  late VideoPlayerController videoPlayerController;
  late ChewieController chewieController;
  final String src;

  VideoController({required String url}) : src = ApiUrl.ASSET_BASE + url;

  @override
  void onInit() async {
    super.onInit();
    videoPlayerController = VideoPlayerController.network(src);
    videoPlayerController.initialize();
    chewieController = ChewieController(
      aspectRatio: 9 / 16,
      // showControlsOnInitialize: false,
      videoPlayerController: videoPlayerController,
      // autoPlay: true,
      // looping: true,
    );
  }

  @override
  void onClose() {
    videoPlayerController.dispose();
    chewieController.dispose();
    super.onClose();
  }
}

class MediaVideoItem extends GetView<VideoController> {
  final String url;

  MediaVideoItem({super.key, required this.url}){
    // 使用 tag 避免公用一个 controller
    Get.put<VideoController>(VideoController(url: url), tag: url);
  }

  @override
  VideoController get controller => Get.find<VideoController>(tag: url);

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: Get.width,
      height: Get.width * 9 / 16,
      child: Container(
        color: Colors.black,
        child: Chewie(
          controller: controller.chewieController,
        ),
      ),
    );
  }
}
