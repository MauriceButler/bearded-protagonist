var exec = require('child_process').exec,
    fs = require('fs'),
    path = require('path'),
    packageJson = require('./package.json'),
    colors = require('colors'),
    readline = require('readline'),
    rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

exec('npm config get prefix',
    function (error, stdout) {
        if (error) {
          throw error;
        }

        if(process.platform === 'win32'){
            packageJson.originalNpm = path.join(stdout.replace(/\n/g, ''), 'npm');
        } else {
            packageJson.originalNpm = path.join(stdout.replace(/\n/g, ''), 'bin', 'npm');
        }

        rl.question(('bpm ' + 'INFO: '.green + 'Where is the current npm: (' + packageJson.originalNpm + ') ').trim(), function(answer) {

            rl.close();

            if(answer){
                packageJson.originalNpm = answer;
            }

            fs.writeFile('./package.json', JSON.stringify(packageJson, null, 2), function(error){
                if(error){
                    throw error;
                }

                console.log('bpm ' + 'INFO: '.green + 'You can now alias bpm to npm for ' + 'MAGIC'.rainbow);
            });
        });
    }
);