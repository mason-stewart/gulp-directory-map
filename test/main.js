/*global describe, it*/
"use strict";

require("mocha");

var fs = require("fs"),
		expect = require("chai").expect,
		gulp = require("gulp"),
		gutil = require("gulp-util"),
		directoryMap = require("../");


describe("directoryMap", function(){
	it("should throw an error when not given files", function(done) {
		var error,
				stream = directoryMap({
					filename: ".tmp/urls.json"
				});


		stream.on("end", function(){
			expect(error.message).to.equal("No files found for directoryMap");
			done();
		});

		gulp.src("fake-directory/**/*.html")
			.pipe(stream)
			.on("error", function(err){
				error = err;
				console.log(error.message);
			});
	});

	it("should correctly use defaults", function(done) {
		var stream = directoryMap();

		stream.on("data", function(data) {
			expect(data.path).to.contain("urls.json");
		});

		stream.on("end", done);

		gulp.src("test/fixtures/**/*.html")
			.pipe(stream)
			.pipe(gulp.dest("test/.tmp"));
	});


	it("should generate a JSON file with the correct directory structure", function(done) {
		var stream = directoryMap({
			filename: ".tmp/urls.json"
		});

		stream.on("data", function(data) {
			expect(data.path).to.contain(".tmp/urls.json");
			var contents = data.contents.toString();
			var expectedOutput = {"index.html":"index.html","nested-folder-1":{"faq.html":"nested-folder-1/faq.html","index.html":"nested-folder-1/index.html","nested-folder-1-1":{"index.html":"nested-folder-1/nested-folder-1-1/index.html"}},"nested-folder-2":{"index.html":"nested-folder-2/index.html"}};

			expect(contents).to.contain("nested-folder-1");
			expect(contents).to.contain("faq.html");
			expect(contents).to.contain("nested-folder-1/faq.html");
			expect(contents).to.contain("nested-folder-1/nested-folder-1-1/index.html");
			expect(contents).to.not.contain("index.txt");
			expect(contents).to.not.contain("nested-folder-1/nested-folder-1-1/faq.html");
			expect(JSON.parse(contents)).to.deep.equal(expectedOutput);
		});

		stream.on("end", done);

		gulp.src("test/fixtures/**/*.html")
			.pipe(stream)
			.pipe(gulp.dest("test"));
	});

it("should generate a JSON file with the correct prefixed folder(s) whe provided", function(done) {
	var stream = directoryMap({
		filename: ".tmp/urls.json",
		prefix: "prefixed-folder"
	});

	stream.on("data", function(data) {
		expect(data.path).to.contain(".tmp/urls.json");
		var contents = data.contents.toString();
		var expectedOutput = {"prefixed-folder": {"index.html":"prefixed-folder/index.html","nested-folder-1":{"faq.html":"prefixed-folder/nested-folder-1/faq.html","index.html":"prefixed-folder/nested-folder-1/index.html","nested-folder-1-1":{"index.html":"prefixed-folder/nested-folder-1/nested-folder-1-1/index.html"}},"nested-folder-2":{"index.html":"prefixed-folder/nested-folder-2/index.html"}}};

		expect(contents).to.contain("prefixed-folder/nested-folder-1");
		expect(contents).to.contain("faq.html");
		expect(contents).to.contain("prefixed-folder/nested-folder-1/faq.html");
		expect(contents).to.contain("prefixed-folder/nested-folder-1/nested-folder-1-1/index.html");
		expect(contents).to.not.contain("index.txt");
		expect(contents).to.not.contain("prefixed-folder/nested-folder-1/nested-folder-1-1/faq.html");
		expect(JSON.parse(contents)).to.deep.equal(expectedOutput);
	});

	stream.on("end", done);

	gulp.src("test/fixtures/**/*.html")
		.pipe(stream)
		.pipe(gulp.dest("test"));
});

	it("should error on stream", function (done) {

		var srcFile = new gutil.File({
			path: "test/fixtures/index.html",
			cwd: "test/",
			base: "test/fixtures",
			contents: fs.createReadStream("test/fixtures/index.html")
		});

		var stream = directoryMap();

		var errorExists;

		stream.on("error", function(err) {
			/*jshint expr: true*/
			expect(err).to.exist;
			// prevent multiple done calls
			if (!errorExists) {
				done();
				errorExists = true;
			}
		});

		stream.write(srcFile);
		stream.end();
	});
});