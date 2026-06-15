import { clearMapInstances, getMapInstance } from '../utils/helpers.js';
import { settled, waitUntil } from '@ember/test-helpers';

function toQueryLocation(location) {
  if (typeof location === 'string') {
    return { query: location };
  }

  return location;
}

function buildDirectionsResult(options = {}) {
  return {
    geocoded_waypoints: [],
    request: {
      ...options,
      origin: toQueryLocation(options.origin),
      destination: toQueryLocation(options.destination),
      waypoints: (options.waypoints ?? []).map((waypoint) => ({
        ...waypoint,
        location: toQueryLocation(waypoint.location),
      })),
    },
    routes: [{ legs: [] }],
    status: 'OK',
  };
}

function buildDirectionsService() {
  return {
    route(options, callback) {
      callback(buildDirectionsResult(options), 'OK');
    },
  };
}

class DirectionsRendererMock {
  constructor(options = {}) {
    Object.assign(this, options);
  }

  setMap(map) {
    this.map = map;
  }

  setOptions(options = {}) {
    Object.assign(this, options);
  }
}

function patchGoogleMapsApiForTests(google, testState) {
  if (!google?.maps || testState.originalDirectionsRenderer) {
    return;
  }

  testState.originalDirectionsRenderer = google.maps.DirectionsRenderer;
  google.maps.DirectionsRenderer = DirectionsRendererMock;
}

export function setupMapTest(hooks) {
  hooks.beforeEach(function () {
    this.waitForMap = waitForMap.bind(this);

    let googleMapsApi = this.owner.lookup('service:google-maps-api');
    let testState = {
      googleMapsApi,
      originalGetApi: googleMapsApi._getApi,
      originalDirectionsRenderer: null,
    };

    this._googleMapsApiTestState = testState;

    patchGoogleMapsApiForTests(window.google, testState);

    googleMapsApi._getApi = async function (...args) {
      let google = await testState.originalGetApi.apply(this, args);

      patchGoogleMapsApiForTests(google, testState);

      return google;
    };

    Object.defineProperty(googleMapsApi, 'directionsService', {
      configurable: true,
      value: Promise.resolve(buildDirectionsService()),
    });
  });

  hooks.afterEach(function () {
    let { googleMapsApi, originalDirectionsRenderer, originalGetApi } =
      this._googleMapsApiTestState;

    googleMapsApi._getApi = originalGetApi;
    delete googleMapsApi.directionsService;

    if (originalDirectionsRenderer && window.google?.maps) {
      window.google.maps.DirectionsRenderer = originalDirectionsRenderer;
    }

    clearMapInstances();
  });
}

export async function waitForMap(id) {
  await settled();
  let mapInstance = await waitUntil(() => getMapInstance(id), {
    timeout: 5000,
  });
  await settled();

  return mapInstance;
}
