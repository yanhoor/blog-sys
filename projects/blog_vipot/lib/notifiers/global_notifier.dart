import 'package:chewie/chewie.dart';
import 'package:flutter/material.dart';
import 'package:video_player/video_player.dart';

import '../http/api_url.dart';

class GlobalNotifier extends ChangeNotifier{
  late PageController homePageController;
  ChewieController? chewieController;

  GlobalNotifier(): homePageController = PageController();

  setCurrentPlayController(ChewieController c){
    if(chewieController != null && chewieController!.isPlaying) chewieController!.pause();
    chewieController = c;
  }

  @override
  void dispose() {
    super.dispose();
    homePageController.dispose();
  }
}