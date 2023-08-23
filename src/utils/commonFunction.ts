/* eslint-disable react-hooks/rules-of-hooks */
// import { useRouter } from "next/navigation";

const hasToken = (router: any) => {
  const token = localStorage.getItem("token");
  if (token) {
    router.push("/settings");
  }
};

const hasNoToken = (router: any) => {
  const token = localStorage.getItem("token");
  if (!token) {
    router.push("/login");
  }
};

// const getHeaderOptions = (props?: any) => {
//   const router = useRouter();
//   let token: String | null = localStorage.getItem("token");
//   let headerOptions: any = {
//     "Content-Type": "application/json",
//     props,
//   };
//   if (token) {
//     headerOptions = {
//       ...headerOptions,
//       Authorization: token,
//     };
//   } else {
//     router.push("/login");
//   }
//   return headerOptions;
// };

export { hasToken, hasNoToken };
