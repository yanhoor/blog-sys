import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import '../../http/api_url.dart';
import 'package:flutter_svg/flutter_svg.dart';

class MediaImageItem extends StatelessWidget {
  final String src;
  final BoxFit fit;

  const MediaImageItem({super.key, required String url, this.fit = BoxFit.cover})
      : src = ApiUrl.ASSET_BASE + url;

  @override
  Widget build(BuildContext context) {
    return getFileExt(src) == 'svg' ? SvgPicture.network(
      src,
      placeholderBuilder: (BuildContext context) => Container(
          padding: const EdgeInsets.all(20.0),
          child: const CircularProgressIndicator()),
    ) : CachedNetworkImage(
      width: double.infinity,
      height: double.infinity,
      imageUrl: src,
      fit: fit,
      cacheKey: src,
      // progressIndicatorBuilder: (context, url, downloadProgress) =>
      //     SizedBox(
      //       width: 30,
      //       height: 30,
      //       child: CircularProgressIndicator(value: downloadProgress.progress),
      //     ),
      errorWidget: (context, url, error) => const Icon(Icons.error),
    );
  }

  String getFileExt(String url){
    int idx = url.lastIndexOf('.');
    return url.substring(idx + 1).toLowerCase();
  }
}
