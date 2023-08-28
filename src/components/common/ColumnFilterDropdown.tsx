import React, { useEffect, useRef, useState } from "react";
import { CheckBox } from "next-ts-lib";
import ColFilterIcon from "@/assets/icons/ColFilterIcon";

interface ColumnFilterDropdownProps {
  headers: any[];
  visibleHeaders: any[];
  handleHeaderToggle: (header: string) => void;
}

const ColumnFilterDropdown: React.FC<ColumnFilterDropdownProps> = ({
  headers,
  visibleHeaders,
  handleHeaderToggle,
}) => {
  const [open, setOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const handleToggleOpen = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    window.addEventListener("click", handleOutsideClick);

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <div ref={selectRef}>
      <span className="cursor-pointer absolute -mt-3 right-2">
        <span onClick={handleToggleOpen}>
          <ColFilterIcon />
        </span>
        {open && (
          <div className="mt-3 -right-20 absolute">
            <ul
              className={`py-2 z-10 bg-pureWhite !min-h-fit !min-w-[220px] transition-transform drop-shadow-lg 
          ${
            open
              ? "max-h-full translate-y-0 transition-opacity opacity-100 duration-500"
              : "max-h-0 translate-y-5 transition-opacity opacity-0 duration-500"
          } 
          ${open ? "ease-out" : ""}
          `}
            >
              {headers.map((header) => (
                <li
                  key={header}
                  className="p-2 hover:bg-whiteSmoke font-normal cursor-pointer flex"
                >
                  <label id="dropdown">
                    <CheckBox
                      id={header}
                      label={header}
                      checked={visibleHeaders.includes(header)}
                      onChange={(e) => handleHeaderToggle(header)}
                    />
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}
      </span>
    </div>
  );
};

export default ColumnFilterDropdown;
