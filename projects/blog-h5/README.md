# blog-react-h5

`H5` 端博客，使用 `vite` 初始化项目

## 技术栈

`React + React-router-dom + Typescript + ES6 + Tailwind css + Vant + vite`

## 备忘

### 函数组件

- 可以使用 `useRef` 创建 `ref` 引用组件或元素

- `props` 类型：如果需要以嵌套的方式传递子组件，需要定义 `children` 类型的 `props`，嵌套的子组件可以通过 `children` 属性获取

```typescript jsx
import { PropsWithChildren, ReactNode } from 'react'

interface Props {
  className?: string
  children: ReactNode
}

// 也可以使用
// interface Props{ className?: string }
// PropsWithChildren<Props>
export default function YCard({ className, children }: Props) {
  return (
    <Card className={`post-item mb-[8px] ${className}`}>
      <Card.Body style={{ '--rv-card-body-padding': '8px' }}>
        {children}
      </Card.Body>
    </Card>
  )
}

// 这样就可以使用
<YCard>
  <Avatar />
</YCard>
```

### class 组件

- 可以使用 `createRef` 创建 `ref` 引用元素或组件

- `state` 的更新是异步的，多个 `setState()` 调用可能会合并成一个

- `this.props` 和 `this.state` 可能会异步更新，所以不要依赖他们的值来更新下一个状态。可以让 `setState()` 接收一个函数而不是一个对象。这个函数用上一个 `state` 作为第一个参数，将此次更新被应用时的 `props` 做为第二个参数

```javascript
// 错误
this.setState({
  counter: this.state.counter + this.props.increment,
});

// 正确
this.setState((state, props) => ({
  counter: state.counter + props.increment
}));
```

- `setState()` 会将提供的对象**浅合并**到当前的 `state`

```javascript
constructor(props) {
  super(props);
  this.state = {
    posts: [],      
    comments: []    
  };
}

// 这样会替换 this.state.comments，同时 this.state.posts 保留
this.setState({
  comments: response.comments 
})
```
