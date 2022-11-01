import {
  HomeFilled,
  Shop,
  User,
  Location,
  Star,
  Setting,
} from '@element-plus/icons-vue'
import { Component } from 'vue'

interface MenuProps {
  group?: string
  path?: string
  title?: string
  icon?: Component
  children?: Array<MenuProps>
}

const sourceMenus: Array<MenuProps> = [
  {
    // group: '基础',
    title: '首页',
    path: 'home',
    icon: HomeFilled
  },
  {
    title: '个人信息',
    path: 'me',
    icon: User
  },
  {
    title: '博客管理',
    icon: Shop,
    children: [
      {
        // group: '基础',
        title: '博客分类',
        path: 'blogCate'
      },
      {
        // group: '基础',
        title: '博客列表',
        path: 'blog'
      }
    ]
  },
  {
    title: '状态管理',
    icon: Star,
    children: [
      {
        group: '基础',
        title: 'pinia',
        path: '/helloWorld'
      }
    ]
  },
  {
    title: '测试多层菜单1',
    icon: Location,
    children: [
      {
        group: '分组1',
        title: '菜单1-1',
        children: [
          {
            group: '分组1-1',
            title: '菜单1-1-1'
          }
        ]
      },
      {
        title: '菜单1-2',
        children: [
          {
            group: '分组1-2',
            title: '菜单1-2-1'
          }
        ]
      },
      {
        title: '菜单1-3',
        children: [
          {
            title: '菜单1-3-1',
            children: [
              {
                title: '菜单1-3-4-1',
                children: [
                  {
                    title: '菜单1-3-5-1',
                    children: [
                      {
                        title: '菜单1-3-6-1'
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        title: '菜单1-4'
      }
    ]
  }
]

// 构建符合 el-menu 的菜单结构，主要是分组处理
function buildMenuList(list: Array<any>, lastIndex?: number | string): Array<any> {
  const result: Array<any> = []
  list.forEach((menu, index) => {
    const menuIndex = lastIndex ? lastIndex + '-' + (index + 1) : index + 1
    if (menu.children) {
      const children = buildMenuList(menu.children, menuIndex )
      menu = { ...menu, children, menuIndex }
    }

    const group = result.find(i => i.group === menu.group)
    menu = { ...menu, menuIndex }
    if (menu.group && group) {
      // menu = { ...menu, menuIndex }
      group.children.push(menu)
    }
    else if (menu.group) {
      // menu = { ...menu, menuIndex }
      result.push({
        groupTitle: menu.group,
        children: [menu]
      })
    }
    else {
      // menu = { ...menu, menuIndex }
      const otherGroup = result.find(i => i.groupTitle === '其他')
      otherGroup
        ? otherGroup.children.push(menu)
        : result.push({
            groupTitle: '其他',
            children: [menu]
          })
    }
  })
  const isOnlyOther = result.every(i => i.groupTitle === '其他')
  // 如果有且只有一个其他分组，就不分组
  return isOnlyOther ? result[0].children : result
}

const menuList = buildMenuList(sourceMenus)

export default menuList
