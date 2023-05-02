import 'package:blog_vipot/components/animation/animation_ripple_circle.dart';
import 'package:blog_vipot/components/custom/custom_icon_button.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:just_audio/just_audio.dart';

import '../../http/api_url.dart';
import 'media_audio_player_common.dart';
import 'media_image_item.dart';

enum MediaAudioPlayerType{
  mini,
  small,
  medium,
  large
}

class MediaAudioPlayer extends StatefulWidget{
  final bool isAbsolutePath;
  final String path;
  final String? coverUrl;
  MediaAudioPlayerType size;

  MediaAudioPlayer({super.key, required this.path, this.size = MediaAudioPlayerType.small, this.coverUrl, this.isAbsolutePath = false});

  @override
  State<MediaAudioPlayer> createState() => _MediaAudioPlayerState();
}

class _MediaAudioPlayerState extends State<MediaAudioPlayer> with WidgetsBindingObserver{
  final _player = AudioPlayer();

  @override
  void initState() {
    super.initState();
    ambiguate(WidgetsBinding.instance)!.addObserver(this);
    _init();
  }

  Future<void> _init() async {
    // Inform the operating system of our app's audio attributes etc.
    // We pick a reasonable default for an app that plays speech.
    // final session = await AudioSession.instance;
    // await session.configure(const AudioSessionConfiguration.speech());
    // Listen to errors during playback.
    _player.playbackEventStream.listen((PlaybackEvent event) {
      // print('=============$event');
    },
        onError: (Object e, StackTrace stackTrace) {
          print('A stream error occurred: $e');
        });
    // Try to load audio from a source and catch any errors.
    try {
      // AAC example: https://dl.espressif.com/dl/audio/ff-16b-2c-44100hz.aac
      await _player.setAudioSource(AudioSource.uri(Uri.parse(widget.isAbsolutePath ? widget.path : ApiUrl.ASSET_BASE + widget.path)));
    } catch (e) {
      print("Error loading audio source: $e");
    }
  }

  @override
  void dispose() {
    ambiguate(WidgetsBinding.instance)!.removeObserver(this);
    // Release decoders and buffers back to the operating system making them
    // available for other apps to use.
    _player.dispose();
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.paused) {
      // Release the player's resources when not in use. We use "stop" so that
      // if the app resumes later, it will still remember what position to
      // resume from.
      _player.stop();
    }
  }

  @override
  Widget build(BuildContext context) {
    switch(widget.size){
      case MediaAudioPlayerType.mini:
        return MiniControlButtons(player: _player,);
      case MediaAudioPlayerType.small:
        return SmallControlButtons(_player);
      case MediaAudioPlayerType.large:
        return LargeControlButtons(player: _player, coverUrl: widget.coverUrl!,);
      default:
        return MiniControlButtons(player: _player,);
    }
  }
}

String getProgressText(Duration diff){
  String result = '';

  int m = diff.inMinutes;
  if(m > 0) result += '${m % 60}´';
  int sec = diff.inSeconds;
  if(sec > 0) {
    result += '${sec % 60} ˝';
  }else{
    result = '0 ˝';
  }

  return result;
}

String getProgressPadText(Duration dur){
  String result = '';

  int m = dur.inMinutes;
  result += '${(m % 60).toString().padLeft(2, '0')}:';
  int sec = dur.inSeconds;
  result += (sec % 60).toString().padLeft(2, '0');

  return result;
}

class MiniControlButtons extends StatelessWidget{
  final AudioPlayer player;

