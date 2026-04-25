import { useEffect, useRef } from "react";

const useScreenPerformance = (screenName) => {
  const startTime = useRef(Date.now());

  useEffect(() => {
    const duration = Date.now() - startTime.current;
    console.log(`⏱ [PERF] ${screenName}: ${duration}ms`);
  }, []);
};

export default useScreenPerformance;
