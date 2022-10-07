import ReactModal, { Props as ModalProps } from "react-modal";

import styles from "./modal.module.css";

ReactModal.setAppElement("#root");

export default function Modal({ children, ...rest }: ModalProps) {
  return (
    <ReactModal
      className={styles.modal}
      overlayClassName={styles.modalOverlay}
      shouldCloseOnOverlayClick={false}
      {...rest}
    >
      {children}
    </ReactModal>
  );
}
