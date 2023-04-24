import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'package:blog_vipot/components/media/media_image_item.dart';
import 'package:blog_vipot/route/route_name.dart';
import '../user_notifier.dart';

class UserImageSection extends StatefulWidget{
  const UserImageSection({super.key});


  @override
  State<UserImageSection> createState() => _UserImageSectionState();
}

class _UserImageSectionState extends State<UserImageSection>{
  @override
  Widget build(BuildContext context) {
    return Consumer<UserNotifier>(
        builder: (_, model, child){
          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                margin: const EdgeInsets.symmetric(horizontal: 5),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text.rich(TextSpan(
                        children: [
                          const TextSpan(text: '相册 '),
                          TextSpan(text: model.imageTotal.toString(), style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 18)),
                        ]
                    ), textAlign: TextAlign.center,),
                    GestureDetector(
                      onTap: (){
                        Navigator.of(context).pushNamed(RouteName.userImageWall,
                            arguments: {'userId': model.userInfo['id']});
                      },
                      child: const Text('全部'),
                    )
                  ],
                ),
              ),
              const SizedBox(height: 6,),
              SizedBox(
                width: MediaQuery.of(context).size.width,
                height: MediaQuery.of(context).size.width / 5,
                child: ListView.builder(
                  shrinkWrap: true,
                  scrollDirection: Axis.horizontal,
                  itemCount: model.mediaList.length,
                  itemBuilder: (_, index){
                    var media = model.mediaList[index];
                    return SizedBox(
                      width: MediaQuery.of(context).size.width / 5,
                      child: RawMaterialButton(
                        onPressed: (){
                          Navigator.of(context).pushNamed(RouteName.mediaDetail, arguments: { 'mediaList': model.mediaList, 'initIndex': index});

                          // Navigator.of(context).pushNamed(RouteName.imagePreview, arguments: { 'imageList': model.mediaList.map((f) => f['file']['url']).toList(), 'initPage': index});
                        },
                        child: MediaImageItem(url: media['file']['url']),
                      ),
                    );
                  },
                ),
              ),
            ],
          );
        }
    );
  }
}