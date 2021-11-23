export class EventTarget<EventMap extends DefaultEventMap> {
  /**
   * A map of the event type and its listeners.
   * Key is the event type.
   * Value is the set of the listeners of the event.
   */
  #eventListeners: Map<keyof EventMap, Set<Listener<EventMap[keyof EventMap]>>>;

  constructor() {
    this.#eventListeners = new Map();
  }

  addEventListener<K extends keyof EventMap>(type: K, listener: Listener<EventMap[K]>) {
    if (typeof listener !== 'function') throw new Error('Event listener must be a function');

    const typedListener = listener as Listener<EventMap[keyof EventMap]>;
    const listeners = this.#eventListeners.get(type);
    if (listeners) {
      listeners.add(typedListener);
    } else {
      this.#eventListeners.set(type, new Set([typedListener]));
    }
  }

  dispatchEvent<K extends keyof EventMap>(type: K, event: EventMap[K]): void {
    const listeners = this.#eventListeners.get(type);
    if (listeners) listeners.forEach((listener) => listener(event));
  }

  removeEventListener<K extends keyof EventMap>(type: K, listener: Listener<EventMap[K]>) {
    if (typeof listener !== 'function') throw new Error('Event listener must be a function');

    const typedListener = listener as Listener<EventMap[keyof EventMap]>;
    const result = this.#eventListeners.get(type)?.delete(typedListener) ?? false;
    if (result === false) throw new Error('Event listener was never subscribed');
  }

  removeAllEventListeners(): void {
    this.#eventListeners.forEach((listeners, eventType) => {
      listeners.forEach((listener) => this.removeEventListener(eventType, listener));
    });
    this.#eventListeners.clear();
  }
}

type DefaultEventMap = Record<string, unknown>;

type Listener<Event> = (ev: Event) => void;
