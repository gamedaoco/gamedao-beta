import { useDispatch, useSelector } from 'react-redux'
import { slice, blockStateSelector } from 'src/redux/block.slice'

export function useBlock() {
	const blockheight = useSelector(blockStateSelector)
	return blockheight
}


/*
import { useApiProvider } from '@substra-hooks/core'
import { useEffect, useState, useRef, useCallback } from "https://cdn.skypack.dev/react";
import { useWallet } from 'src/context/Wallet'

function debounce(func, wait) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			func.apply(context, args);
		};
    var immediate = wait === undefined
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
}


const DEFAULT_OPTIONS = {
  config: { attributes: true, childList: true, subtree: true },
  debounceTime: 0
};


function useMutationObservable(targetEl, cb, options = DEFAULT_OPTIONS) {
  const [observer, setObserver] = useState(null);

  useEffect(() => {
    if (!cb || typeof cb !== "function") {
      console.warn(
        `You must provide a valida callback function, instead you've provided ${cb}`
      );
      return;
    }
    const { debounceTime } = options;
    const obs = new MutationObserver(
      debounceTime > 0 ? debounce(cb, debounceTime) : cb
    );
    setObserver(obs);
  }, [cb, options, setObserver]);

  useEffect(() => {
    if (!observer) return;

    if (!targetEl) {
      console.warn(
        `You must provide a valid DOM element to observe, instead you've provided ${targetEl}`
      );
    }

    const { config } = options;

    try {
      observer.observe(targetEl, config);
    } catch (e) {
      console.error(e);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [observer, targetEl, options]);
}
*/