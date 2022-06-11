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
          "dialoge.w3-Modal.content w3-card",
          m(".w3-container", mdl.state.modalContent)
        )
      ),
  }
}

export default Modal

