'use strict'

const co = require('co')
const prompt = require('co-prompt')
const chalk = require('chalk')
const fs = require('fs')

const path = require('path')
const sleep = require('sleep')
const util = require('../lib/util')

const TMP_DIR = './_tmp'

console.log(sleep)

const saveFile = function( file, content){
    return new Promise(function(resolve, reject){
        fs.writeFile( file, content , function(e){
            if (e) {
                reject(e)
            }else{
                resolve(true)
            }
        })
    })
}

const matchFile = function( files , img_list ){
    
    // 新建一个 图片列表对象，来缓存 数量
    const img_count = {};
    img_list.map((item)=>{
        img_count[item] = 0
    })

    console.log(img_count)

    return new Promise(function(resolve, reject){
        let callback = function(){
            resolve( 11111 )
        }
        util.imgUsage('project', files, img_list, img_count , callback);
    })
}


const show = function( list ){
    let sorts = list.sorts;
    delete list.sorts
    for ( var key in list ) {
        console.log(chalk.yellow(`    ${key} - ${list[key]}`))
    }
    console.log(chalk.yellow(`\n    Count: ${sorts.all}`))

}

const create = () => {
    co(function*() {
        const mkdirp = require('mkdirp');
            mkdirp(TMP_DIR)
        let PROJECT_DIR = process.cwd() + '/'
        console.log(chalk.green(`\n\n Start image Usege tool on dir: \n\n     ${PROJECT_DIR}\n`))
        
        var imagePath = yield prompt('Image path (./images): ')
        if (imagePath == '') {
            imagePath = 'images'
        }
        let item = {
            path: path.join(PROJECT_DIR , imagePath),
            reg: /\.png|gif|jpg/g
        }
        console.log(chalk.green( `\n Start images find \n\n   path: ${item.path}  \n    reg: ${item.reg}` ))
        console.log(chalk.green( `\n Finding... ` ))
        

        // 查找 到多少张图片 
        let image_stack = util.mapFiles(item.path, item.reg)
        image_stack.files = image_stack.files.map((d) => {
            let file = d.replace(PROJECT_DIR,'')
            return file
        });

        if ( image_stack.count ) {
            let count = image_stack.count
            let out_file = path.join(PROJECT_DIR,TMP_DIR , 'images.js')
            var out_text = JSON.stringify(image_stack , null, 2)
            console.log(chalk.green(`\n   Find ${count.file} images in ${count.dir} folds`))
            let save = yield saveFile( out_file, out_text )
            console.log(chalk.green(  `   Save to ${TMP_DIR}/images.js`))
            console.log(chalk.green(  `   Save ${save}`))
        }

        // sleep.sleep(1)

        let all_item = {
            path: path.join(PROJECT_DIR),
            reg: /\.js|jsx|css|styl|html/g,
            exclude: /node_modules|_tmp|images/g
        }

        console.log(chalk.green( `\n Start Files find \n\n   path: ${all_item.path}  \n    reg: ${all_item.reg}\n    exc: ${all_item.exclude}` ))
        console.log(chalk.green( `\n Finding... ` ))

        let all_file = util.mapFiles(all_item.path, all_item.reg , all_item.exclude)
        if ( all_file.count ) {
            let count = all_file.count
            let out_file = path.join(PROJECT_DIR,TMP_DIR , 'files.js')
            var out_text = JSON.stringify(all_file , null, 2)
            console.log(chalk.green(`\n   Find ${count.file} files in ${count.dir} folds`))
            let save = yield saveFile( out_file, out_text )
            console.log(chalk.green(  `   Save to ${TMP_DIR}/files.js`))
            console.log(chalk.green(  `   Save ${save}`))
        }


        // 新建一个 图片列表对象，来缓存 数量
        let img_list = image_stack.files
        const img_count = {};
        img_list.map((item)=>{
            img_count[item] = 0
        })

        let callback = function (){
            let out_file = path.join(PROJECT_DIR,TMP_DIR , 'metch.js')
            var out_text = JSON.stringify(img_count , null, 2)
            saveFile( out_file, out_text )
            console.log(chalk.green(  `   Save to ${TMP_DIR}/metch.js`))
            console.log(chalk.green(  `\n `))

            show(img_count)
        }

        util.imgUsage('project', all_file.files, img_list, img_count , callback);

        var end = yield prompt('')
        process.exit()
    })
}



module.exports = create;
