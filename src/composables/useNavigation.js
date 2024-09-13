import { useRouter } from 'vue-router';

export const useNavigation = () => {
  const router = useRouter();

  const goToRoute = (routeName) => {
    router.push(routeName);
  };

  return {
    goToRoute,
  };
};
