import m from "mithril"
const Modal = ({ attrs: { mdl } }) => {
  return {
    view: () =>
      m(
        ".w3-modal#modal",
        {
          onclick: (e) => {
            if (e.target.id == "modal") {
              mdl.state.showModal = false
              mdl.state.modalContent = null
            }
          },
          style: { display: mdl.state.showModal ? "block" : "none" },
        },
        m(
          "modal.w3-modal-content",
          m(".w3-container", mdl.state.modalContent)
        )
      ),
  }
}

export default Modal

