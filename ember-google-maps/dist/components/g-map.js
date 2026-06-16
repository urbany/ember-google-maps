import { action } from '@ember/object';
import { hash } from '@ember/helper';
import { scheduleOnce } from '@ember/runloop';
import { tracked } from '@glimmer/tracking';
import { waitFor } from '@ember/test-waiters';
import MapComponent from './g-map/map-component.js';
import AdvancedMarker from './g-map/advanced-marker.js';
import Autocomplete from './g-map/autocomplete.js';
import BicyclingLayer from './g-map/bicycling-layer.js';
import GMapCanvas from './g-map/canvas.js';
import Circle from './g-map/circle.js';
import Control from './g-map/control.js';
import Directions from './g-map/directions.js';
import InfoWindow from './g-map/info-window.js';
import Marker from './g-map/marker.js';
import OverlayView from './g-map/overlay.js';
import Polyline$1 from './g-map/polygon.js';
import Polyline from './g-map/polyline.js';
import Rectangle from './g-map/rectangle.js';
import TrafficLayer from './g-map/traffic-layer.js';
import TransitLayer from './g-map/transit-layer.js';
import { toLatLng } from '../utils/helpers.js';
import { unregisterMapInstance, registerMapInstance } from '../component-managers/map-component-manager.js';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';
import { g, i, n } from 'decorator-transforms/runtime-esm';

function GMapPublicAPI(source) {
  return {
    get map() {
      return source.map;
    },
    get components() {
      return source.deprecatedPublicComponents;
    }
  };
}
class TemplateComponent extends MapComponent {
  get name() {
    return 'template';
  }
  setup() {
    return this.publicAPI;
  }
  static {
    setComponentTemplate(precompileTemplate("{{yield}}", {
      strictMode: true
    }), this);
  }
}
class GMap extends MapComponent {
  canvas;
  static {
    g(this.prototype, "hasCustomCanvas", [tracked], function () {
      return false;
    });
  }
  #hasCustomCanvas = (i(this, "hasCustomCanvas"), void 0);
  components = new Set();
  get publicAPI() {
    return GMapPublicAPI(this);
  }
  get map() {
    return this.mapComponent;
  }
  get newOptions() {
    this.options.zoom ??= 15;
    if (!this.args.center) {
      this.options.center = toLatLng(this.args.lat, this.args.lng);
    }
    return this.options;
  }
  setup(options, events) {
    let map = new google.maps.Map(this.canvas, this.newOptions);
    this.addEventsToMapComponent(map, events, this.publicAPI);
    this.pauseTestForIdle(map);
    return map;
  }
  update(map) {
    map.setOptions(this.newOptions);
    this.pauseTestForIdle(map);
    return map;
  }
  async pauseTestForIdle(map) {
    await new Promise(resolve => {
      let timerId;
      let listener;
      let isSettled = false;
      let finish = () => {
        if (isSettled) {
          return;
        }
        isSettled = true;
        clearTimeout(timerId);
        listener?.remove?.();
        resolve(map);
      };
      listener = google.maps.event.addListenerOnce(map, 'idle', finish);
      timerId = window.setTimeout(finish, 2000);
    });
  }
  static {
    n(this.prototype, "pauseTestForIdle", [waitFor]);
  }
  getCanvas(canvas) {
    if (this.canvas && this.canvas.id !== canvas.id) {
      unregisterMapInstance(this.canvas.id);
    }
    this.canvas = canvas;
    registerMapInstance(canvas.id, this.publicAPI);
  }
  static {
    n(this.prototype, "getCanvas", [action]);
  }
  getCustomCanvas(canvas) {
    this.getCanvas(canvas);
    scheduleOnce('afterRender', this, () => {
      this.hasCustomCanvas = true;
    });
  }
  static {
    n(this.prototype, "getCustomCanvas", [action]);
  }
  getComponent(componentInstance, as = 'other') {
    let storedComponent = {
      component: componentInstance,
      as
    };
    this.components.add(storedComponent);
    this.addToDeprecatedPublicComponents(storedComponent);
    return {
      context: this.publicAPI,
      remove: () => {
        this.components.delete(storedComponent);
        this.removeFromDeprecatedPublicComponents(storedComponent);
      }
    };
  }
  static {
    n(this.prototype, "getComponent", [action]);
  }
  deprecatedPublicComponents = {};
  addToDeprecatedPublicComponents({
    as,
    component
  }) {
    if (!(as in this.deprecatedPublicComponents)) {
      this.deprecatedPublicComponents[as] = [];
    }
    this.deprecatedPublicComponents[as].push(component);
  }
  removeFromDeprecatedPublicComponents({
    as,
    component
  }) {
    let group = this.deprecatedPublicComponents[as];
    let index = group.indexOf(component);
    if (index > -1) {
      group.splice(index, 1);
    }
  }
  static {
    setComponentTemplate(precompileTemplate("{{#let (component GMapCanvas onCanvasReady=this.getCanvas) (component GMapCanvas onCanvasReady=this.getCustomCanvas) as |DefaultCanvas Canvas|}}\n  {{#if (has-block-params)}}\n    {{#unless this.hasCustomCanvas}}\n      <DefaultCanvas ...attributes />\n    {{/unless}}\n  {{else}}\n    <DefaultCanvas ...attributes />\n  {{/if}}\n\n  {{yield (hash advancedMarker=(component GMapAdvancedMarker getContext=this.getComponent) autocomplete=(component GMapAutocomplete getContext=this.getComponent) bicyclingLayer=(component GMapBicyclingLayer getContext=this.getComponent) canvas=Canvas circle=(component GMapCircle getContext=this.getComponent) control=(component GMapControl getContext=this.getComponent) customComponentTemplate=(component TemplateComponent getContext=this.getComponent) directions=(component GMapDirections getContext=this.getComponent) infoWindow=(component GMapInfoWindow getContext=this.getComponent) map=this.map marker=(component GMapMarker getContext=this.getComponent) overlay=(component GMapOverlay getContext=this.getComponent) polygon=(component GMapPolygon getContext=this.getComponent) polyline=(component GMapPolyline getContext=this.getComponent) rectangle=(component GMapRectangle getContext=this.getComponent) trafficLayer=(component GMapTrafficLayer getContext=this.getComponent) transitLayer=(component GMapTransitLayer getContext=this.getComponent))}}\n{{/let}}", {
      strictMode: true,
      scope: () => ({
        GMapCanvas,
        hash,
        GMapAdvancedMarker: AdvancedMarker,
        GMapAutocomplete: Autocomplete,
        GMapBicyclingLayer: BicyclingLayer,
        GMapCircle: Circle,
        GMapControl: Control,
        TemplateComponent,
        GMapDirections: Directions,
        GMapInfoWindow: InfoWindow,
        GMapMarker: Marker,
        GMapOverlay: OverlayView,
        GMapPolygon: Polyline$1,
        GMapPolyline: Polyline,
        GMapRectangle: Rectangle,
        GMapTrafficLayer: TrafficLayer,
        GMapTransitLayer: TransitLayer
      })
    }), this);
  }
}

export { GMap as default };
//# sourceMappingURL=g-map.js.map
