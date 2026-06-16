import MapComponent from './map-component.js';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { assert } from '@ember/debug';
import { precompileTemplate } from '@ember/template-compilation';
import { n } from 'decorator-transforms/runtime-esm';
import { setComponentTemplate } from '@ember/component';

var TEMPLATE = precompileTemplate("{{#if (has-block)}}\n  {{yield (hash setup=this.getInput)}}\n{{else}}\n  <input\n    id={{this.id}}\n    ...attributes\n    {{g-map/did-insert this.getInput}}\n  />\n{{/if}}");

class Autocomplete extends MapComponent {
  id = `ember-google-maps-autocomplete-${guidFor(this)}`;
  get name() {
    return 'autocompletes';
  }
  setup(options, events) {
    assert(`
ember-google-maps: No input found for autocomplete.

When using the block form of the autocomplete component, make sure to call the “setup” method on your input to let autocomplete know about it:

<map.autocomplete as |autocomplete|>
  <input {{did-insert autocomplete.setup}} />
</map.autocomplete>

Did you mean to use the block form? You can also do the following:

<map.autocomplete id="my-custom-id" class="my-custom-class" />
      `, this.inputElement);
    let autocomplete = new google.maps.places.Autocomplete(this.inputElement, options);
    this.addEventsToMapComponent(autocomplete, events, this.publicAPI);

    // Compatibility: Register the custom `onSearch` event.
    let onSearch = this.args.onSearch;
    if (onSearch && typeof onSearch === 'function') {
      this.addEventsToMapComponent(autocomplete, {
        onPlaceChanged: onSearch
      }, this.publicAPI);
    }
    return autocomplete;
  }
  update(mapComponent) {
    mapComponent?.setOptions?.(this.newOptions);
    return mapComponent;
  }
  getInput(input) {
    this.inputElement = input;
  }
  static {
    n(this.prototype, "getInput", [action]);
  }
}
setComponentTemplate(TEMPLATE, Autocomplete);

export { Autocomplete as default };
//# sourceMappingURL=autocomplete.js.map
