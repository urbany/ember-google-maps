import TypicalMapComponent from './typical-map-component.js';

class Polyline extends TypicalMapComponent {
  get name() {
    return 'polylines';
  }
  newMapComponent(options = {}) {
    return new google.maps.Polyline(options);
  }
}

export { Polyline as default };
//# sourceMappingURL=polyline.js.map
