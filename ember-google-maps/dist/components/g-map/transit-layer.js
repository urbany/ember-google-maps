import TypicalMapComponent from './typical-map-component.js';

class TransitLayer extends TypicalMapComponent {
  get name() {
    return 'transitLayers';
  }
  newMapComponent(options = {}) {
    return new google.maps.TransitLayer(options);
  }
}

export { TransitLayer as default };
//# sourceMappingURL=transit-layer.js.map
