import { buildTask } from 'ember-concurrency/async-arrow-runtime';
import { action } from '@ember/object';
import { hash } from '@ember/helper';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { waitFor } from '@ember/test-waiters';
import { Promise as Promise$1 } from 'rsvp';
import MapComponent from './map-component.js';
import Route from './route.js';
import Waypoint from './waypoint.js';
import { untrack } from '../../effects/tracking.js';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';
import { g, i, n } from 'decorator-transforms/runtime-esm';

function DirectionsAPI(source) {
  return {
    get directions() {
      return source.directions;
    },
    get waypoints() {
      return source.waypoints;
    }
  };
}
class Directions extends MapComponent {
  static {
    g(this.prototype, "googleMapsApi", [service]);
  }
  #googleMapsApi = (i(this, "googleMapsApi"), void 0);
  get name() {
    return 'directions';
  }
  get publicAPI() {
    return DirectionsAPI(this);
  }
  static {
    g(this.prototype, "directions", [tracked], function () {
      return null;
    });
  }
  #directions = (i(this, "directions"), void 0);
  waypointComponents = new Set();
  get waypoints() {
    return [...(this.options.waypoints ?? []), ...this.serializedWaypoints];
  }
  get serializedWaypoints() {
    return Array.from(this.waypointComponents, ({
      location,
      stopover
    }) => {
      return {
        location,
        stopover
      };
    });
  }
  setup(options) {
    let newOptions = {
      ...options,
      waypoints: this.waypoints
    };
    return untrack(() => this.fetchDirections.perform(newOptions));
  }
  static {
    g(this.prototype, "fetchDirections", [waitFor], function () {
      return buildTask(() => ({
        context: this,
        generator: function* (options = {}) {
          let directionsService = yield this.googleMapsApi.directionsService;
          let request = new Promise$1((resolve, reject) => {
            directionsService.route(options, (response, status) => {
              if (status === 'OK') {
                resolve(response);
              } else {
                reject(status);
              }
            });
          });
          this.directions = yield request;
          this.events.onDirectionsChanged?.(this.publicAPI);
          return this.directions;
        }
      }), {
        keepLatest: true
      }, "fetchDirections", null);
    });
  }
  #fetchDirections = (i(this, "fetchDirections"), void 0);
  teardown() {}
  getWaypoint(waypoint) {
    this.waypointComponents.add(waypoint);
    return () => this.waypointComponents.delete(waypoint);
  }
  static {
    n(this.prototype, "getWaypoint", [action]);
  }
  static {
    setComponentTemplate(precompileTemplate("{{yield (hash directions=this.directions route=(component GMapRoute directions=this.directions getContext=@getContext) waypoint=(component GMapWaypoint getContext=this.getWaypoint))}}", {
      strictMode: true,
      scope: () => ({
        hash,
        GMapRoute: Route,
        GMapWaypoint: Waypoint
      })
    }), this);
  }
}

export { DirectionsAPI, Directions as default };
//# sourceMappingURL=directions.js.map