  const MiniControlButtons({super.key, required this.player});

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<PlayerState>(
        stream: player.playerStateStream,
        builder: (context, snapshot) {
          final playerState = snapshot.data;
          final processingState = playerState?.processingState;
          final playing = playerState?.playing;
          // print('=========$playerState====$ProcessingState=');
          if (processingState == ProcessingState.loading ||
              processingState == ProcessingState.buffering) {
            return const SizedBox(
              // margin: const EdgeInsets.all(8.0),
              width: 24,
              height: 24,
              child: CircularProgressIndicator(),
            );
          }else{
            return GestureDetector(
              onTap: (){
                if(playing != true){
                  player.play();
                }else if(processingState == ProcessingState.completed){
                  player.seek(Duration.zero);
                }else{
                  player.stop();
                  player.seek(Duration.zero);
                }
              },
              child: Row(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  playing == true && processingState != ProcessingState.completed ? SizedBox(
                    width: 24,
                    height: 24,
                    child: AnimationRippleCircle(size: 24, color: Theme.of(context).colorScheme.primary,circleCount: 5, maxScale: 1.5, minScale: 0.3,),
                  ) : const Icon(Icons.play_arrow),
                  const SizedBox(width: 4,),
                  if(player.duration != null) Text(getProgressText(player.duration!)),
                ],
              ),
            );
          }
        }
    );
  }
}

/// Displays the play/pause button and volume/speed sliders.
class SmallControlButtons extends StatelessWidget {
  final AudioPlayer player;
  final double iconSize;

  const SmallControlButtons(this.player, {Key? key, this.iconSize = 20}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return OutlinedButton(
        onPressed: (){},
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Opens volume slider dialog
            // IconButton(
            //   icon: const Icon(Icons.volume_up),
            //   onPressed: () {
            //     showSliderDialog(
            //       context: context,
            //       title: "音量",
            //       divisions: 10,
            //       min: 0.0,
            //       max: 1.0,
            //       value: player.volume,
            //       stream: player.volumeStream,
            //       onChanged: player.setVolume,
            //     );
            //   },
            // ),

            /// This StreamBuilder rebuilds whenever the player state changes, which
            /// includes the playing/paused state and also the
            /// loading/buffering/ready state. Depending on the state we show the
            /// appropriate button or loading indicator.
            StreamBuilder<PlayerState>(
              stream: player.playerStateStream,
              builder: (context, snapshot) {
                final playerState = snapshot.data;
                final processingState = playerState?.processingState;
                final playing = playerState?.playing;
                if (processingState == ProcessingState.loading ||
                    processingState == ProcessingState.buffering) {
                  return SizedBox(
                    // margin: const EdgeInsets.all(8.0),
                    width: iconSize,
                    height: iconSize,
                    child: const CupertinoActivityIndicator(),
                  );
                } else if (playing != true) {
                  return Row(
                    children: [
                      CustomIconButton(
                        icon: const Icon(Icons.play_arrow),
                        iconSize: iconSize,
                        onPressed: player.play,
                      ),
                      // if(processingState == ProcessingState.ready) CustomIconButton(
                      //   icon: const Icon(Icons.stop),
                      //   iconSize: iconSize,
                      //   onPressed: (){
                      //     player.stop();
                      //     player.seek(Duration.zero);
                      //   },
                      // )
                    ],
                  );
                } else if (processingState != ProcessingState.completed) {
                  return Row(
                    children: [
                      CustomIconButton(
                        icon: const Icon(Icons.pause),
                        iconSize: iconSize,
                        onPressed: player.pause,
                      ),
                      CustomIconButton(
                        icon: const Icon(Icons.stop),
                        iconSize: iconSize,
                        onPressed: (){
                          player.stop();
                          player.seek(Duration.zero);
                        },
                      )
                    ],
                  );
                } else {
                  return CustomIconButton(
                    icon: const Icon(Icons.replay),
                    iconSize: iconSize,
                    onPressed: () => player.seek(Duration.zero),
                  );
                }
              },
            ),
            const SizedBox(width: 4,),
            StreamBuilder<Duration?>(
              stream: player.durationStream,
              builder: (context, snapshot) {
                final duration = snapshot.data ?? Duration.zero;
                return StreamBuilder<Duration>(
                  stream: player.createPositionStream(),
                  builder: (context, snapshot) {
                    var position = snapshot.data ?? Duration.zero;
                    if (position > duration) {
                      position = duration;
                    }
                    Duration diff = duration - position;
                    // print('==============$duration====$position====$diff');
                    // return Text('${player.bufferedPosition.inSeconds}');
                    return duration.compareTo(position) <= 0
                        ? Text(getProgressText(duration))
                        : Text(getProgressText(diff));
                    // return SeekBar(
                    //   duration: duration,
                    //   position: position,
                    //   bufferedPosition: player.bufferedPosition,
                    //   onChangeEnd: (newPosition) {
                    //     player.seek(newPosition);
                    //   },
                    // );
                  },
                );
              },
            ),
            // Opens speed slider dialog
            // StreamBuilder<double>(
            //   stream: player.speedStream,
            //   builder: (context, snapshot) => IconButton(
            //     icon: Text("${snapshot.data?.toStringAsFixed(1)}x",
            //         style: const TextStyle(fontWeight: FontWeight.bold)),
            //     onPressed: () {
            //       showSliderDialog(
            //         context: context,
            //         title: "播放速度",
            //         divisions: 10,
            //         min: 0.5,
            //         max: 1.5,
            //         value: player.speed,
            //         stream: player.speedStream,
            //         onChanged: player.setSpeed,
            //       );
            //     },
            //   ),
            // ),
          ],
        )
    );
  }
}

