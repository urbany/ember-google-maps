function isAdvancedMarkerElement(component) {
  return Boolean(typeof google !== 'undefined' && google?.maps?.marker?.AdvancedMarkerElement && component instanceof google.maps.marker.AdvancedMarkerElement);
}
function trigger(component, eventName, ...options) {
  if (component instanceof Element) {
    let actualEventName = isAdvancedMarkerElement(component) && eventName === 'click' ? 'gmp-click' : eventName;
    component.dispatchEvent(new CustomEvent(actualEventName, {
      detail: options
    }));
    return;
  }
  google.maps.event.trigger(component, eventName, ...options);
}
function getDirectionsQuery(directions) {
  let {
    origin,
    destination
  } = directions.request;
  return {
    origin: origin.query,
    destination: destination.query
  };
}

export { getDirectionsQuery, trigger };
//# sourceMappingURL=helpers.js.map
