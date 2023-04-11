import 'package:flutter/cupertino.dart';

class NewPostPage extends StatefulWidget{
  const NewPostPage({super.key});

  @override
  State<NewPostPage> createState() => _NewPostPageState();
}

class _NewPostPageState extends State<NewPostPage>{

  @override
  Widget build(BuildContext context) {
    return const Text('newPost');
  }
}