import { action } from '@ember/object';
import { hash } from '@ember/helper';
import { scheduleOnce } from '@ember/runloop';
import { tracked } from '@glimmer/tracking';
import { waitFor } from '@ember/test-waiters';
import MapComponent from './g-map/map-component';
import GMapAdvancedMarker from './g-map/advanced-marker';
import GMapAutocomplete from './g-map/autocomplete';
import GMapBicyclingLayer from './g-map/bicycling-layer';
import GMapCanvas from './g-map/canvas';
import GMapCircle from './g-map/circle';
import GMapControl from './g-map/control';
import GMapDirections from './g-map/directions.gjs';
import GMapInfoWindow from './g-map/info-window';
import GMapMarker from './g-map/marker';
import GMapOverlay from './g-map/overlay';
import GMapPolygon from './g-map/polygon';
import GMapPolyline from './g-map/polyline';
import GMapRectangle from './g-map/rectangle';
import GMapTrafficLayer from './g-map/traffic-layer';
import GMapTransitLayer from './g-map/transit-layer';
import { toLatLng } from '../utils/helpers';
import {
  registerMapInstance,
  unregisterMapInstance,
} from '../component-managers/map-component-manager';

function GMapPublicAPI(source) {
  return {
    get map() {
      return source.map;
    },

    get components() {
      return source.deprecatedPublicComponents;
    },
  };
}

class TemplateComponent extends MapComponent {
  get name() {
    return 'template';
  }

  setup() {
    return this.publicAPI;
  }

  <template>
    {{yield}}
  </template>
}

export default class GMap extends MapComponent {
  canvas;

  @tracked hasCustomCanvas = false;

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

  @waitFor
  async pauseTestForIdle(map) {
    await new Promise((resolve) => {
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

  @action
  getCanvas(canvas) {
    if (this.canvas && this.canvas.id !== canvas.id) {
      unregisterMapInstance(this.canvas.id);
    }

    this.canvas = canvas;
    registerMapInstance(canvas.id, this.publicAPI);
  }

  @action
  getCustomCanvas(canvas) {
    this.getCanvas(canvas);

    scheduleOnce('afterRender', this, () => {
      this.hasCustomCanvas = true;
    });
  }

  @action
  getComponent(componentInstance, as = 'other') {
    let storedComponent = { component: componentInstance, as };
    this.components.add(storedComponent);

    this.addToDeprecatedPublicComponents(storedComponent);

    return {
      context: this.publicAPI,
      remove: () => {
        this.components.delete(storedComponent);
        this.removeFromDeprecatedPublicComponents(storedComponent);
      },
    };
  }

  deprecatedPublicComponents = {};

  addToDeprecatedPublicComponents({ as, component }) {
    if (!(as in this.deprecatedPublicComponents)) {
      this.deprecatedPublicComponents[as] = [];
    }

    this.deprecatedPublicComponents[as].push(component);
  }

  removeFromDeprecatedPublicComponents({ as, component }) {
    let group = this.deprecatedPublicComponents[as];
    let index = group.indexOf(component);

    if (index > -1) {
      group.splice(index, 1);
    }
  }

  <template>
    {{#let
      (component GMapCanvas onCanvasReady=this.getCanvas)
      (component GMapCanvas onCanvasReady=this.getCustomCanvas)
      as |DefaultCanvas Canvas|
    }}
      {{#if (has-block-params)}}
        {{#unless this.hasCustomCanvas}}
          <DefaultCanvas ...attributes />
        {{/unless}}
      {{else}}
        <DefaultCanvas ...attributes />
      {{/if}}

      {{yield
        (hash
          advancedMarker=(component
            GMapAdvancedMarker getContext=this.getComponent
          )
          autocomplete=(component GMapAutocomplete getContext=this.getComponent)
          bicyclingLayer=(component
            GMapBicyclingLayer getContext=this.getComponent
          )
          canvas=Canvas
          circle=(component GMapCircle getContext=this.getComponent)
          control=(component GMapControl getContext=this.getComponent)
          customComponentTemplate=(component
            TemplateComponent getContext=this.getComponent
          )
          directions=(component GMapDirections getContext=this.getComponent)
          infoWindow=(component GMapInfoWindow getContext=this.getComponent)
          map=this.map
          marker=(component GMapMarker getContext=this.getComponent)
          overlay=(component GMapOverlay getContext=this.getComponent)
          polygon=(component GMapPolygon getContext=this.getComponent)
          polyline=(component GMapPolyline getContext=this.getComponent)
          rectangle=(component GMapRectangle getContext=this.getComponent)
          trafficLayer=(component GMapTrafficLayer getContext=this.getComponent)
          transitLayer=(component GMapTransitLayer getContext=this.getComponent)
        )
      }}
    {{/let}}
  </template>
}
