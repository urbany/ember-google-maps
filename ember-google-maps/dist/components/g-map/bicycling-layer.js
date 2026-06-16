import TypicalMapComponent from './typical-map-component.js';

class BicyclingLayer extends TypicalMapComponent {
  get name() {
    return 'bicyclingLayers';
  }
  newMapComponent(options = {}) {
    return new google.maps.BicyclingLayer(options);
  }
}

export { BicyclingLayer as default };
//# sourceMappingURL=bicycling-layer.js.map
