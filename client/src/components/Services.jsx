import React from "react";
import { BsCurrencyExchange,BsUnlockFill,BsFillShieldLockFill } from "react-icons/bs";
// import { BsUnlockFill } from "react-icons/bi";
import { RiHeart2Fill } from "react-icons/ri";

const ServiceCard = ({ color, title, icon }) => (
  <div className="flex flex-row justify-start items-start white-glassmorphism p-4 m-2 cursor-pointer hover:shadow-xl">
    <div className={`w-10 mt-3 h-10 rounded-full flex justify-center items-center ${color} border-2`}>
      {icon}
    </div>
    <div className="ml-5 flex flex-col flex-1">
      <h3 className="mt-2 text-white text-lg">{title}</h3>
    </div>
  </div>
);

const Services = () => (
  <div className="flex w-full justify-center items-center gradient-bg-services">
    <div className="flex mf:flex-row flex-col items-center justify-between md:pl-20 md:pr-20 px-4">
      <div className="flex-1 flex flex-col justify-start items-start">
        <h1 className="text-white text-3xl sm:text-5xl py-2 text-gradient ">
          Services that we
          <br />
          continue to improve
        </h1>
        <p className="text-left my-2 text-white font-light md:w-9/12 w-11/12 text-base">
        We believe in continuous improvement and are constantly working to enhance our services.
        </p>
      </div>

      <div className="flex-1 flex flex-col justify-start items-center">
        <ServiceCard
          color="bg-[transparent]"
          title="Exchange Ethereum in seconds - simple, efficient, and trustworthy."
          icon={<BsCurrencyExchange fontSize={21} className="text-white" />}
          // subtitle="Security is guranteed. We always maintain privacy and maintain the quality of our products"
        />
        <ServiceCard
          color="bg-[transparent]"
          title="Unlock the power of Ethereum - swap it effortlessly on our exchange."
          icon={<BsUnlockFill fontSize={21} className="text-white" />}
          // subtitle="Security is guranteed. We always maintain privacy and maintain the quality of our products"
          />
        <ServiceCard
          color="bg-[transparent]"
          title="Secure and reliable Ethereum exchange - because trust matters."
          icon={<BsFillShieldLockFill fontSize={21} className="text-white" />}
          // subtitle="Security is guranteed. We always maintain privacy and maintain the quality of our products"
        />
      </div>
    </div>
  </div>
);

export default Services;
