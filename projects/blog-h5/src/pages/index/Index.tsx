import { useLocation, Outlet, useNavigate } from 'react-router-dom'
import { Tabbar } from 'react-vant'
import {
  Add,
  AddO,
  WapHomeO,
  WapHome,
  Search,
  Chat,
  ChatO,
  Manager,
  ManagerO
} from '@react-vant/icons'
import React, { useState } from 'react'
import { useAppSelector } from '@/store/hooks'

export default function IndexPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const userState = useAppSelector((state) => state.user)

  const pathname = location.pathname.replace('/index', '')
  const [currentTab, setCurrentTab] = useState(pathname || '/index')
  // console.log('===========', location)

  function handleChangeTab(v: string) {
    if (['/new', '/notification', '/my'].includes(v) && !userState.myInfo) {
      navigate('/login')
      return
    }

    setCurrentTab(v)
    navigate(v === '/index' ? '/index' : `/index${v}`)
  }

  return (
    <div className="index-page">
      <Outlet />

      <Tabbar
        border={false}
        value={currentTab}
        onChange={(v) => handleChangeTab(v as string)}
      >
        <Tabbar.Item
          name="/index"
          icon={(active) => (active ? <WapHome /> : <WapHomeO />)}
        >
          首页
        </Tabbar.Item>
        <Tabbar.Item name="/search" icon={<Search />}>
          搜索
        </Tabbar.Item>
        <Tabbar.Item
          name="/new"
          icon={(active) => (active ? <Add /> : <AddO />)}
        >
          发布
        </Tabbar.Item>
        <Tabbar.Item
          name="/notification"
          badge={
            userState.unreadTotal
              ? { content: userState.unreadTotal }
              : undefined
          }
          icon={(active) => (active ? <Chat /> : <ChatO />)}
        >
          通知
        </Tabbar.Item>
        <Tabbar.Item
          name="/my"
          icon={(active) => (active ? <Manager /> : <ManagerO />)}
        >
          我的
        </Tabbar.Item>
      </Tabbar>
    </div>
  )
}
