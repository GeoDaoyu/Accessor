type Effect = {
  execute: () => void;
  dependencies: Set<Set<Effect>>;
};

const context: Effect[] = [];

function subscribe(running: Effect, subscriptions: Set<Effect>) {
  subscriptions.add(running);
  running.dependencies.add(subscriptions);
}

function cleanup(running: Effect) {
  for (const dep of running.dependencies) {
    dep.delete(running);
  }
  running.dependencies.clear();
}

export function createEffect(fn: () => void) {
  const execute = () => {
    cleanup(running);
    context.push(running);
    try {
      fn();
    } finally {
      context.pop();
    }
  };

  const running: Effect = {
    execute,
    dependencies: new Set(),
  };

  execute();
}

export function createSignal<T>(value: T) {
  const subscriptions = new Set<Effect>();

  const read = (): T => {
    const running = context[context.length - 1];
    if (running) subscribe(running, subscriptions);
    return value;
  };

  const write = (nextValue: T) => {
    value = nextValue;

    for (const sub of [...subscriptions]) {
      sub.execute();
    }
  };
  return [read, write] as const;
}
