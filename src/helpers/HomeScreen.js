import * as React from "react";

export function useAddToHomescreenPrompt() {
  const [deferredPrompt, setDeferredPrompt] = React.useState(null);
  const [isVisible, setIsVisible] = React.useState(false);

  const onHhandlePrompt = (event) => {
    setDeferredPrompt(event);
    setIsVisible(true);
  }

  const getIsVisible = () => {
    return isVisible;
  };

  const promptToInstall = () => {
    deferredPrompt.prompt();
  };

  React.useEffect(() => {
    window.addEventListener("beforeinstallprompt", onHhandlePrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", onHhandlePrompt);
    };
  }, []);

  return [getIsVisible, promptToInstall];
}