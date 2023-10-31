import React from "react";

const PauseButton = () => {
  const svgStyle = {
    width: "28px",
    height: "28px",
  };
  return (
    <div>
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <mask
          id="mask0_2773_149823"
          style={svgStyle}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="28"
          height="28"
        >
          <rect width="28" height="28" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2773_149823)">
          <path
            d="M11.868 18.519C12.1821 18.519 12.4453 18.4128 12.6578 18.2003C12.8703 17.9878 12.9765 17.7246 12.9765 17.4105V10.7595C12.9765 10.4454 12.8703 10.1822 12.6578 9.96969C12.4453 9.75723 12.1821 9.651 11.868 9.651C11.5539 9.651 11.2907 9.75723 11.0782 9.96969C10.8657 10.1822 10.7595 10.4454 10.7595 10.7595V17.4105C10.7595 17.7246 10.8657 17.9878 11.0782 18.2003C11.2907 18.4128 11.5539 18.519 11.868 18.519ZM16.302 18.519C16.6161 18.519 16.8793 18.4128 17.0918 18.2003C17.3043 17.9878 17.4105 17.7246 17.4105 17.4105V10.7595C17.4105 10.4454 17.3043 10.1822 17.0918 9.96969C16.8793 9.75723 16.6161 9.651 16.302 9.651C15.9879 9.651 15.7247 9.75723 15.5122 9.96969C15.2997 10.1822 15.1935 10.4454 15.1935 10.7595V17.4105C15.1935 17.7246 15.2997 17.9878 15.5122 18.2003C15.7247 18.4128 15.9879 18.519 16.302 18.519ZM14.085 25.17C12.5516 25.17 11.1105 24.879 9.76185 24.2971C8.41318 23.7151 7.24001 22.9253 6.24236 21.9276C5.24471 20.93 4.45491 19.7568 3.87294 18.4082C3.29098 17.0595 3 15.6184 3 14.085C3 12.5516 3.29098 11.1105 3.87294 9.76185C4.45491 8.41318 5.24471 7.24001 6.24236 6.24236C7.24001 5.24471 8.41318 4.45491 9.76185 3.87294C11.1105 3.29098 12.5516 3 14.085 3C15.6184 3 17.0595 3.29098 18.4082 3.87294C19.7568 4.45491 20.93 5.24471 21.9276 6.24236C22.9253 7.24001 23.7151 8.41318 24.2971 9.76185C24.879 11.1105 25.17 12.5516 25.17 14.085C25.17 15.6184 24.879 17.0595 24.2971 18.4082C23.7151 19.7568 22.9253 20.93 21.9276 21.9276C20.93 22.9253 19.7568 23.7151 18.4082 24.2971C17.0595 24.879 15.6184 25.17 14.085 25.17ZM14.085 22.953C16.5606 22.953 18.6576 22.0939 20.3757 20.3757C22.0939 18.6576 22.953 16.5606 22.953 14.085C22.953 11.6094 22.0939 9.51244 20.3757 7.79426C18.6576 6.07609 16.5606 5.217 14.085 5.217C11.6094 5.217 9.51244 6.07609 7.79426 7.79426C6.07609 9.51244 5.217 11.6094 5.217 14.085C5.217 16.5606 6.07609 18.6576 7.79426 20.3757C9.51244 22.0939 11.6094 22.953 14.085 22.953Z"
            fill="#FFC107"
          />
        </g>
      </svg>
    </div>
  );
};

export default PauseButton;
