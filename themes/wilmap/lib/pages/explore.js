(() => {
  $('.filter-document').select2({
    placeholder: 'Document Type',
    allowClear: true,
    minimumResultsForSearch: Infinity,
    theme: 'wilmap-select-document'
  });
  $('.filter-country').select2({
    placeholder: 'Country',
    allowClear: true,
    minimumResultsForSearch: Infinity,
    theme: 'wilmap-select-country'
  });

  $('.filter-year').select2({
    placeholder: 'Year',
    allowClear: true,
    minimumResultsForSearch: Infinity,
    theme: 'wilmap-select-year'
  });

  $('.filter-group').select2({
    placeholder: 'Nothing',
    allowClear: true,
    minimumResultsForSearch: Infinity,
    theme: 'wilmap-select-year'
  });

  $('.filter-sort').select2({
    placeholder: 'Newest firts',
    allowClear: true,
    minimumResultsForSearch: Infinity,
    theme: 'wilmap-select-year'
  });

  const entries = new App.Component.CardGallery('.gallery-entries', {
    card: {
      extended: true,
      headingName: 'type',
      subheadingName: 'title',
      contentName: 'field_body_entry',
      locationName: 'field_location_entry',
      detailsName: 'field_category_entry',
    },
    endpoint: 'api/entriesJSON'
  });
})(App);