class LargeControlButtons extends StatelessWidget{
  final AudioPlayer player;
  final String coverUrl;

  const LargeControlButtons({super.key, required this.coverUrl, required this.player});

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<PlayerState>(
        stream: player.playerStateStream,
        builder: (context, snapshot) {
          final playerState = snapshot.data;
          final processingState = playerState?.processingState;
          final playing = playerState?.playing;
          Widget content;
          // print('=========$playerState====$ProcessingState=');
          if (processingState == ProcessingState.loading ||
              processingState == ProcessingState.buffering) {
            content = const SizedBox(
              // margin: const EdgeInsets.all(8.0),
              width: 24,
              height: 24,
              child: CircularProgressIndicator(),
            );
          }else{
            content = GestureDetector(
              onTap: (){
                if(playing != true){
                  player.play();
                }else if(processingState == ProcessingState.completed){
                  player.seek(Duration.zero);
                }else{
                  player.stop();
                  player.seek(Duration.zero);
                }
              },
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Icon(playing == true && processingState != ProcessingState.completed ? Icons.pause_circle : Icons.play_circle, size: 80, color: Colors.white,),
                  const SizedBox(height: 8,),
                  if(player.duration != null) StreamBuilder<Duration?>(
                    stream: player.durationStream,
                    builder: (context, snapshot) {
                      final duration = snapshot.data ?? Duration.zero;
                      return StreamBuilder<Duration>(
                        stream: player.createPositionStream(),
                        builder: (context, snapshot) {
                          var position = snapshot.data ?? Duration.zero;
                          if (position > duration) {
                            position = duration;
                          }
                          Duration diff = duration - position;
                          // print('==============$duration====$position====$diff');
                          // return Text('${player.bufferedPosition.inSeconds}');
                          return Text('${getProgressPadText(position)}/${getProgressPadText(duration)}', style: const TextStyle(color: Colors.white, fontSize: 18),);
                          // return SeekBar(
                          //   duration: duration,
                          //   position: position,
                          //   bufferedPosition: player.bufferedPosition,
                          //   onChangeEnd: (newPosition) {
                          //     player.seek(newPosition);
                          //   },
                          // );
                        },
                      );
                    },
                  ),
                ],
              ),
            );
          }

          return SizedBox(
            width: MediaQuery.of(context).size.width,
            height: MediaQuery.of(context).size.width * 9 / 16,
            child: Stack(
              alignment: Alignment.center,
              children: [
                MediaImageItem(url: coverUrl, ratio: 70, width: double.infinity, height: double.infinity,),
                content
              ],
            ),
          );
        }
    );
  }
}
