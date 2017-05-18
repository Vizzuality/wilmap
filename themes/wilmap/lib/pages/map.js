(() => {
  mapboxgl.accessToken = 'pk.eyJ1IjoiaGVjdG9ydWNoIiwiYSI6ImNpeXk3NzgzMjAwMDYzM3BuNXdiN3NiMDAifQ.v801v1GQOc5LhKNe5cAplQ';
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/hectoruch/cizr9hdsh00o22rpdwsk30jfg',
    center: [0, 0],
    zoom: 2
});

  const sidebar = new App.Component.MapAccordion('.list-country-search-map');
})();
