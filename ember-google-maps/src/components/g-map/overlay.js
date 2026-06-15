import MapComponent from './map-component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';

import { toLatLng } from '../../utils/helpers';

export default class OverlayView extends MapComponent {
  id = `ember-google-maps-overlay-${guidFor(this)}`;

  areEventsBound = false;

  @tracked
  container = window?.document?.createElement('div');

  get name() {
    return 'overlays';
  }

  get zIndex() {
    return this.args.zIndex ?? 'auto';
  }

  get paneName() {
    return this.args.paneName ?? 'overlayMouseTarget';
  }

  get position() {
    let { lat, lng, position } = this.args;

    return position ?? toLatLng(lat, lng);
  }

  setup() {
    let Overlay = new google.maps.OverlayView();

    Overlay.onAdd = () => this.onAdd();
    Overlay.onRemove = () => this.onRemove();
    Overlay.draw = () => this.draw();

    // Make sure we don’t run “draw” before Google Maps has done so first.
    Overlay.didDraw = false;

    Overlay.setMap(this.map);

    // Explicitly track options here, as the Google Maps performs the setup
    // asynchronously.
    return [Overlay, Object.values(this.options)];
  }

  // TODO: support changing pane?
  update(overlay) {
    if (overlay.didDraw) {
      overlay.draw();
    }
  }

  onAdd() {
    let panes = this.mapComponent.getPanes();
    this.targetPane = panes[this.paneName];

    this.attachOverlayElement();
  }

  attachOverlayElement() {
    if (!this.targetPane || !this.overlayElement) {
      return;
    }

    if (this.overlayElement.parentNode !== this.targetPane) {
      this.targetPane.appendChild(this.overlayElement);
    }

    if (!this.areEventsBound) {
      this.addEventsToMapComponent(
        this.overlayElement,
        this.events,
        this.publicAPI,
      );

      this.areEventsBound = true;
    }
  }

  draw() {
    let { position, zIndex } = this;

    let overlayProjection = this.mapComponent.getProjection();
    let point = overlayProjection.fromLatLngToDivPixel(position);

    this.overlayElement.style.cssText = `
      position: absolute;
      left: 0;
      top: 0;
      height: 0;
      z-index: ${zIndex};
      transform: translateX(${point.x}px) translateY(${point.y}px);
    `;

    this.mapComponent.didDraw ||= true;
  }

  onRemove() {
    let parentNode = this.overlayElement.parentNode;

    if (parentNode) {
      parentNode.removeChild(this.overlayElement);
    }
  }

  teardown() {
    super.teardown(this.mapComponent);

    this.overlayElement = null;
    this.container = null;
    this.targetPane = null;
    this.areEventsBound = false;
  }

  @action
  getOverlay(element) {
    this.overlayElement = element;
    this.attachOverlayElement();
  }
}
