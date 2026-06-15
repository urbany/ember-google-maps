import { action } from '@ember/object';
import { hash } from '@ember/helper';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { waitFor } from '@ember/test-waiters';
import { Promise } from 'rsvp';
import { task } from 'ember-concurrency';
import { TrackedSet } from 'tracked-maps-and-sets';
import MapComponent from './map-component';
import GMapRoute from './route';
import GMapWaypoint from './waypoint';
import { untrack } from '../../effects/tracking';

export function DirectionsAPI(source) {
  return {
    get directions() {
      return source.directions;
    },

    get waypoints() {
      return source.waypoints;
    },
  };
}

export default class Directions extends MapComponent {
  @service googleMapsApi;

  get name() {
    return 'directions';
  }

  get publicAPI() {
    return DirectionsAPI(this);
  }

  @tracked directions = null;

  waypointComponents = new TrackedSet();

  get waypoints() {
    return [...(this.options.waypoints ?? []), ...this.serializedWaypoints];
  }

  get serializedWaypoints() {
    return Array.from(this.waypointComponents, ({ location, stopover }) => {
      return {
        location,
        stopover,
      };
    });
  }

  setup(options) {
    let newOptions = { ...options, waypoints: this.waypoints };

    return untrack(() => this.fetchDirections.perform(newOptions));
  }

  @waitFor
  fetchDirections = task({ keepLatest: true }, async (options = {}) => {
    let directionsService = await this.googleMapsApi.directionsService;

    let request = new Promise((resolve, reject) => {
      directionsService.route(options, (response, status) => {
        if (status === 'OK') {
          resolve(response);
        } else {
          reject(status);
        }
      });
    });

    this.directions = await request;
    this.events.onDirectionsChanged?.(this.publicAPI);

    return this.directions;
  });

  teardown() {}

  @action
  getWaypoint(waypoint) {
    this.waypointComponents.add(waypoint);
    return () => this.waypointComponents.delete(waypoint);
  }

  <template>
    {{yield
      (hash
        directions=this.directions
        route=(component
          GMapRoute directions=this.directions getContext=@getContext
        )
        waypoint=(component GMapWaypoint getContext=this.getWaypoint)
      )
    }}
  </template>
}
