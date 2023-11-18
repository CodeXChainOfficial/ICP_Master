import styled from "@emotion/styled";
import MuiModal from "@mui/material/Modal";

type Props = {
  open: boolean;
  children: JSX.Element; // This must be a a jsx element => <div></div> | <Component></Component>
  className?: string;
  onClose?: () => void;
};

const Modal = ({ children, className, open, onClose }: Props) => {
  const wrapperClass = "modal-wrapper-23kk";

  const canClose = !!onClose;

  className = className ? `${wrapperClass} ${className}` : wrapperClass;
  className = className + " " + (canClose ? "canClose" : "");

  const raiseClose = (e: any) => {
    if (!onClose) return;

    const contentElement = document.querySelector(`.${wrapperClass} > *`)!;

    const dialogDimensions = contentElement.getBoundingClientRect();
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      onClose();
    }
  };

  return (
    <MuiModal open={open}>
      <Wrapper onClick={raiseClose} className={className}>
        {children}
      </Wrapper>
    </MuiModal>
  );
};

const Wrapper = styled.div`
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  backdrop-filter: blur(2px);
  padding-inline: 10px;

  &.canClose {
    cursor: pointer;
  }

  & > * {
    cursor: context-menu;
  }
`;

export default Modal;
