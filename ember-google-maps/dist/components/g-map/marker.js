import TypicalMapComponent from './typical-map-component.js';
import { toLatLng } from '../../utils/helpers.js';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';

var TEMPLATE = precompileTemplate("{{yield\n  (hash\n    infoWindow=(component\n      \"g-map/info-window\"\n      getContext=@getContext\n      target=this.mapComponent\n    )\n  )\n}}");

class Marker extends TypicalMapComponent {
  get name() {
    return 'markers';
  }
  get newOptions() {
    if (!this.args.position) {
      this.options.position = toLatLng(this.args.lat, this.args.lng);
    }
    return this.options;
  }
  newMapComponent(options = {}) {
    return new google.maps.Marker(options);
  }
}
setComponentTemplate(TEMPLATE, Marker);

export { Marker as default };
//# sourceMappingURL=marker.js.map
