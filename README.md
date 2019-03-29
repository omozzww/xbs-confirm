<h1 align="center">xbs-confrim</h1>

# Getting started

#### 1. Install the plugin:

```
npm install --save xbs-confirm
```

#### 2. Add the plugin into your app:

```javascript
import Vue from 'vue'
import XbsConfirm from 'xbs-confirm'

Vue.use(XbsConfirm)
```

#### 3. Use the `this.$xbs.confirm` object

```javascript
// 显示
const _this = this
this.$xbs.confirm.show({
	onCancel() {},
	onConfirm() {}
})

// 隐藏
this.$xbs.confirm.hide()

// 获取显示状态
this.$xbs.confirm.isVisible()
```

#### 4. 属性

| 名字                | 类型    | 默认值       | 说明                                                                       |
| ------------------- | ------- | ------------ | -------------------------------------------------------------------------- |
| title               | string  | false        | 弹窗标题                                                                   |
| content             | string  | false        | 弹窗内容，作为 slot 默认内容，可以是 html 片段，如果使用 slot 该字段会失效 |
| confirm-text        | string  | 确认         | 确认按钮的显示文字                                                         |
| cancel-text         | string  | 取消         | 取消按钮的显示文字                                                         |
| mask-transition     | string  | t-xbs-mask   | 遮罩动画                                                                   |
| dialog-transition   | string  | a-xbs-dialog | 弹窗动画                                                                   |
| show-cancel-button  | boolean | true         | 是否显示取消按钮                                                           |
| show-confirm-button | boolean | true         | 是否显示确定按钮                                                           |

#### 5. 事件

| 名字        | 参数    | 说明                                         |
| ----------- | ------- | -------------------------------------------- |
| @on-cancel  | --      | 点击取消按钮时触发                           |
| @on-confirm | (value) | 点击确定按钮时触发, 参数为 prompt 中输入的值 |
| @on-show    | --      | 弹窗出现时触发                               |
| @on-hide    | --      | 弹窗隐藏时触发                               |

## References

- [vux](https://doc.vux.li/zh-CN/components/confirm.html)
