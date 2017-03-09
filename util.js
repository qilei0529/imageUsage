
const fs = require('fs');
const path = require('path');

const async = require('async');

// 遍历目录 func
const mapFiles = (srcPath , reg) => {
    const count = {
        dir: 0,
        file: 0
    }
    const allFiles = []
    const mapDir = (dir) => {
        let file_dir = fs.readdirSync(dir).reduce((list, d) => {
            const fullDir = path.join(dir, d)
            if (fs.statSync(fullDir).isDirectory()) {
                count.dir++
                mapDir(fullDir)
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

    mapDir(srcPath)

    return {
        files: allFiles,
        count: count
    }
}


const imgUsage = function( name, files , images, counter , cb ){
    if ( !counter.all ) {
        counter.all = 0;
    }
    counter[name] = 0;

    async.filter(files, (filePath, callback) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) throw err;
            // console.log('reduce', filePath);
            images.map((item) => {
                if ( data.indexOf(item) > 0) {
                    counter[item]++;
                    counter.all++;
                    counter[name]++;
                }
            })
            callback(null, !err)
        });

    }, function(err, results) {
        console.log('end' , name , counter[name] )
        // console.log(counter)
        cb && cb()
    });
}

module.exports = {
    mapFiles:mapFiles,
    imgUsage:imgUsage
}