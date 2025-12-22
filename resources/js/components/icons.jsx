import React from "react";

const svgModules = import.meta.glob("./Icons/*.svg", { eager: true });

const iconComponents = Object.entries(svgModules).reduce((acc, [path, module]) => {
  const name = path.split("/").pop().replace(".svg", "").toLowerCase();

  const SvgIcon = (props) => (
    <img
      src={module.default}
      alt={name}
      {...props}
      style={{ display: "inline-block", verticalAlign: "middle" }}
    />
  );

  acc[name] = SvgIcon;
  return acc;
}, {});

export default function OsIcon({ name, className = "w-6 h-6", ...props }) {
  const IconComponent = iconComponents[name?.toLowerCase()];
  if (!IconComponent) {
    console.warn(`⚠️ Icon "${name}" tidak ditemukan di folder /Icons`);
    return null;
  }

  return <IconComponent className={className} {...props} />;
}
