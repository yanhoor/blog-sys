import 'dart:async';

import 'package:flutter/cupertino.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:record/record.dart';

class MediaAudioRecord extends StatefulWidget{
  final Function(String path) onComplete;

  const MediaAudioRecord({super.key, required this.onComplete});

  @override
  State<MediaAudioRecord> createState() => _MediaAudioRecordState();
}

class _MediaAudioRecordState extends State<MediaAudioRecord>{
  final Record _audioRecorder = Record();
  StreamSubscription<RecordState>? _recordSub;
  RecordState _recordState = RecordState.stop;
  StreamSubscription<Amplitude>? _amplitudeSub;
  Amplitude? _amplitude;
  int _recordDuration = 0;
  Timer? _recordTimer;

  @override
  void initState() {
    debugPrint('========_MediaAudioRecordState===initState======');
    _recordSub = _audioRecorder.onStateChanged().listen((recordState) {
      debugPrint('=====_recordState========$_recordState');
      setState(() => _recordState = recordState);
    });

    // 声音波形
    _amplitudeSub = _audioRecorder
        .onAmplitudeChanged(const Duration(milliseconds: 300))
        .listen((amp) => setState(() => _amplitude = amp));

    super.initState();
  }

  @override
  void dispose() {
    debugPrint('========_MediaAudioRecordState===dispose======');
    _recordTimer?.cancel();
    _recordSub?.cancel();
    _amplitudeSub?.cancel();
    _audioRecorder.dispose();
    super.dispose();
  }

  Future<void> _startRecord() async {
    try {
      if (await _audioRecorder.hasPermission()) {
        // We don't do anything with this but printing
        final isSupported = await _audioRecorder.isEncoderSupported(
          AudioEncoder.aacLc,
        );
        if (kDebugMode) {
          print('${AudioEncoder.aacLc.name} supported: $isSupported');
        }

        // final devs = await _audioRecorder.listInputDevices();
        // final isRecording = await _audioRecorder.isRecording();

        await _audioRecorder.start();

        setState(() {
          _recordDuration = 0;
        });

        _startRecordTimer();

      }
    } catch (e) {
      if (kDebugMode) {
        print(e);
      }
    }
  }

  _startRecordTimer(){
    _recordTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      setState(() {
        _recordDuration ++;
      });
    });
  }

  Future<void> _pause() async {
    _recordTimer?.cancel();
    await _audioRecorder.pause();
  }

  Future<void> _resume() async {
    _startRecordTimer();
    await _audioRecorder.resume();
  }

  Future<void> _stop() async {
    _recordTimer?.cancel();
    setState(() {
      _recordDuration = 0;
    });

    String? path = await _audioRecorder.stop();

    if (path != null) {
      debugPrint('=======结束录制，文件地址====$path');
      widget.onComplete(path);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.start,
          children: [
            IconButton(
              iconSize: 48,
                onPressed: (){
                  if(_recordState == RecordState.stop){
                    _startRecord();
                  } else if(_recordState == RecordState.pause){
                    _resume();
                  } else{
                    _pause();
                  }
                },
                icon: Icon(_recordState != RecordState.record ? Icons.play_circle_outline : Icons.pause_circle_outline)
            ),
            if(_recordState != RecordState.stop) IconButton(
              iconSize: 48,
              icon: const Icon(Icons.stop_circle_outlined),
              onPressed: () {
                _stop();
              },
            )
          ],
        ),
        const SizedBox(height: 12,),
        if(_recordState == RecordState.stop) const Text('点击录制')
        else Text('录制时间：${(Duration(seconds: _recordDuration).inMinutes % 60).toString().padLeft(2, '0')}:${(Duration(seconds: _recordDuration).inSeconds % 60).toString().padLeft(2, '0')}', style: const TextStyle(fontWeight: FontWeight.w600),)
      ],
    );
  }
}