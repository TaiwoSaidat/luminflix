import type { StaticImageData } from "next/image";
import green from "@/assets/profileGreen.png";

export type Profile = {
  id: string;
  name: string;
  avatar: StaticImageData;
};

export const profiles: Profile[] = [
  { id: "1", name: "Taiwo", avatar: green },
  { id: "2", name: "Kenny", avatar: green },
  { id: "3", name: "mummy", avatar: green },
  { id: "4", name: "id", avatar: green },
];
