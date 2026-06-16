import TypicalMapComponent from './typical-map-component.js';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';

var TEMPLATE = precompileTemplate("{{yield (hash directions=@directions)}}");

class Route extends TypicalMapComponent {
  get name() {
    return 'routes';
  }
  get newOptions() {
    if (this.options.directions?.status !== 'OK') {
      return {};
    }
    return this.options;
  }
  newMapComponent(options = {}) {
    return new google.maps.DirectionsRenderer(options);
  }
}
setComponentTemplate(TEMPLATE, Route);

export { Route as default };
//# sourceMappingURL=route.js.map
