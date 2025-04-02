import React from "react";
import styled from "styled-components";

interface LoaderProps {
  size?: "small" | "medium" | "large";
}

const Loader = ({ size = "medium" }: LoaderProps) => {
  return (
    <StyledWrapper size={size}>
      <div className="loader" />
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div<{ size: string }>`
  .loader {
    height: ${(props) =>
      props.size === "small"
        ? "8px"
        : props.size === "large"
          ? "20px"
          : "15px"};
    aspect-ratio: 4;
    --_g: no-repeat radial-gradient(farthest-side, #4319ec 90%, #3604ff);
    background:
      var(--_g) left,
      var(--_g) right;
    background-size: 25% 100%;
    display: grid;
  }
  .loader:before,
  .loader:after {
    content: "";
    height: inherit;
    aspect-ratio: 1;
    grid-area: 1/1;
    margin: auto;
    border-radius: 50%;
    transform-origin: -100% 50%;
    background: #2600fff8;
    animation: l49 1s infinite linear;
  }
  .loader:after {
    transform-origin: 200% 50%;
    --s: -1;
    animation-delay: -0.5s;
  }

  @keyframes l49 {
    58%,
    100% {
      transform: rotate(calc(var(--s, 1) * 1turn));
    }
  }
`;

export default Loader;
