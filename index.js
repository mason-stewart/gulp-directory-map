var through = require("through2"),
		isEmpty  = require("lodash.isempty"),
		gutil = require("gulp-util");

module.exports = function (config) {
	"use strict";

	config = config || {};
	var origin = config.filename || "dist/urls.json",
			directoryStructure = {};


	function directoryMap(file, enc, callback) {
		/*jshint validthis:true*/

		// Do nothing if no contents
		if (file.isNull()) {
			this.emit("error", new gutil.PluginError("gulp-directory-map", "File is null"));
			this.emit("end");
			return callback();
		}

		// No support for streams yet.
		if (file.isStream()) {
			this.emit("error", new gutil.PluginError("gulp-directory-map", "No stream support!"));
			this.emit("end");
			return callback();
		}

		// But if it's a buffer...!
		if (file.isBuffer()) {
			var path = file.path.replace(file.base, "");
			var segments = path.split("/");
			var parent = directoryStructure;

			segments.forEach(function(seg, index){
				if (index === segments.length -1){
					parent[seg] = path;
				} else {
					parent[seg] = parent[seg] || {};
				}
				parent = parent[seg];
			});
		}
		return callback();
	}

	return through.obj(directoryMap,
		function(cb) {
			if (isEmpty(directoryStructure)) {
				this.emit("error", new gutil.PluginError("gulp-directory-map", "No files found for directoryMap"));
				this.emit("end");
				return cb();
			}

			//create and push new vinyl file
			this.push(new gutil.File({
				cwd: __dirname,
				base: __dirname,
				path: origin,
				contents: new Buffer(JSON.stringify(directoryStructure))
			}));

			gutil.log("Generated", gutil.colors.blue(config.filename));
			return cb();
		});
};
