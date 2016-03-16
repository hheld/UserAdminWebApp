module.exports = {
    entry: [
        './plugin/index.js'
    ],
    output: {
        filename: "index_bundle.js",
        path: __dirname + '/dist'
    },
    module: {
        loaders: [{
                test: /\.js$/,
                include: __dirname + '/plugin',
                loader: "babel-loader"
            }
        ]
    }
}
