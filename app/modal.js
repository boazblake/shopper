const Modal = ({ attrs: { mdl } }) => {
  return {
    view: () =>
      m(
        ".w3-modal#modal",
        {
          style: { display: mdl.state.showModal ? "block" : "none" },
        },
        m(
          ".w3-Modal.content w3-card",
          m(
            "w3-container",

            mdl.state.modalContent
          )
        )
      ),
  }
}

export default Modal

