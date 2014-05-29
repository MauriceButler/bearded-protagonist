#!/usr/bin/env node

var fs = require('fs'),
    path = require('path'),
    findRoot = require('find-root'),
    readline = require('readline'),
    colors = require('colors'),
    cwd = process.cwd(),
    exec = require('child_process').exec,
    rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    }),
    args = process.argv.slice(2),
    isPub = args.some(function( arg){
        return arg.indexOf('pu') === 0;
    });

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
    console.log('               Continue to publish this module? (y/n)'.yellow);

    rl.once('line', function(line){
        if(line.toString().charAt(0) !== 'y'){
            console.log('Publish canceled'.green);
            process.kill();
        }else{
            continueCommand();
        }
    })
}else{
    continueCommand();
}

function continueCommand(){
    var child = exec('npm ' + args.join(' '));

    child.stderr.pipe(process.stderr);
    child.stdout.pipe(process.stdout);

    child.on('exit', function(){
        process.kill();
    });
}