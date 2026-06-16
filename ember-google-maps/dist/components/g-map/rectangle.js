import TypicalMapComponent from './typical-map-component.js';

class Rectangle extends TypicalMapComponent {
  get name() {
    return 'rectangles';
  }
  newMapComponent(options = {}) {
    return new google.maps.Rectangle(options);
  }
}

export { Rectangle as default };
//# sourceMappingURL=rectangle.js.map
