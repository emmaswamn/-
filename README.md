# vueshop

## About

电商后台管理项目

## Bugs and Delays

### Fixed

- 分类参数页面点击 new tag 后，el-table-column expand 自动闭合  
  解决方法：给 el-table 添加 row-key 属性优化渲染
  参考文章：https://blog.csdn.net/lan123456_/article/details/121151196

- 权限列表 -> 分配权限中的 el-tree 组件，在绑定 default-checked-keys 后，节点更新不及时。
  解决方法：添加 v-if 来控制 dialog, 每次使用完组件后销毁。

- 订单列表里使用的省市区信息过旧(2017 年)  
  解决方法：使用高德地图的 api 获取最新的数据。  
  参考文章：https://blog.csdn.net/filerat/article/details/124040742

### Pending

- 商品列表 el-tree 与 el-pagination 不能同时使用。  
  因为 vue-table-with-tree-grid 只支持 vue2，所以使用 el-tree 替代。目前还没有找到更好的解决方案。

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
