import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class TabViewWrapper extends StatefulWidget{
  final int initTab;
  final bool isScrollable;
  final bool showDropdown;
  final List<String> tabList;
  final IndexedWidgetBuilder pageBuilder;
  final Function(TabController tabController)? onTabChange;

  const TabViewWrapper({super.key, required this.tabList, required this.pageBuilder, this.onTabChange, this.initTab = 0, this.isScrollable = false, this.showDropdown = false});

  @override
  State<TabViewWrapper> createState() => _TabViewWrapperState();

}

class _TabViewWrapperState extends State<TabViewWrapper> with SingleTickerProviderStateMixin{
  late TabController tabController;
  late ValueNotifier<int> tabNotifier;

  @override
  void initState() {
    tabNotifier = ValueNotifier(widget.initTab);
    tabController = TabController(initialIndex: widget.initTab, length: widget.tabList.length, vsync: this);
    tabController.addListener(tabChange);
    super.initState();
  }

  @override
  void dispose() {
    tabController.removeListener(tabChange);
    tabController.dispose();
    tabNotifier.dispose();
    super.dispose();
  }

  tabChange(){
    print('-------------------------TabViewWrapper Tab Changed---------${tabController.index}--------${tabController.previousIndex}----------${tabController.indexIsChanging}');
    tabNotifier.value = tabController.index;
    // if(tabController.indexIsChanging) return; // 避免点击间隔tab时也会执行

    widget.onTabChange?.call(tabController);
  }

  @override
  Widget build(BuildContext context) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;

    return ValueListenableProvider<int>.value(
      value: tabNotifier,
      child: Column(
        children: [
          // 用 stack 盖住 DropdownButton 的值
          Stack(
            children: [
              widget.showDropdown ? DropdownTabs(tabList: widget.tabList, tabController: tabController,) : Container(),
              Container(
                margin: widget.showDropdown ? const EdgeInsets.only(right: 25) : null,
                color: Theme.of(context).scaffoldBackgroundColor,
                child: TabBar(
                  isScrollable: widget.isScrollable,
                  controller: tabController,
                  labelStyle: const TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.bold
                  ),
                  labelColor: Theme.of(context).primaryColor, // 选中的标签
                  unselectedLabelColor: isDark ? Colors.white : Colors.black, // 未选中的标签
                  unselectedLabelStyle: const TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.normal
                  ),
                  indicator: UnderlineTabIndicator(
                    insets: const EdgeInsets.only(left: 15, right: 15),
                    borderSide: BorderSide(width: 2, color: Theme.of(context).primaryColor)
                  ),
                  onTap: (index){
                  },
                  tabs: List.generate(widget.tabList.length, (index) => Tab(child: Text(widget.tabList[index]))),
                ),
              )
            ],
          ),
          Expanded(child: TabBarView(
            controller: tabController,
            children: List.generate(widget.tabList.length, (index) {
              print('-------------------------TabViewWrapper build tab view---------------$index------------${tabController.indexIsChanging}');
              // todo: 问题：当点击某个tab时，前一个相邻tab的页面会先初始化，然后再销毁。如当前在0，点击4，3的页面会初始化；或者当前在4， 点击2， 3也会初始化

              return widget.pageBuilder(context, index);
            }),
          ))
        ],
      )
    );
  }
}

class DropdownTabs extends StatelessWidget{
  final List<String> tabList;
  final TabController tabController;

  const DropdownTabs({super.key, required this.tabList, required this.tabController});

  @override
  Widget build(BuildContext context) {
    int currentIndex = Provider.of<int>(context);
    bool isDark = Theme.of(context).brightness == Brightness.dark;

    return Align(
      alignment: Alignment.topRight,
      child: Theme(
        data: Theme.of(context).copyWith(
          canvasColor: Theme.of(context).primaryColor,
        ),
        child: DropdownButtonHideUnderline(
            child: DropdownButton(
              elevation: 0,
              value: currentIndex,
              style: Theme.of(context).primaryTextTheme.titleMedium,
              items: List.generate(tabList.length, (index) {
                var theme = Theme.of(context);
                var subtitle1 = theme.primaryTextTheme.titleMedium;
                return DropdownMenuItem(
                  value: index,
                  child: Text(
                    tabList[index],
                    style: currentIndex == index
                        ? subtitle1?.apply(
                        fontSizeFactor: 1.15,
                        color: isDark
                            ? theme.colorScheme.secondary
                            : Colors.white)
                        : subtitle1?.apply(color: subtitle1.color?.withAlpha(200)),
                  ),
                );
              }),
              onChanged: (value) {
                tabController.animateTo(value!);
              },
              isExpanded: true,
              icon: Icon(
                Icons.keyboard_arrow_down,
                color: Theme.of(context).primaryColor,
              ),
            )),
      ),
    );
  }
}
