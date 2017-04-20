'use strict'
const fs = require('fs');
const path = require('path');

const async = require('async');
const chalk = require('chalk')

// 遍历目录 func
const mapFiles = (srcPath , reg , exclude) => {
    const count = {
        dir: 0,
        file: 0
    }
    const allFiles = []

    const mapDir =(dir) => {

        let file_list = fs.readdirSync(dir)

        if ( file_list.length > 0) {
            let file_dir = file_list.reduce((list, d) => {
                const fullDir = path.join(dir, d)
                if (fs.statSync(fullDir).isDirectory()) {
                    count.dir++
                    if ( exclude ) {
                        let test = false;
                        test = d.match(exclude);
                        if ( !test ){
                            mapDir(fullDir)
                        }
                    }else{
                        mapDir(fullDir)
                    }

                } else {
                    count.file++
                    let test = true;
                    if ( reg ) {
                        test = fullDir.match(reg);
                    }
                    if (test) {
                        allFiles.push(fullDir)                    
                    }

                }
            })
        }
    }

    mapDir(srcPath)

    return {
        files: allFiles,
        count: count
    }
}


const imgUsage = function( name, files , images, counter , cb ){


    var sorts = counter.sorts || null


    if ( sorts == null ) {
        sorts = counter.sorts = {
            all:0
        }
    }

    sorts[name] = 0;

    async.filter(files, (filePath, callback) => {

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) throw err;
            // console.log('reduce', filePath);
            images.map((item) => {
                if ( data.indexOf(item) > 0) {
                    console.log(chalk.green( `\n   Find image  ${item}\n   ${filePath}  ` ))

                    counter[item]++;
                    sorts.all++;
                    sorts[name]++;
                }
            })
            callback(null, !err)
        });

    }, function(err, results) {
        // console.log('end' , name , sorts[name] )
        // console.log(counter)
        cb && cb()
    });
}

module.exports = {
    mapFiles:mapFiles,
    imgUsage:imgUsage
}