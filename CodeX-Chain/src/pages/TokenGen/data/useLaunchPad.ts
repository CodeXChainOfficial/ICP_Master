import useSWR from "swr/immutable";

export const useLaunchPadForm = () => {



};

export const useConfirmationCount = () => {
  // count -> 2 = canDeploy; 3 = startDeploy.

  const { data, mutate } = useSWR<number>("lp-deploy-confirmation", { fallbackData: 0 });

  return [data, mutate] as [number, typeof mutate];
};
