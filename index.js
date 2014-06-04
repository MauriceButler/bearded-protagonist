#!/usr/bin/env node

var fs = require('fs'),
    path = require('path'),
    findRoot = require('find-root'),
    readline = require('readline'),
    colors = require('colors'),
    originalNpm = require('./package.json').originalNpm,
    cwd = process.cwd(),
    spawn = require('child_process').spawn,
    rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    }),
    args = process.argv.slice(2),
    isPub = args.some(function( arg){
        return arg.indexOf('pu') === 0;
    });

if(!originalNpm){
    throw 'unknown npm location';
}

if(!isPub){
    return continueCommand();
}

var rootPath = findRoot(cwd),
    packageJson = require(path.join(rootPath, 'package.json'));

if(!packageJson.publishConfig){
    console.log();
    console.log('  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'.rainbow);
    console.log('  !!!                                                             !!!'.rainbow);
    console.log('  !!!   '.rainbow + 'WARNING! this package is about to be published globally'.yellow + '   !!!'.rainbow);
    console.log('  !!!                                                             !!!'.rainbow);
    console.log('  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'.rainbow);
    console.log();
    console.log('               Continue to publish this module? (y/N)'.yellow);

    rl.once('line', function(line){
        rl.close();
        if(line.toString().charAt(0) !== 'y'){
            console.log('bpm ' + 'INFO: '.green + 'Publish canceled');
            process.kill();
        }else{
            continueCommand();
        }
    });
}else{
    continueCommand();
}

function continueCommand(){
    var child = spawn(originalNpm, args, { stdio: 'inherit' });

    child.on('exit', function(){
        process.kill();
    });
}