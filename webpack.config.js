const path = require("path");
const magicImporter = require('node-sass-magic-importer');

module.exports = {
    mode: "production",
    entry: {
        "index": path.resolve(__dirname, "index.tsx"),
        "main-header": path.resolve(__dirname, "src/main-header/main-header.tsx")
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js"
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.scss', '.json', '.css'],
        modules: ["node_modules"]
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    {
                      loader: "style-loader"
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sassOptions: {
                                importer: magicImporter()
                            }
                        }
                    }
                ],
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }
        ],
    }
};