/* 
 * a tool of image use
 */

const path = require('path');
const fs = require('fs');
const async = require('async');
const util = require('./util');


const DIR_ROOT = '/Users/qilei/Code/2D/static-om/'

const filters = [
    {
        name: 'img',
        path: DIR_ROOT + 'images',
        reg: /\.png|gif/g
    },
    {
        name: 'rjs',
        path: DIR_ROOT + 'rjs',
        reg: /\.js|jsx/g
    },
    {
        name: 'js',
        path: DIR_ROOT + 'js',
        reg: /\.js/g
    },
    {
        name: 'css',
        path: DIR_ROOT + 'css',
        reg: /\.css/g
    },
    {
        name: 'page',
        path: DIR_ROOT + 'page',
        reg: /\.page/g
    },
]

const AllFiles = {}

// 获取图片
filters.map( (item) => {
    AllFiles[item.name] = util.mapFiles(item.path, item.reg)
})

console.log(AllFiles)

// 替换跳 images files 中的路径
// 重新处理 img  因为路径 图片 引用的是  ./images/的目录，所以要替换一下
AllFiles.img.files = AllFiles.img.files.map((d) => {
    let file = d.replace(DIR_ROOT,'')
    return file
});

console.log(AllFiles.img.files)

// 新建一个 图片列表对象，来缓存 数量
const img_list = AllFiles.img.files;
const img_count = {};
img_list.map((item)=>{
    img_count[item] = 0
})

const run = () => {
    async.filter(['css', 'js', 'page'] , (name, callback) => {
        const files = AllFiles[name].files;
        util.imgUsage(name, files, img_list, img_count , callback);
    }, function( err, results){
        console.log('finished');
        console.log(img_count)
        fs.writeFile('out.txt' , JSON.stringify(img_count , null, 2));
    })
}

run();



