var x = require('casper').selectXPath;
casper.options.viewportSize = {width: 1546, height: 999};
casper.on('page.error', function(msg, trace) {
    this.echo('Error: ' + msg, 'ERROR');
    for(var i=0; i<trace.length; i++) {
        var step = trace[i];
        this.echo('   ' + step.file + ' (line ' + step.line + ')', 'ERROR');
    }
});
casper.test.begin('Resurrectio test', function(test) {
    casper.start('http://localhost:3000/');
    casper.waitForSelector(x("//button[@id='newPost' and @value='']"),
        function success() {
            test.assertExists(x("//button[@id='newPost']"));
        },
        function fail() {
            test.assertExists(x("//button[@id='newPost']"));
        });
    casper.waitForSelector(x("//input[@value=\'投稿\']"),
        function success() {
            test.assertExists(x("//input[@value=\'投稿\']"));
        },
        function fail() {
            test.assertExists(x("//input[@value=\'投稿\']"));
        });

    casper.run(function() {test.done();});
});