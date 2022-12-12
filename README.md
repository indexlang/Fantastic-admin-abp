# Fantastic-admin-abp
Fantastic-admin商业版easyabp 代码生成器
# 使用方法：
1. 替换plopfile.js
2. 在plop-templates添加abpcrud文件夹
3. 修改plopfile line 6 为你abp 服务的地址
4. 仅适用与easyabp crud产生的代码，欢迎大家修改更正
# 示例
```
PS H:\fantastic> pnpm new

> @2.1.0 new H:\fantastic
> plop

? 请选择需要创建的模式： ABPModule - 创建标准模块（包含列表页&详情页）
? 选择模块 XXXXXXX
? 选择服务 Crstech.XXXXXXX.XXXXXXAppService
? 请选择模块创建目录 src/views/XXXXXXX
? 请输入模块名 XXXXXXX
? 请输入模块中文名称 XXXXXXX
✔  ++ \src\views\XXXXXXX\list.vue
✔  ++ \src\views\XXXXXXX\detail.vue
✔  ++ \src\views\XXXXXXX\components\DetailForm\index.vue
✔  ++ \src\views\XXXXXXX\components\FormMode\index.vue
```
