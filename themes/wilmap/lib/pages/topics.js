(() => {
  const topics = new App.Component.CardGallery('.gallery-topics', {
    card: {
      headingName: 'field_name_topic',
      contentName: 'field_definition_topic',
    },
    endpoint: 'api/topicsJSON'
  });
})();
