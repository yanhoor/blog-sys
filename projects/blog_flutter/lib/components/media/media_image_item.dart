import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:blog_flutter/http/api_url.dart';
import 'package:flutter_svg/flutter_svg.dart';

class MediaImageItem extends StatelessWidget {
  final String src;

  const MediaImageItem({super.key, required String url})
      : src = ApiUrl.ASSET_BASE + url;

  @override
  Widget build(BuildContext context) {
    return getFileExt(src) == 'svg' ? SvgPicture.network(
      src,
      placeholderBuilder: (BuildContext context) => Container(
          padding: const EdgeInsets.all(20.0),
          child: const CircularProgressIndicator()),
    ) : CachedNetworkImage(
      imageUrl: src,
      fit: BoxFit.cover,
      progressIndicatorBuilder: (context, url, downloadProgress) =>
          Container(
            padding: const EdgeInsets.all(20),
            child: CircularProgressIndicator(value: downloadProgress.progress),
          ),
      errorWidget: (context, url, error) => const Icon(Icons.error),
    );
  }

  String getFileExt(String url){
    int idx = url.lastIndexOf('.');
    return url.substring(idx + 1).toLowerCase();
  }
}
