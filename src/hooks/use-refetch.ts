import { useQueryClient } from "@tanstack/react-query";

const useRefetch = () => {
  const queryClient = useQueryClient();

  return async () => {
    console.log("Refetching projects...");
    await queryClient.invalidateQueries({ queryKey: ["projects"] });
  };
};

export default useRefetch;
