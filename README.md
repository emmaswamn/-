# vueshop

## About
电商后台管理项目

## Bugs and Delays

### Fixed
* 分类参数页面点击new tag后，展开行自动闭合
* 订单列表里使用的省市区信息过旧(2017年)
解决方法：使用高德地图的api获取最新的数据。
参考文章：https://blog.csdn.net/filerat/article/details/124040742

### Pending
* vue-table-with-tree-grid只支持vue2，所以商品列表使用el-tree，但它与el-pagination不能同时使用。目前还没有找到更好的解决方案。



### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
