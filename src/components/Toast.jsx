import React from "react";

export default function Toast({ message }) {
  return (
    <div className="hs-toast animate-slideUp">
      {message}
    </div>
  );
}
