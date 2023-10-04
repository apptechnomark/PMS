"use client";

import Wrapper from "@/components/common/Wrapper";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Home = () => {
  const router = useRouter();
  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/settings");
    } else {
      router.push("/login");
    }
  }, [router]);

  return <Wrapper>PMS</Wrapper>;
};

export default Home;
