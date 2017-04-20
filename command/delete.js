'use strict'

const co = require('co')
const prompt = require('co-prompt')
const chalk = require('chalk')
const fs = require('fs')
const trash = require('trash');

const path = require('path')
const TMP_DIR = './_tmp'

let PROJECT_DIR = process.cwd() + '/'

const delete_files = ( list ) => {
    let all = 0
    let count = 0
    for (var name in list) {
        let v = list[name]
        all++
        if ( v == 0) {
            count++
            let file = path.join(PROJECT_DIR,name)


            trash(file).then(function(e){
                console.log(chalk.green(`   delete ${file}`))
            })
        }
    }

    trash( path.join(PROJECT_DIR,TMP_DIR) ).then(function(){
        console.log(chalk.green(`  all ${all} delete ${count} files`))
    })

}

const del = () => {
    console.log( `del`)
    let file = path.join(PROJECT_DIR, '_tmp/match.js');

    fs.readFile(file, 'utf8', (err, data) => {
        if (err) throw err;
        // console.log('reduce', filePath);
        let list = JSON.parse(data);
        delete list.sorts
        delete_files( list )
    });
}
module.exports = del;