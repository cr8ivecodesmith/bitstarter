#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

    + cheerio
        - https://github.com/MatthewMueller/cheerio
        - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
        - http://maxogden.com/scrapping-with-node.html

    + commander.js
        - https://github.com/visionmedia/commander.js
        - http://tjholowaychuk.com/post/9103188408/commander-js-nodjs-command-line-interfaces-made-easy

    + restler
        - https://github.com/danwrong/Restler/

    + JSON
        - http://en.wikipedia.org/wiki/JSON
        - https://developer.mozilla.org/en-US/docs/JSON
        - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/


var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var rest = require('restler');
var HTMLFILE_DEFAULT = 'index.html';
var CHECKSFILE_DEFAULT = 'checks.json';
var HTMLURL_DEFAULT = 'http://afternoon-temple-1542.herokuapp.com/';


var assertFileExists = function(infile) {
    var instr = infile.toString();
    if (!fs.existsSync(instr)) {
        console.log('%s does not exist. Exiting.', instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exist_code
    }
    return instr;
};


var assertUrlExists = function(html_data) {
    var result = false;
    if (html_data) {
        result = true;
    }

    return result;
};


var get_html_data = function(htmlurl, callback) {
    rest.get(htmlurl).on('complete', function(result) {
        if (result instanceof Error) {
            console.log('%s does not exist. Exiting.', inurl);
            process.exit(1); // http://nodejs.org/api/process.html#process_process_exist_code 
        }
        else {
            callback(result);
        }
    });
};


var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};


var cheerioHtmlUrl = function(htmlurl, checksfile) {
    rest.get(htmlurl).on('complete', function(result) {
        if (result instanceof Error) {
            console.log('%s does not exist. Exiting.', inurl);
            process.exit(1); // http://nodejs.org/api/process.html#process_process_exist_code 
        }
        else {
            html_data = cheerio.load(result);
            checkHtmlUrl(html_data, checksfile);
        }
    });
};


var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};


var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};

    for (var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }

    console.log(JSON.stringify(out, null, 4));
};


var checkHtmlUrl = function(html_data, checksfile) {
    $ = html_data;
    var checks = loadChecks(checksfile).sort();
    var out = {};

    for (var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }

    console.log(JSON.stringify(out, null, 4));
};


var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow/a/6772648
    return fn.bind({});
};


if (require.main == module) {
    program
        .option(
            '-c, --checks <check_file>',
            'Path to checks.json',
            clone(assertFileExists),
            CHECKSFILE_DEFAULT
        )
        .option(
            '-f, --file <html_file>',
            'Path to index.html',
            clone(assertFileExists)
        )
        // TODO: Implement get_html_data / assertUrlExists
        .option(
            '-u, --url <url>',
            'http://spam.com'
        )
        .parse(process.argv);

    if (program.file) {
        var checkJson = checkHtmlFile(program.file, program.checks);
    }
    else if (program.url) {
        var checkJson = cheerioHtmlUrl(program.url, program.checks);
    }
}
else {
    exports.checkHtmlFile = checkHtmlFile;
}
