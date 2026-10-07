	import { useEffect, useSyncExternalStore } from "react";

	/** Nombre de cartes actuellement montées */
	export const counters = { mounted: 0 };

	const listeners = new Set<() => void>();

	function notify() {
	  for (const listener of listeners) {
	    listener();
	  }
	}

	export function incrementMounted() {
	  counters.mounted += 1;
	  notify();
	}

	export function decrementMounted() {
	  counters.mounted = Math.max(0, counters.mounted - 1);
	  notify();
	}

	function subscribe(listener: () => void) {
	  listeners.add(listener);
	  return () => listeners.delete(listener);
	}

	function getMounted() {
	  return Number.isFinite(counters.mounted) ? counters.mounted : 0;
	}

	/** Log le temps de montage de l'écran, et renvoie le nombre de cartes montées */
	export function usePerf(label: string) {
	  const mounted = useSyncExternalStore(subscribe, getMounted, getMounted);

	  useEffect(() => {
	    console.log(`[perf] ${label} : écran monté`);
	  }, [label]);

	  return mounted;
	}