var through = require("through2"),
		isEmpty  = require("lodash.isempty"),
		path = require("path"),
		PluginError = require("plugin-error"),
		Vinyl = require("vinyl"),
		colors = require("ansi-colors"),
		log = require("fancy-log");

module.exports = function (config) {
	"use strict";

	config = config || {};
	var origin = config.filename || "urls.json",
		subOjects = typeof config.subOjects !== 'undefined' ? config.subOjects : true,
		firstFile,
		directoryStructure = {};

	function directoryMap(file, enc, callback) {
		/*jshint validthis:true*/

		if (!firstFile) {
      firstFile = file;
    }

		// Do nothing if no contents
		if (!file.isDirectory() && file.isNull()) {
			this.emit("error", new PluginError("gulp-directory-map", "File is null"));
			this.emit("end");
			return callback();
		}

		// No support for streams yet.
		if (file.isStream()) {
			this.emit("error", new PluginError("gulp-directory-map", "No stream support!"));
			this.emit("end");
			return callback();
		}

		// But if it's a buffer...!
		if (file.isBuffer()) {
			var path = (config.prefix ? config.prefix + "/" : "") + file.path.replace(file.base, "");
			var segments = path.replace(/\\/g,"/").split("/");
			var parent = directoryStructure;

			segments.forEach(function(seg, index){
				if (index === segments.length-1){
					parent[seg] = path.replace(/\\/g,"/");
				} else if(subOjects) {
					parent[seg] = parent[seg] || {};
					parent = parent[seg];
				}
			});
		}
		return callback();
	}

	return through.obj(directoryMap,
		function(cb) {
			if (isEmpty(directoryStructure)) {
				this.emit("error", new PluginError("gulp-directory-map", "No files found for directoryMap"));
				this.emit("end");
				return cb();
			}

			//create and push new vinyl file
			this.push(new Vinyl({
				cwd: firstFile.cwd,
				base: firstFile.cwd,
				path: path.join(firstFile.cwd, origin),
				contents: new Buffer(JSON.stringify(directoryStructure))
			}));

			log("Generated", colors.blue(config.filename));
			return cb();
		});
};
