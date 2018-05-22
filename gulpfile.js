var gulp = require('gulp');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;

gulp.task('migrate', function () {
    exec('php artisan migrate', function (err, stdout, stderr) {
        console.log("migrate");
        console.log(stdout);
        exec('php artisan code:models', function (err, stdout, stderr) {
            console.log("code:models");
            console.log(stdout);
            exec('php artisan ide-helper:models --write', function (err, stdout, stderr) {
                console.log("ide-helper:models");
                console.log(stdout);
            });
        });
    });
});

gulp.task('code+ide-helper', function () {
    exec('php artisan code:models', function (err, stdout, stderr) {
        console.log("code:models");
        console.log(stdout);
        exec('php artisan ide-helper:models --write', function (err, stdout, stderr) {
            console.log("ide-helper:models");
            console.log(stdout);
        });
    });
});

gulp.task('ide-helper', function () {
    exec('php artisan ide-helper:models --write', function (err, stdout, stderr) {
        console.log("ide-helper:models");
        console.log(stdout);
    });
});

gulp.task('cache:clear', function () {
    exec('php artisan cache:clear', function (err, stdout, stderr) {
        console.log("cache:clear");
        console.log(stdout);
    });
});

gulp.task('jobqueue:listen', function (done) {
    var _default = spawn("php", ["artisan", "queue:work", "--queue=default", "--tries=3"]);

    _default.stdout.on('data', function (data) {
        console.log(data.toString().trim().split("\n").map(function (t) {
            return "[default] " + t
        }).join("\n"));
    });
    _default.on('exit', function (code) {
        console.log('[default] child process exited with code ' + code.toString());
        done();
    });
});
