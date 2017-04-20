# Image Usage

最近突然发现 项目中的图片有好多都是没有引用的，    
决定写一个脚本把没用的图片都找出来，删掉。

于是就有这个工具


### 配置

首先安装 npm 包

	npm install

link 一下，增加自定义方法

	npm link


运行 查看所有方法，目前只有两个

	imu


### 使用

	cd /你的项目/

	imu new


这个时候会提示输入 图片文件夹的路径 如：images

	这个时候它会遍历 images 目录 找出 图片，

	并且缓存图片路径 images/logo.png

	然后它会去你项目中所有文件（ 除了部分文件夹 /node_modules/ | _tmp ）中查找 代码中是否有 images/logo.png

然后会生成一个图片引用关系 json 在 ./_tmp/match.js


### 删除文件

	如果运行过 imu new 找到未引用的图片后

	可以运行 imu delete 来删除 没有引用的图片

	所有！！ 不过我会把它们都





