import TypicalMapComponent from './typical-map-component.js';

class Polyline extends TypicalMapComponent {
  get name() {
    return 'polygons';
  }
  newMapComponent(options = {}) {
    return new google.maps.Polygon(options);
  }
}

export { Polyline as default };
//# sourceMappingURL=polygon.js.map
