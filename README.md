# dynamic-sass-imports [![Build Status][ci-img]][ci]

bash `
  dynamic-sass --watch path/file.scss:path/file.css
`

you can use concurrently to use sass compile and dev script

`
  "scripts": {
    "dev:sass": "dynamic-sass --watch styles/index.scss:styles/index.css",
    "dev": "concurrently --kill-others \"next dev\" \"npm run dev:sass\"",
    }
`