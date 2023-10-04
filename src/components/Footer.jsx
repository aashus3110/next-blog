import React from "react";

const Footer = () => {
  return (
    <footer className={`w-full h-64 mt-12`}>
      <div className={`w-4/5 h-full mx-auto flex justify-between items-center`}>
        <div className={`flex flex-col gap-2`}>
          <h2 className="mb-4 justify-self-start -ml-1">About the App</h2>
          <p className="max-w-[425px] text-sm">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nulla
            omnis exercitationem ducimus modi quidem debitis iusto neque ab
            laboriosam sapiente.
          </p>
        </div>
        <div className={`flex flex-col gap-2`}>
          <h2 className="mb-4 justify-self-start -ml-1">Contacts</h2>
          <span>Phone +91 76200 753992</span>
          <span>GitHub: Aashus3110</span>
          <span>GitHub: Aashus3110</span>
        </div>
        <div className={`flex flex-col gap-2`}>
          <h2 className="mb-4 justify-self-start -ml-1">Location</h2>
          <span>Pune, Maharashtra</span>
          <span>Pune, Maharashtra</span>
          <span>Pune, Maharashtra</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
