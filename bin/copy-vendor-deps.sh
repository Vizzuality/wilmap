rm -rf ./themes/wilmap/vendor
mkdir -p ./themes/wilmap/vendor/js
mkdir -p ./themes/wilmap/vendor/css
cp ./node_modules/select2/dist/js/select2.full.min.js ./themes/wilmap/vendor/js/select2.full.min.js
cp ./node_modules/select2/dist/css/select2.min.css ./themes/wilmap/vendor/css/select2.min.css
cp ./node_modules/mapbox-gl/dist/mapbox-gl.js ./themes/wilmap/vendor/js/mapbox-gl.js
cp ./node_modules/mapbox-gl/dist/mapbox-gl.css ./themes/wilmap/vendor/css/mapbox-gl.css
