module.exports = {
    entry: ['whatwg-fetch', `${__dirname}/client/js/App.jsx`],
    output: { path: `${__dirname}/client/`, publicPath: '/', filename: 'js/bundle.js' },
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: [
                        {
                            plugins: [
                                'transform-object-rest-spread'
                            ]
                        },
                        'es2015',
                        'react'
                    ]
                }
            }
        ]
    }
};