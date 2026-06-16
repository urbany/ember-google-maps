import TypicalMapComponent from './typical-map-component.js';
import { toLatLng } from '../../utils/helpers.js';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';

var TEMPLATE = precompileTemplate("{{yield\n  (hash\n    infoWindow=(component\n      \"g-map/info-window\"\n      getContext=@getContext\n      target=this.mapComponent\n    )\n  )\n}}");

class AdvancedMarker extends TypicalMapComponent {
  get name() {
    return 'advancedMarkers';
  }
  get newOptions() {
    if (!this.args.position) {
      this.options.position = toLatLng(this.args.lat, this.args.lng);
    }
    return this.options;
  }
  update(mapComponent) {
    Object.assign(mapComponent, this.newOptions);
    return mapComponent;
  }
  newMapComponent(options = {}) {
    return new google.maps.marker.AdvancedMarkerElement(options);
  }
}
setComponentTemplate(TEMPLATE, AdvancedMarker);

export { AdvancedMarker as default };
//# sourceMappingURL=advanced-marker.js.map
