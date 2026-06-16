import TypicalMapComponent from './typical-map-component.js';

class TrafficLayer extends TypicalMapComponent {
  get name() {
    return 'trafficLayers';
  }
  newMapComponent(options = {}) {
    return new google.maps.TrafficLayer(options);
  }
}

export { TrafficLayer as default };
//# sourceMappingURL=traffic-layer.js.map
