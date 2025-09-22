import classNames from "classnames";
import React from "react";

const Avatar = ({
  icon: Icon,
  text,
  className = "",
}: {
  icon?: any;
  text?: string;
  className?: string;
}) => (
  <div
    className={classNames(
      "w-8 h-8 bg-black rounded-full text-white flex items-center justify-center flex-shrink-0",
      className
    )}
  >
    {Icon ? <Icon className="text-white" /> : text}
  </div>
);

export default Avatar;
