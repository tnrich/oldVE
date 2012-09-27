var parse,
  __slice = [].slice;

exports.putFile = function() {
  var db, fn, name, options, path, _i;
  path = arguments[0], name = arguments[1], options = 4 <= arguments.length ? __slice.call(arguments, 2, _i = arguments.length - 1) : (_i = 2, []), fn = arguments[_i++];
  db = mongoose.connection.db;
  options = parse(options);
  options.metadata.filename = name;
  return new GridStore(db, name, "w", options).open(function(err, file) {
    if (err) {
      return fn(err);
    }
    return file.writeFile(path, fn);
  });
};

parse = function(options) {
  var opts;
  opts = {};
  if (options.length > 0) {
    opts = options[0];
  }
  if (!opts.metadata) {
    opts.metadata = {};
  }
  return opts;
};
